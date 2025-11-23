<?php
// deletar-testimonial.php
require_once 'config.php';
verificarLogin();

if (!isset($_GET['id'])) {
    header('Location: painel-testimonials.php');
    exit;
}

$id = $_GET['id'];
$dados = carregarDepoimentos();
$testimonials = $dados['testimonials'] ?? [];

// Remover depoimento
$testimonials = array_filter($testimonials, function($t) use ($id) {
    return $t['id'] !== $id;
});

// Reindexar array
$testimonials = array_values($testimonials);

// Salvar dados
$dados['testimonials'] = $testimonials;
if (salvarDepoimentos($dados)) {
    header('Location: painel-testimonials.php?mensagem=deletado');
} else {
    header('Location: painel-testimonials.php?erro=erro_deletar');
}
exit;
?>

