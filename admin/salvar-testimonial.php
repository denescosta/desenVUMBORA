<?php
// salvar-testimonial.php
require_once 'config.php';
verificarLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: painel-testimonials.php');
    exit;
}

$modoEdicao = isset($_POST['modo_edicao']) && $_POST['modo_edicao'] == '1';
$dados = carregarDepoimentos();
$testimonials = $dados['testimonials'] ?? [];
$testimonialExistente = null;

// Gerar ou usar ID existente
if ($modoEdicao) {
    $id = $_POST['id'];
    foreach ($testimonials as $t) {
        if ($t['id'] === $id) {
            $testimonialExistente = $t;
            break;
        }
    }
} else {
    $id = uniqid('testimonial_');
}

// Validar campos obrigatórios
if (empty(trim($_POST['texto'] ?? ''))) {
    header('Location: formulario-testimonial.php?erro=' . urlencode('O texto do depoimento é obrigatório.'));
    exit;
}

if (empty(trim($_POST['autor'] ?? ''))) {
    header('Location: formulario-testimonial.php?erro=' . urlencode('O nome do autor é obrigatório.'));
    exit;
}

if (empty(trim($_POST['data'] ?? ''))) {
    header('Location: formulario-testimonial.php?erro=' . urlencode('A data é obrigatória.'));
    exit;
}

// Preparar dados do depoimento
$testimonial = [
    'id' => $id,
    'texto' => trim($_POST['texto']),
    'autor' => trim($_POST['autor']),
    'data' => trim($_POST['data']),
    'estrelas' => isset($_POST['estrelas']) ? (int)$_POST['estrelas'] : 5,
    'posicao' => isset($_POST['posicao']) ? (int)$_POST['posicao'] : 999
];

// Validar estrelas (deve ser entre 1 e 5)
if ($testimonial['estrelas'] < 1 || $testimonial['estrelas'] > 5) {
    $testimonial['estrelas'] = 5;
}

// Atualizar ou adicionar depoimento
if ($modoEdicao) {
    // Substituir depoimento existente
    foreach ($testimonials as $index => $t) {
        if ($t['id'] === $id) {
            $testimonials[$index] = $testimonial;
            break;
        }
    }
} else {
    // Adicionar novo depoimento
    $testimonials[] = $testimonial;
}

// Salvar dados
$dados['testimonials'] = $testimonials;
if (salvarDepoimentos($dados)) {
    header('Location: painel-testimonials.php?mensagem=salvo');
} else {
    header('Location: painel-testimonials.php?erro=erro_salvar');
}
exit;
?>

