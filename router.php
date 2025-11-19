<?php
// Router para servir site principal e admin
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Remove query string para comparação
$path = strtok($requestPath, '?');

// Se a requisição for para /admin ou começar com /admin/, serve da pasta admin
if (strpos($path, '/admin') === 0) {
    // Remove /admin do caminho
    $adminPath = substr($path, 6); // Remove '/admin'
    
    // Se não tiver nada depois, redireciona para /admin/
    if (empty($adminPath) || $adminPath === '/') {
        $adminPath = '/index.php';
    }
    
    // Serve arquivo da pasta admin
    $filePath = __DIR__ . '/admin' . $adminPath;
    
    // Se for um arquivo PHP, inclui
    if (is_file($filePath) && pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
        chdir(__DIR__ . '/admin');
        require $filePath;
        return true;
    }
    
    // Se for outro arquivo, serve diretamente
    if (is_file($filePath)) {
        return false; // Deixa o PHP servir o arquivo estático
    }
    
    // Se não encontrou, tenta index.php
    if (is_dir(__DIR__ . '/admin' . dirname($adminPath))) {
        $indexPath = __DIR__ . '/admin/index.php';
        if (is_file($indexPath)) {
            chdir(__DIR__ . '/admin');
            require $indexPath;
            return true;
        }
    }
}

// Para todas as outras requisições, serve da raiz
$filePath = __DIR__ . $path;

// Se for um arquivo, serve
if (is_file($filePath)) {
    return false; // Deixa o PHP servir o arquivo
}

// Se for diretório, tenta index.html ou index.php
if (is_dir($filePath)) {
    $indexHtml = $filePath . '/index.html';
    $indexPhp = $filePath . '/index.php';
    
    if (is_file($indexHtml)) {
        return false; // Serve index.html
    }
    if (is_file($indexPhp)) {
        require $indexPhp;
        return true;
    }
}

// Se não encontrou nada, tenta index.html na raiz
if ($path === '/' || $path === '') {
    $rootIndex = __DIR__ . '/index.html';
    if (is_file($rootIndex)) {
        return false; // Serve index.html
    }
}

// 404
http_response_code(404);
echo "404 - Página não encontrada";
return true;
?>

