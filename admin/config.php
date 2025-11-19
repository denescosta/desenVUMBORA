<?php
// config.php - Configurações do painel

// Iniciar output buffering para evitar problemas com headers
if (!ob_get_level()) {
    ob_start();
}

// Verificar se a sessão já foi iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// IMPORTANTE: Altere estas credenciais!
define('ADMIN_USER', 'admin'); // MUDE ISSO
define('ADMIN_PASS', 'senha123'); // MUDE ISSO - use senha forte!

// Caminhos
define('DATA_PATH', '../data/passeios.json');
define('UPLOADS_PATH', '../uploads/passeios/');

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

// Função para upload de imagem
function uploadImagem($arquivo, $pasta) {
    $extensoes = ['jpg', 'jpeg', 'png', 'webp'];
    $extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
    
    if (!in_array($extensao, $extensoes)) {
        return ['erro' => 'Formato não permitido'];
    }
    
    if ($arquivo['size'] > 5000000) { // 5MB
        return ['erro' => 'Arquivo muito grande'];
    }
    
    if (!is_dir($pasta)) {
        mkdir($pasta, 0755, true);
    }
    
    $nomeArquivo = uniqid() . '.' . $extensao;
    $caminhoCompleto = $pasta . $nomeArquivo;
    
    if (move_uploaded_file($arquivo['tmp_name'], $caminhoCompleto)) {
        return ['sucesso' => true, 'caminho' => $caminhoCompleto];
    }
    
    return ['erro' => 'Erro ao fazer upload'];
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