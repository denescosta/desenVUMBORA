<?php
// Redireciona para login.php se não estiver logado
require_once 'config.php';

if (isset($_SESSION['admin_logado']) && $_SESSION['admin_logado'] === true) {
    header('Location: painel.php');
} else {
    header('Location: login.php');
}
exit;
?>

