<?php
/**
 * img.php - Otimizador/resize de imagens com cache em disco.
 *
 * Uso:
 *   /img.php?src=uploads/passeios/.../foto.jpg&w=640&fmt=auto&q=78
 *   /img.php?src=assets/img/Genipabu.png&w=1600&fmt=auto&q=70
 *   /img.php?src=assets/img/vumbora.png&h=100&fmt=auto&q=85
 *
 * Parâmetros:
 * - src: caminho relativo dentro do public_html (somente allowlist: uploads/passeios e assets/img)
 * - w / h: largura/altura desejada (px). Se apenas um for informado, mantém proporção.
 * - fit: "contain" (default) ou "cover" (corta para preencher w+h).
 * - q: qualidade (1-100). Default: 80.
 * - fmt: "auto" (default), "webp", "avif", "jpeg", "png"
 */

declare(strict_types=1);

// -----------------------------
// Helpers
// -----------------------------
function starts_with(string $haystack, string $needle): bool {
  return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
}

function respond(int $status, string $message): void {
  http_response_code($status);
  header('Content-Type: text/plain; charset=utf-8');
  echo $message;
  exit;
}

function clamp_int($value, int $min, int $max, int $default): int {
  if ($value === null || $value === '') return $default;
  if (!is_numeric($value)) return $default;
  $i = (int)$value;
  if ($i < $min) return $min;
  if ($i > $max) return $max;
  return $i;
}

function client_accepts(string $mime): bool {
  $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
  return stripos($accept, $mime) !== false;
}

function is_gd_available(): bool {
  return extension_loaded('gd') && function_exists('gd_info');
}

function pick_output_format(string $requestedFmt, string $srcMime, bool $srcHasAlpha): array {
  // returns [fmt, mime, ext, varyAccept]
  $requestedFmt = strtolower(trim($requestedFmt));

  // Explicit formats first
  if (in_array($requestedFmt, ['webp', 'jpeg', 'jpg', 'png', 'avif'], true)) {
    if ($requestedFmt === 'jpg') $requestedFmt = 'jpeg';
    if ($requestedFmt === 'avif') {
      if (function_exists('imageavif')) return ['avif', 'image/avif', 'avif', false];
      // fallback
      $requestedFmt = 'auto';
    } else if ($requestedFmt === 'webp') {
      if (function_exists('imagewebp')) return ['webp', 'image/webp', 'webp', false];
      $requestedFmt = 'auto';
    } else if ($requestedFmt === 'png') {
      return ['png', 'image/png', 'png', false];
    } else if ($requestedFmt === 'jpeg') {
      return ['jpeg', 'image/jpeg', 'jpg', false];
    }
  }

  // AUTO: tenta AVIF > WebP > (PNG se precisar de alpha) > JPEG
  $vary = true;
  if (client_accepts('image/avif') && function_exists('imageavif')) {
    return ['avif', 'image/avif', 'avif', $vary];
  }
  if (client_accepts('image/webp') && function_exists('imagewebp')) {
    return ['webp', 'image/webp', 'webp', $vary];
  }

  if ($srcMime === 'image/png' && $srcHasAlpha) {
    return ['png', 'image/png', 'png', $vary];
  }

  // Fallback padrão: JPEG para fotos (inclusive PNG sem alpha)
  return ['jpeg', 'image/jpeg', 'jpg', $vary];
}

function detect_png_alpha($img): bool {
  // Tentativa rápida: transparência indexada
  if (imagecolortransparent($img) >= 0) return true;

  // Amostragem de pixels para alpha (evita varrer toda imagem)
  $w = imagesx($img);
  $h = imagesy($img);
  if ($w <= 0 || $h <= 0) return false;

  $samplesX = 12;
  $samplesY = 12;
  $stepX = max(1, (int)floor($w / $samplesX));
  $stepY = max(1, (int)floor($h / $samplesY));

  for ($y = 0; $y < $h; $y += $stepY) {
    for ($x = 0; $x < $w; $x += $stepX) {
      $rgba = imagecolorat($img, $x, $y);
      $alpha = ($rgba & 0x7F000000) >> 24; // 0 (opaco) .. 127 (transparente)
      if ($alpha > 0) return true;
    }
  }
  return false;
}

function load_gd_image(string $path, string $mime) {
  switch ($mime) {
    case 'image/jpeg':
      return @imagecreatefromjpeg($path);
    case 'image/png':
      return @imagecreatefrompng($path);
    case 'image/webp':
      return function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false;
    default:
      return false;
  }
}

