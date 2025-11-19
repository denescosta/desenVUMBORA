<?php
// ============================================
// ARQUIVO 2: deletar-passeio.php
// ============================================
?>
<?php
require_once 'config.php';
verificarLogin();

if (!isset($_GET['id'])) {
    header('Location: painel.php');
    exit;
}

$id = $_GET['id'];
$dados = carregarPasseios();
$passeios = $dados['passeios'] ?? [];

// Encontrar e remover o passeio
$novoArray = array_filter($passeios, function($p) use ($id) {
    return $p['id'] !== $id;
});

// Reorganizar índices
$dados['passeios'] = array_values($novoArray);

// Salvar
if (salvarPasseios($dados)) {
    header('Location: painel.php?mensagem=deletado');
} else {
    header('Location: painel.php?erro=erro_deletar');
}
exit;
?>