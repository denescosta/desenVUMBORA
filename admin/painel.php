<?php
// painel.php
require_once 'config.php';
verificarLogin();

$dados = carregarPasseios();
$passeios = $dados['passeios'] ?? [];

// Ordenar por data de criação (mais recentes primeiro)
usort($passeios, function($a, $b) {
    return strtotime($b['data_criacao']) - strtotime($a['data_criacao']);
});
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Passeios - Painel Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            font-size: 1.8rem;
        }
        .btn-sair {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            border: 2px solid white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }
        .btn-sair:hover {
            background: white;
            color: #667eea;
        }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .btn-novo {
            display: inline-block;
            background: #27ae60;
            color: white;
            padding: 14px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            margin-bottom: 30px;
            transition: background 0.3s;
        }
        .btn-novo:hover {
            background: #229954;
        }
        .passeios-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
        }
        .passeio-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        .passeio-card:hover {
            transform: translateY(-5px);
        }
        .card-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .card-content {
            padding: 20px;
        }
        .card-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .card-info {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }
        .card-actions {
            display: flex;
            gap: 10px;
        }
        .btn-editar, .btn-deletar {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
        }
        .btn-editar {
            background: #3498db;
            color: white;
        }
        .btn-editar:hover {
            background: #2980b9;
        }
        .btn-deletar {
            background: #e74c3c;
            color: white;
        }
        .btn-deletar:hover {
            background: #c0392b;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .badge-destaque {
            background: #e74c3c;
            color: white;
        }
        .badge-ativo {
            background: #27ae60;
            color: white;
        }
        .badge-inativo {
            background: #95a5a6;
            color: white;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 12px;
        }
        .empty-state h2 {
            color: #7f8c8d;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>🎯 Gerenciar Passeios</h1>
            <a href="logout.php" class="btn-sair">Sair</a>
        </div>
    </div>

    <div class="container">
        <a href="formulario-passeio.php" class="btn-novo">➕ Adicionar Novo Passeio</a>

        <?php if (empty($passeios)): ?>
            <div class="empty-state">
                <h2>Nenhum passeio cadastrado ainda</h2>
                <p>Clique no botão acima para adicionar seu primeiro passeio!</p>
            </div>
        <?php else: ?>
            <div class="passeios-grid">
                <?php foreach ($passeios as $passeio): ?>
                    <div class="passeio-card">
                        <img src="../<?= htmlspecialchars($passeio['imagem_capa']) ?>" alt="<?= htmlspecialchars($passeio['nome']) ?>" class="card-img">
                        <div class="card-content">
                            <?php if ($passeio['destaque']): ?>
                                <span class="badge badge-destaque">⭐ Destaque</span>
                            <?php endif; ?>
                            <span class="badge <?= $passeio['ativo'] ? 'badge-ativo' : 'badge-inativo' ?>">
                                <?= $passeio['ativo'] ? '✓ Ativo' : '✗ Inativo' ?>
                            </span>
                            <h3 class="card-title"><?= htmlspecialchars($passeio['nome']) ?></h3>
                            <div class="card-info">
                                <?php 
                                $categorias = is_array($passeio['categoria'] ?? null) ? $passeio['categoria'] : (isset($passeio['categoria']) ? [$passeio['categoria']] : []);
                                $categoriasTexto = !empty($categorias) ? implode(', ', $categorias) : 'Sem categoria';
                                ?>
                                🏷️ <?= htmlspecialchars($categoriasTexto) ?> | 
                                ⏱️ <?= htmlspecialchars($passeio['duracao']) ?>
                            </div>
                            <div class="card-actions">
                                <a href="formulario-passeio.php?id=<?= urlencode($passeio['id']) ?>" class="btn-editar">✏️ Editar</a>
                                <a href="deletar-passeio.php?id=<?= urlencode($passeio['id']) ?>" class="btn-deletar" onclick="return confirm('Tem certeza que deseja deletar este passeio?')">🗑️ Deletar</a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>