function output_image_to_file($img, string $fmt, string $path, int $q): bool {
  if ($fmt === 'webp') {
    if (!function_exists('imagewebp')) return false;
    return @imagewebp($img, $path, $q);
  }
  if ($fmt === 'avif') {
    if (!function_exists('imageavif')) return false;
    // imageavif usa qualidade 0-100 (quando suportado)
    return @imageavif($img, $path, $q);
  }
  if ($fmt === 'png') {
    // PNG usa compressão 0-9. Converter qualidade (maior q => menor compressão)
    $level = (int)round((100 - $q) * 9 / 100);
    $level = max(0, min(9, $level));
    return @imagepng($img, $path, $level);
  }
  // JPEG
  if ($fmt === 'jpeg') {
    @imageinterlace($img, 1);
    return @imagejpeg($img, $path, $q);
  }
  return false;
}

function serve_file(string $path, string $mime, bool $varyAccept): void {
  if (!is_file($path)) respond(404, 'Arquivo não encontrado.');

  $mtime = filemtime($path) ?: time();
  $size = filesize($path) ?: 0;
  $etag = '"' . sha1($path . '|' . $mtime . '|' . $size) . '"';

  if ($varyAccept) header('Vary: Accept');
  header('Content-Type: ' . $mime);
  header('Cache-Control: public, max-age=31536000, immutable');
  header('ETag: ' . $etag);
  header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');

  $ifNoneMatch = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
  if ($ifNoneMatch && trim($ifNoneMatch) === $etag) {
    http_response_code(304);
    exit;
  }

  $ifModifiedSince = $_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '';
  if ($ifModifiedSince) {
    $since = strtotime($ifModifiedSince);
    if ($since !== false && $since >= $mtime) {
      http_response_code(304);
      exit;
    }
  }

  if ($size > 0) header('Content-Length: ' . $size);
  readfile($path);
  exit;
}

// -----------------------------
// Entrada
// -----------------------------
$src = (string)($_GET['src'] ?? '');
$src = trim($src);
if ($src === '') respond(400, 'Parâmetro src é obrigatório.');
$src = ltrim($src, '/\\');

// Segurança: resolve realpath e valida allowlist
$root = realpath(__DIR__);
if ($root === false) respond(500, 'Erro interno (root).');

$fullPath = realpath(__DIR__ . DIRECTORY_SEPARATOR . $src);
if ($fullPath === false || !is_file($fullPath)) respond(404, 'Imagem não encontrada.');

$allowedA = realpath(__DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'passeios');
$allowedB = realpath(__DIR__ . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'img');
if ($allowedA === false || $allowedB === false) {
  respond(500, 'Erro interno (allowlist).');
}

$ok =
  starts_with($fullPath, $allowedA . DIRECTORY_SEPARATOR) ||
  starts_with($fullPath, $allowedB . DIRECTORY_SEPARATOR) ||
  $fullPath === $allowedA || $fullPath === $allowedB;

if (!$ok) respond(403, 'Caminho não permitido.');

// Parâmetros de transformação
$w = clamp_int($_GET['w'] ?? null, 1, 3000, 0);
$h = clamp_int($_GET['h'] ?? null, 1, 3000, 0);
$q = clamp_int($_GET['q'] ?? null, 30, 95, 80);
$fit = strtolower((string)($_GET['fit'] ?? 'contain'));
if (!in_array($fit, ['contain', 'cover'], true)) $fit = 'contain';
$requestedFmt = (string)($_GET['fmt'] ?? 'auto');

