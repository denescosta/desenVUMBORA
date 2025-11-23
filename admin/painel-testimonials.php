<?php
// painel-testimonials.php
require_once 'config.php';
verificarLogin();

$dados = carregarDepoimentos();
$testimonials = $dados['testimonials'] ?? [];

// Ordenar por data (mais recentes primeiro), depois por posição se existir
usort($testimonials, function($a, $b) {
    $dataA = isset($a['data']) ? strtotime($a['data']) : 0;
    $dataB = isset($b['data']) ? strtotime($b['data']) : 0;
    
    if ($dataB !== $dataA) {
        return $dataB - $dataA;
    }
    
    $posA = isset($a['posicao']) ? (int)$a['posicao'] : 999;
    $posB = isset($b['posicao']) ? (int)$b['posicao'] : 999;
    return $posA - $posB;
});
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Depoimentos - Painel Admin</title>
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
        .header-actions {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .btn-sair, .btn-voltar {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            border: 2px solid white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }
        .btn-sair:hover, .btn-voltar:hover {
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
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
        }
        .testimonial-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        .testimonial-card:hover {
            transform: translateY(-5px);
        }
        .testimonial-text {
            color: #2c3e50;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 20px;
            font-style: italic;
        }
        .testimonial-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .testimonial-author {
            font-weight: 700;
            color: #667eea;
            font-size: 1.1rem;
        }
        .testimonial-date {
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        .testimonial-rating {
            display: flex;
            gap: 3px;
            margin-bottom: 15px;
        }
        .star {
            color: #f39c12;
            font-size: 1.2rem;
        }
        .star.empty {
            color: #e0e0e0;
        }
        .card-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
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
        .badge-posicao {
            display: inline-block;
            background: #95a5a6;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>💬 Gerenciar Depoimentos</h1>
            <div class="header-actions">
                <a href="painel.php" class="btn-voltar">← Voltar ao Painel</a>
                <a href="logout.php" class="btn-sair">Sair</a>
            </div>
        </div>
    </div>

    <div class="container">
        <?php if (isset($_GET['mensagem'])): ?>
            <div style="background: #27ae60; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <?php if ($_GET['mensagem'] === 'salvo'): ?>
                    ✅ Depoimento salvo com sucesso!
                <?php elseif ($_GET['mensagem'] === 'deletado'): ?>
                    ✅ Depoimento deletado com sucesso!
                <?php endif; ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($_GET['erro'])): ?>
            <div style="background: #e74c3c; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                ❌ Erro ao processar depoimento. Tente novamente.
            </div>
        <?php endif; ?>
        
        <a href="formulario-testimonial.php" class="btn-novo">➕ Adicionar Novo Depoimento</a>

        <?php if (empty($testimonials)): ?>
            <div class="empty-state">
                <h2>Nenhum depoimento cadastrado ainda</h2>
                <p>Clique no botão acima para adicionar seu primeiro depoimento!</p>
            </div>
        <?php else: ?>
            <div class="testimonials-grid">
                <?php foreach ($testimonials as $testimonial): ?>
                    <div class="testimonial-card">
                        <?php if (isset($testimonial['posicao'])): ?>
                            <span class="badge-posicao">📍 Posição: <?= htmlspecialchars($testimonial['posicao']) ?></span>
                        <?php endif; ?>
                        
                        <div class="testimonial-rating">
                            <?php 
                            $estrelas = isset($testimonial['estrelas']) ? (int)$testimonial['estrelas'] : 5;
                            for ($i = 1; $i <= 5; $i++): 
                            ?>
                                <span class="star <?= $i <= $estrelas ? '' : 'empty' ?>">★</span>
                            <?php endfor; ?>
                        </div>
                        
                        <p class="testimonial-text">"<?= htmlspecialchars($testimonial['texto']) ?>"</p>
                        
                        <div class="testimonial-info">
                            <span class="testimonial-author"><?= htmlspecialchars($testimonial['autor']) ?></span>
                            <span class="testimonial-date"><?= htmlspecialchars($testimonial['data']) ?></span>
                        </div>
                        
                        <div class="card-actions">
                            <a href="formulario-testimonial.php?id=<?= urlencode($testimonial['id']) ?>" class="btn-editar">✏️ Editar</a>
                            <a href="deletar-testimonial.php?id=<?= urlencode($testimonial['id']) ?>" class="btn-deletar" onclick="return confirm('Tem certeza que deseja deletar este depoimento?')">🗑️ Deletar</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>

