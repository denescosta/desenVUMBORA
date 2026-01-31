<?php
// config.php - Configurações do painel

// Nota: upload_max_filesize e post_max_size só podem ser definidos no php.ini ou .htaccess
// Para o Railway, usamos o arquivo php.ini na raiz do projeto
// Essas configurações são aplicadas no start.sh

// Verificar se há erro de POST muito grande ANTES de processar qualquer coisa
// Isso acontece quando o PHP emite warnings antes de executar o código
if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST) && !empty($_SERVER['CONTENT_LENGTH'])) {
    $contentLength = (int)$_SERVER['CONTENT_LENGTH'];
    $postMaxSize = ini_get('post_max_size');
    
    // Converter post_max_size para bytes
    $postMaxSizeBytes = 8388608; // padrão 8MB
    if (preg_match('/(\d+)([KMGT]?)/i', $postMaxSize, $matches)) {
        $size = (int)$matches[1];
        $unit = strtoupper($matches[2] ?? '');
        $multiplier = 1;
        if ($unit === 'K') $multiplier = 1024;
        elseif ($unit === 'M') $multiplier = 1048576;
        elseif ($unit === 'G') $multiplier = 1073741824;
        $postMaxSizeBytes = $size * $multiplier;
    }
    
    if ($contentLength > $postMaxSizeBytes) {
        // Limpar qualquer output anterior
        if (ob_get_level()) {
            ob_clean();
        }
        
        // Tentar redirecionar, mas se headers já foram enviados, mostrar página de erro
        if (!headers_sent()) {
            header('Location: formulario-passeio.php?erro=' . urlencode('Arquivo muito grande! O tamanho total (' . round($contentLength / 1048576, 2) . 'MB) excede o limite configurado (' . $postMaxSize . '). O servidor precisa ser reiniciado para aplicar as novas configurações.'));
            exit;
        } else {
            // Headers já enviados, mostrar página de erro inline
            die('
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro de Upload</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                    .error-box { background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 50px auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #e74c3c; margin-bottom: 20px; }
                    p { line-height: 1.6; color: #555; }
                    .btn { display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="error-box">
                    <h1>⚠️ Arquivo Muito Grande</h1>
                    <p>O tamanho total dos arquivos enviados (' . round($contentLength / 1048576, 2) . 'MB) excede o limite configurado no servidor (' . $postMaxSize . ').</p>
                    <p><strong>Solução:</strong> O servidor precisa ser reiniciado para aplicar as novas configurações de upload (20MB). Entre em contato com o administrador ou aguarde alguns minutos.</p>
                    <p><strong>Alternativa:</strong> Tente enviar menos fotos por vez ou reduza o tamanho das imagens antes de enviar.</p>
                    <a href="formulario-passeio.php" class="btn">← Voltar</a>
                </div>
            </body>
            </html>
            ');
        }
    }
}

// Iniciar output buffering para evitar problemas com headers
if (!ob_get_level()) {
    ob_start();
}

// Suprimir warnings de headers se já foram enviados (para uploads grandes)
if (headers_sent()) {
    // Headers já foram enviados, não podemos iniciar sessão normalmente
    // Mas ainda podemos usar a sessão se já estiver ativa
    if (session_status() === PHP_SESSION_NONE) {
        @session_start();
    }
} else {
    // Verificar se a sessão já foi iniciada
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

// IMPORTANTE: Altere estas credenciais!
define('ADMIN_USER', 'eduboy'); // MUDE ISSO
define('ADMIN_PASS', ':gzMh5BB>P!JD76'); // MUDE ISSO - use senha forte!

// Caminhos
define('DATA_PATH', '../data/passeios.json');
define('UPLOADS_PATH', '../uploads/passeios/');
define('TESTIMONIALS_PATH', '../data/testimonials.json');

// Função para verificar se está logado
function verificarLogin() {
    if (!isset($_SESSION['admin_logado']) || $_SESSION['admin_logado'] !== true) {
        header('Location: login.php');
        exit;
    }
}

// Função para carregar passeios
function carregarPasseios() {
    if (!file_exists(DATA_PATH)) {
        return ['passeios' => []];
    }
    $json = file_get_contents(DATA_PATH);
    return json_decode($json, true);
}

// Função para salvar passeios
function salvarPasseios($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents(DATA_PATH, $json);
}

// Função para criar slug
function criarSlug($texto) {
    $texto = strtolower($texto);
    $texto = preg_replace('/[^a-z0-9]+/', '-', $texto);
    $texto = trim($texto, '-');
    return $texto;
}

// Função para corrigir orientação EXIF de imagens
function corrigirOrientacaoImagem($caminhoImagem) {
    if (!function_exists('exif_read_data') || !function_exists('imagecreatefromjpeg')) {
        return false; // Extensões não disponíveis
    }
    
    $extensao = strtolower(pathinfo($caminhoImagem, PATHINFO_EXTENSION));
    if (!in_array($extensao, ['jpg', 'jpeg'])) {
        return false; // Apenas JPEG tem EXIF
    }
    
    // Ler dados EXIF
    $exif = @exif_read_data($caminhoImagem);
    if (!$exif || !isset($exif['Orientation'])) {
        return false; // Sem dados de orientação
    }
    
    // Carregar imagem
    $imagem = @imagecreatefromjpeg($caminhoImagem);
    if (!$imagem) {
        return false;
    }
    
    // Aplicar rotação baseada na orientação EXIF
    $orientacao = $exif['Orientation'];
    $imagemCorrigida = false;
    
    switch ($orientacao) {
        case 3:
            $imagemCorrigida = imagerotate($imagem, 180, 0);
            break;
        case 6:
            $imagemCorrigida = imagerotate($imagem, -90, 0);
            break;
        case 8:
            $imagemCorrigida = imagerotate($imagem, 90, 0);
            break;
        default:
            imagedestroy($imagem);
            return false; // Não precisa de correção
    }
    
    if ($imagemCorrigida) {
        imagedestroy($imagem);
        // Salvar imagem corrigida
        imagejpeg($imagemCorrigida, $caminhoImagem, 85);
        imagedestroy($imagemCorrigida);
        return true;
    }
    
    imagedestroy($imagem);
    return false;
}

// Função para redimensionar e otimizar imagem
function otimizarImagem($caminhoImagem, $larguraMaxima = 1920, $alturaMaxima = 1920, $qualidade = 85) {
    if (!function_exists('getimagesize') || !function_exists('imagecreatefromjpeg')) {
        return false; // Extensões não disponíveis
    }
    
    $extensao = strtolower(pathinfo($caminhoImagem, PATHINFO_EXTENSION));
    
    // Obter dimensões atuais
    $info = @getimagesize($caminhoImagem);
    if (!$info) {
        return false;
    }
    
    list($larguraAtual, $alturaAtual) = $info;
    
    // Verificar se precisa redimensionar
    if ($larguraAtual <= $larguraMaxima && $alturaAtual <= $alturaMaxima) {
        // Otimizar qualidade mesmo sem redimensionar
        $imagem = null;
        switch ($extensao) {
            case 'jpg':
            case 'jpeg':
                $imagem = @imagecreatefromjpeg($caminhoImagem);
                if ($imagem) {
                    // Re-comprimir com qualidade otimizada
                    imagejpeg($imagem, $caminhoImagem, $qualidade);
                    imagedestroy($imagem);
                    return true;
                }
                break;
            case 'png':
                $imagem = @imagecreatefrompng($caminhoImagem);
                if ($imagem) {
                    // Comprimir PNG (nível 6 = bom equilíbrio)
                    imagepng($imagem, $caminhoImagem, 6);
                    imagedestroy($imagem);
                    return true;
                }
                break;
        }
        return false;
    }
    
    // Calcular novas dimensões mantendo proporção
    $ratio = min($larguraMaxima / $larguraAtual, $alturaMaxima / $alturaAtual);
    $novaLargura = (int)($larguraAtual * $ratio);
    $novaAltura = (int)($alturaAtual * $ratio);
    
    // Carregar imagem original
    $imagemOriginal = null;
    switch ($extensao) {
        case 'jpg':
        case 'jpeg':
            $imagemOriginal = @imagecreatefromjpeg($caminhoImagem);
            break;
        case 'png':
            $imagemOriginal = @imagecreatefrompng($caminhoImagem);
            break;
        case 'webp':
            if (function_exists('imagecreatefromwebp')) {
                $imagemOriginal = @imagecreatefromwebp($caminhoImagem);
            }
            break;
    }
    
    if (!$imagemOriginal) {
        return false;
    }
    
    // Criar nova imagem redimensionada
    $imagemNova = imagecreatetruecolor($novaLargura, $novaAltura);
    
    // Preservar transparência para PNG
    if ($extensao === 'png') {
        imagealphablending($imagemNova, false);
        imagesavealpha($imagemNova, true);
        $transparente = imagecolorallocatealpha($imagemNova, 255, 255, 255, 127);
        imagefill($imagemNova, 0, 0, $transparente);
    }
    
    // Redimensionar
    imagecopyresampled(
        $imagemNova, $imagemOriginal,
        0, 0, 0, 0,
        $novaLargura, $novaAltura,
        $larguraAtual, $alturaAtual
    );
    
    // Salvar imagem otimizada
    $sucesso = false;
    switch ($extensao) {
        case 'jpg':
        case 'jpeg':
            $sucesso = imagejpeg($imagemNova, $caminhoImagem, $qualidade);
            break;
        case 'png':
            // Comprimir PNG (nível 6 = bom equilíbrio entre qualidade e tamanho)
            $sucesso = imagepng($imagemNova, $caminhoImagem, 6);
            break;
        case 'webp':
            if (function_exists('imagewebp')) {
                $sucesso = imagewebp($imagemNova, $caminhoImagem, $qualidade);
            }
            break;
    }
    
    imagedestroy($imagemOriginal);
    imagedestroy($imagemNova);
    
    return $sucesso;
}

// Função para upload de imagem (melhorada para fotos de celular)
function uploadImagem($arquivo, $pasta) {
    $extensoes = ['jpg', 'jpeg', 'png', 'webp'];
    $extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
    
    if (!in_array($extensao, $extensoes)) {
        return ['erro' => 'Formato não permitido. Use JPG, PNG ou WEBP'];
    }
    
    // Aumentado para 20MB para acomodar fotos de celular
    if ($arquivo['size'] > 20971520) { // 20MB
        return ['erro' => 'Arquivo muito grande. Máximo: 20MB'];
    }
    
    // Validar tipo MIME real (se a extensão fileinfo estiver disponível)
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $arquivo['tmp_name']);
        finfo_close($finfo);
        
        $mimesPermitidos = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp'
        ];
        
        if (!in_array($mimeType, $mimesPermitidos)) {
            return ['erro' => 'Tipo de arquivo inválido'];
        }
    } else {
        // Validação alternativa: verificar se o arquivo é realmente uma imagem
        // usando getimagesize (mais básico, mas funciona sem fileinfo)
        $infoImagem = @getimagesize($arquivo['tmp_name']);
        if ($infoImagem === false) {
            return ['erro' => 'Arquivo não é uma imagem válida'];
        }
        
        // Verificar se o tipo MIME retornado por getimagesize é permitido
        $mimeTypesPermitidos = [
            IMAGETYPE_JPEG,
            IMAGETYPE_PNG,
            IMAGETYPE_WEBP
        ];
        
        if (!in_array($infoImagem[2], $mimeTypesPermitidos)) {
            return ['erro' => 'Formato de imagem não permitido'];
        }
    }
    
    if (!is_dir($pasta)) {
        mkdir($pasta, 0755, true);
    }
    
    $nomeArquivo = uniqid() . '.' . $extensao;
    $caminhoCompleto = $pasta . $nomeArquivo;
    
    // Mover arquivo temporário
    if (!move_uploaded_file($arquivo['tmp_name'], $caminhoCompleto)) {
        return ['erro' => 'Erro ao fazer upload'];
    }
    
    // Processar imagem: corrigir orientação e otimizar
    // 1. Corrigir orientação EXIF (para fotos de celular)
    if (in_array($extensao, ['jpg', 'jpeg'])) {
        corrigirOrientacaoImagem($caminhoCompleto);
    }
    
    // 2. Redimensionar e otimizar para web
    // - Máximo 1600px (ideal para web, mantém qualidade visual)
    // - Qualidade 80% (ótimo equilíbrio entre qualidade e tamanho)
    // - Isso reduz drasticamente o tamanho do arquivo sem perder qualidade visível
    // - Remove metadados EXIF desnecessários durante a otimização
    otimizarImagem($caminhoCompleto, 1600, 1600, 80);
    
    // 3. Verificar tamanho final e logar (opcional, para debug)
    $tamanhoFinal = filesize($caminhoCompleto);
    $tamanhoOriginal = $arquivo['size'];
    $reducao = $tamanhoOriginal > 0 ? round((1 - $tamanhoFinal / $tamanhoOriginal) * 100, 1) : 0;
    
    // Se a redução foi significativa, a otimização funcionou bem
    // (Isso é apenas informativo, não afeta o funcionamento)
    
    return ['sucesso' => true, 'caminho' => $caminhoCompleto];
}

function normalizarCaminhoUpload($caminho) {
    if (!$caminho) {
        return '';
    }
    $caminho = str_replace(['..\\', '../'], '', $caminho);
    return ltrim($caminho, '/');
}

function removerArquivoSeExistir($caminhoRelativo) {
    $caminhoRelativo = normalizarCaminhoUpload($caminhoRelativo);
    if (!$caminhoRelativo) {
        return;
    }
    $caminhoAbsoluto = __DIR__ . '/../' . $caminhoRelativo;
    if (file_exists($caminhoAbsoluto) && is_file($caminhoAbsoluto)) {
        @unlink($caminhoAbsoluto);
    }
}

// Função para carregar depoimentos
function carregarDepoimentos() {
    if (!file_exists(TESTIMONIALS_PATH)) {
        return ['testimonials' => []];
    }
    $json = file_get_contents(TESTIMONIALS_PATH);
    return json_decode($json, true);
}

// Função para salvar depoimentos
function salvarDepoimentos($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents(TESTIMONIALS_PATH, $json);
}