// Mime + dimensões
$info = @getimagesize($fullPath);
if (!$info || !isset($info['mime'])) respond(415, 'Formato de imagem não suportado.');
$srcMime = (string)$info['mime'];
if (!in_array($srcMime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
  respond(415, 'Formato de imagem não suportado.');
}
$srcW = (int)($info[0] ?? 0);
$srcH = (int)($info[1] ?? 0);
if ($srcW <= 0 || $srcH <= 0) respond(415, 'Imagem inválida.');

// Se não pediu resize nem troca de formato, serve direto (mas ainda com cache forte)
if (($w === 0 && $h === 0) && (strtolower(trim($requestedFmt)) === 'auto')) {
  // Mesmo em auto, podemos servir original (sem reencode). Sem Vary.
  serve_file($fullPath, $srcMime, false);
}

if (!is_gd_available()) {
  // Sem GD: não dá pra otimizar. Serve original.
  serve_file($fullPath, $srcMime, false);
}

// Carrega imagem no GD
$img = load_gd_image($fullPath, $srcMime);
if (!$img) {
  serve_file($fullPath, $srcMime, false);
}

$srcHasAlpha = false;
if ($srcMime === 'image/png') {
  $srcHasAlpha = detect_png_alpha($img);
}

[$outFmt, $outMime, $outExt, $varyAccept] = pick_output_format($requestedFmt, $srcMime, $srcHasAlpha);

// Calcula novo tamanho
$targetW = $w;
$targetH = $h;
if ($targetW === 0 && $targetH === 0) {
  $targetW = $srcW;
  $targetH = $srcH;
} else if ($targetW === 0) {
  $targetW = (int)round($srcW * ($targetH / $srcH));
} else if ($targetH === 0) {
  $targetH = (int)round($srcH * ($targetW / $srcW));
}

// Nunca upscale
$scale = min($targetW / $srcW, $targetH / $srcH, 1.0);
if ($scale < 1.0) {
  $targetW = max(1, (int)floor($srcW * $scale));
  $targetH = max(1, (int)floor($srcH * $scale));
} else {
  $targetW = $srcW;
  $targetH = $srcH;
}

// Limite de pixels (evita explosão de memória)
$maxPixels = 16_000_000; // ~16MP
if (($targetW * $targetH) > $maxPixels) {
  // Reescala para caber
  $ratio = sqrt($maxPixels / ($targetW * $targetH));
  $targetW = max(1, (int)floor($targetW * $ratio));
  $targetH = max(1, (int)floor($targetH * $ratio));
}

// Cache
$srcMtime = filemtime($fullPath) ?: time();
$cacheBaseDir = __DIR__ . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR . 'images';
if (!is_dir($cacheBaseDir)) {
  @mkdir($cacheBaseDir, 0755, true);
}
if (!is_dir($cacheBaseDir) || !is_writable($cacheBaseDir)) {
  $cacheBaseDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vumbora-img-cache';
  if (!is_dir($cacheBaseDir)) {
    @mkdir($cacheBaseDir, 0755, true);
  }
}

$cacheKey = sha1($fullPath . '|' . $srcMtime . '|w=' . $targetW . '|h=' . $targetH . '|fit=' . $fit . '|q=' . $q . '|fmt=' . $outFmt);
$cachePath = $cacheBaseDir . DIRECTORY_SEPARATOR . $cacheKey . '.' . $outExt;

if (is_file($cachePath) && (filemtime($cachePath) ?: 0) >= $srcMtime) {
  imagedestroy($img);
  serve_file($cachePath, $outMime, $varyAccept);
}

// Redimensiona (contain) - e "cover" só se w+h foram informados
$dst = null;
if ($fit === 'cover' && $w > 0 && $h > 0) {
  // Corta para preencher exatamente w x h (respeitando limite de upscale já aplicado)
  $dstW = $targetW;
  $dstH = $targetH;

  $srcRatio = $srcW / $srcH;
  $dstRatio = $dstW / $dstH;

  if ($srcRatio > $dstRatio) {
    // source é mais "larga" -> corta laterais
    $cropH = $srcH;
    $cropW = (int)round($srcH * $dstRatio);
    $cropX = (int)floor(($srcW - $cropW) / 2);
    $cropY = 0;
  } else {
    // source é mais "alta" -> corta topo/baixo
    $cropW = $srcW;
    $cropH = (int)round($srcW / $dstRatio);
    $cropX = 0;
    $cropY = (int)floor(($srcH - $cropH) / 2);
  }

  $dst = imagecreatetruecolor($dstW, $dstH);
  if ($outFmt === 'png' || $outFmt === 'webp' || $outFmt === 'avif') {
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $dstW, $dstH, $transparent);
  }
  imagecopyresampled($dst, $img, 0, 0, $cropX, $cropY, $dstW, $dstH, $cropW, $cropH);
} else {
  $dst = imagecreatetruecolor($targetW, $targetH);
  if ($outFmt === 'png' || $outFmt === 'webp' || $outFmt === 'avif') {
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $targetW, $targetH, $transparent);
  }
  imagecopyresampled($dst, $img, 0, 0, 0, 0, $targetW, $targetH, $srcW, $srcH);
}

imagedestroy($img);

if (!$dst) {
  serve_file($fullPath, $srcMime, false);
}

// Salva no cache
$saved = output_image_to_file($dst, $outFmt, $cachePath, $q);
imagedestroy($dst);

if (!$saved) {
  // Se falhar ao salvar (permissão/codec), serve original
  serve_file($fullPath, $srcMime, false);
}

serve_file($cachePath, $outMime, $varyAccept);


