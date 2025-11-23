<?php
// formulario-testimonial.php
require_once 'config.php';
verificarLogin();

$modoEdicao = isset($_GET['id']);
$testimonial = [
    'id' => '',
    'texto' => '',
    'autor' => '',
    'data' => date('d/m/Y'),
    'estrelas' => 5,
    'posicao' => '999'
];

if ($modoEdicao) {
    $dados = carregarDepoimentos();
    $testimonials = $dados['testimonials'] ?? [];
    $idEdicao = $_GET['id'];
    
    foreach ($testimonials as $t) {
        if ($t['id'] === $idEdicao) {
            $testimonial = $t;
            // Garantir que depoimentos antigos sem posição tenham um valor padrão
            if (!isset($testimonial['posicao']) || $testimonial['posicao'] === '') {
                $testimonial['posicao'] = '999';
            }
            break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $modoEdicao ? 'Editar' : 'Novo' ?> Depoimento - Painel Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            padding-bottom: 50px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }
        .header-content {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            font-size: 1.8rem;
        }
        .btn-voltar {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            border: 2px solid white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .form-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .form-section {
            margin-bottom: 35px;
            padding-bottom: 35px;
            border-bottom: 2px solid #ecf0f1;
        }
        .form-section:last-child {
            border-bottom: none;
        }
        .section-title {
            font-size: 1.3rem;
            color: #2c3e50;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 600;
        }
        input[type="text"],
        input[type="number"],
        input[type="date"],
        textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            font-family: inherit;
        }
        textarea {
            min-height: 120px;
            resize: vertical;
        }
        input:focus,
        textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        .help-text {
            font-size: 0.85rem;
            color: #7f8c8d;
            margin-top: 5px;
        }
        .btn-salvar {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            margin-top: 30px;
        }
        .btn-salvar:hover {
            opacity: 0.9;
        }
        .rating-selector {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-top: 10px;
        }
        .star-input {
            display: none;
        }
        .star-label {
            font-size: 2rem;
            color: #e0e0e0 !important;
            cursor: pointer;
            transition: color 0.2s;
        }
        .star-label:hover,
        .star-label:hover ~ .star-label {
            color: #f39c12 !important;
        }
        .star-label.selected {
            color: #f39c12 !important;
        }
        .star-input:checked + .star-label {
            color: #f39c12 !important;
        }
        .form-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1><?= $modoEdicao ? '✏️ Editar Depoimento' : '➕ Novo Depoimento' ?></h1>
            <a href="painel-testimonials.php" class="btn-voltar">← Voltar</a>
        </div>
    </div>

    <div class="container">
        <form class="form-card" method="POST" action="salvar-testimonial.php">
            <?php if ($modoEdicao): ?>
                <input type="hidden" name="id" value="<?= htmlspecialchars($testimonial['id']) ?>">
                <input type="hidden" name="modo_edicao" value="1">
            <?php endif; ?>

            <!-- Informações do Depoimento -->
            <div class="form-section">
                <h2 class="section-title">📝 Informações do Depoimento</h2>
                
                <div class="form-group">
                    <label for="texto">Texto do Depoimento *</label>
                    <textarea id="texto" name="texto" required placeholder="Digite o depoimento aqui..."><?= htmlspecialchars($testimonial['texto']) ?></textarea>
                    <p class="help-text">O texto completo do depoimento (aparecerá entre aspas)</p>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="autor">Nome do Autor *</label>
                        <input type="text" id="autor" name="autor" value="<?= htmlspecialchars($testimonial['autor']) ?>" required placeholder="Ex: João Silva">
                    </div>

                    <div class="form-group">
                        <label for="data">Data *</label>
                        <input type="text" id="data" name="data" value="<?= htmlspecialchars($testimonial['data']) ?>" required placeholder="DD/MM/YYYY">
                        <p class="help-text">Formato: DD/MM/YYYY (ex: 28/05/2025)</p>
                    </div>
                </div>

                <div class="form-group">
                    <label>Quantidade de Estrelas *</label>
                    <div class="rating-selector">
                        <?php for ($i = 1; $i <= 5; $i++): ?>
                            <input type="radio" id="star<?= $i ?>" name="estrelas" value="<?= $i ?>" class="star-input" 
                                   <?= (isset($testimonial['estrelas']) ? (int)$testimonial['estrelas'] : 5) == $i ? 'checked' : '' ?> required>
                            <label for="star<?= $i ?>" class="star-label">★</label>
                        <?php endfor; ?>
                    </div>
                    <p class="help-text">Selecione de 1 a 5 estrelas para avaliar o depoimento</p>
                </div>

                <div class="form-group">
                    <label for="posicao">Posição na página *</label>
                    <input type="number" id="posicao" name="posicao" value="<?= htmlspecialchars($testimonial['posicao'] ?? '999') ?>" placeholder="Ex: 1, 2, 3..." min="1" required>
                    <p class="help-text">Número que define a ordem de exibição. Menor número aparece primeiro (1 = primeiro lugar). Depoimentos sem posição aparecem por último.</p>
                </div>
            </div>

            <button type="submit" class="btn-salvar">
                💾 <?= $modoEdicao ? 'Salvar Alterações' : 'Criar Depoimento' ?>
            </button>
        </form>
    </div>

    <script>
        // Melhorar visualização das estrelas selecionadas
        document.addEventListener('DOMContentLoaded', () => {
            const starInputs = document.querySelectorAll('.star-input');
            const starLabels = document.querySelectorAll('.star-label');

            function atualizarEstrelas() {
                // Primeiro, remover todas as seleções
                starLabels.forEach(label => {
                    label.classList.remove('selected');
                });

                // Encontrar o input selecionado
                const checkedInput = document.querySelector('.star-input:checked');
                if (checkedInput) {
                    const selectedValue = parseInt(checkedInput.value);
                    
                    // Marcar todas as estrelas até a selecionada
                    starLabels.forEach((label, labelIndex) => {
                        // labelIndex é de 0 a 4, corresponde a estrelas de 1 a 5
                        const starValue = labelIndex + 1;
                        if (starValue <= selectedValue) {
                            label.classList.add('selected');
                        }
                    });
                }
            }

            // Adicionar listener para cada input
            starInputs.forEach((input) => {
                input.addEventListener('change', atualizarEstrelas);
            });

            // Inicializar visualização das estrelas selecionadas
            atualizarEstrelas();
        });
    </script>
</body>
</html>

