<?php
// ============================================
// ARQUIVO 3: formulario-passeio.php
// ============================================
require_once 'config.php';
verificarLogin();

$modoEdicao = isset($_GET['id']);
$passeio = [
    'id' => '',
    'nome' => '',
    'slug' => '',
    'descricao_curta' => '',
    'descricao_completa' => '',
    'duracao' => '',
    'categoria' => ['Praia'],
    'destaque' => false,
    'ativo' => true,
    'imagem_capa' => '',
    'galeria' => [],
    'inclui' => [],
    'nao_inclui' => [],
    'horarios' => [],
    'tipo_passeio' => '',
    'min_pessoas' => '1',
    'observacoes' => '',
    'politica_criancas' => '',
    'posicao' => '999'
];

if ($modoEdicao) {
    $dados = carregarPasseios();
    $passeios = $dados['passeios'] ?? [];
    $idEdicao = $_GET['id'];
    
    foreach ($passeios as $p) {
        if ($p['id'] === $idEdicao) {
            $passeio = $p;
            // Garantir que passeios antigos sem posição tenham um valor padrão
            if (!isset($passeio['posicao']) || $passeio['posicao'] === '') {
                $passeio['posicao'] = '999';
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
    <title><?= $modoEdicao ? 'Editar' : 'Novo' ?> Passeio - Painel Admin</title>
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
        textarea,
        select {
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
        textarea:focus,
        select:focus {
            outline: none;
            border-color: #667eea;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        .dynamic-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .dynamic-item {
            display: flex;
            gap: 10px;
        }
        .dynamic-item input {
            flex: 1;
        }
        .btn-remove {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        .btn-add {
            background: #27ae60;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 10px;
        }
        .form-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        .file-upload {
            border: 2px dashed #bdc3c7;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        .file-upload:hover {
            border-color: #667eea;
            background: #f8f9fa;
        }
        .preview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .preview-item {
            position: relative;
            height: 150px;
            border-radius: 8px;
            overflow: hidden;
        }
        .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .upload-status {
            margin-top: 10px;
            font-size: 0.9rem;
            color: #34495e;
        }
        .existing-controls {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.65);
            color: white;
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .existing-controls input[type="checkbox"] {
            width: 16px;
            height: 16px;
        }
        .existing-gallery-item {
            transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .existing-gallery-item.marked-remove {
            opacity: 0.5;
            transform: scale(0.98);
            border: 2px solid #e74c3c;
        }
        .btn-inline {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 15px;
        }
        .btn-inline.secondary {
            background: #95a5a6;
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
        .help-text {
            font-size: 0.85rem;
            color: #7f8c8d;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1><?= $modoEdicao ? '✏️ Editar Passeio' : '➕ Novo Passeio' ?></h1>
            <a href="painel.php" class="btn-voltar">← Voltar</a>
        </div>
    </div>

    <div class="container">
        <form class="form-card" method="POST" action="salvar-passeio.php" enctype="multipart/form-data">
            <?php if ($modoEdicao): ?>
                <input type="hidden" name="id" value="<?= htmlspecialchars($passeio['id']) ?>">
                <input type="hidden" name="modo_edicao" value="1">
            <?php endif; ?>

            <!-- Informações Básicas -->
            <div class="form-section">
                <h2 class="section-title">📝 Informações Básicas</h2>
                
                <div class="form-group">
                    <label for="nome">Nome do Passeio *</label>
                    <input type="text" id="nome" name="nome" value="<?= htmlspecialchars($passeio['nome']) ?>" required>
                </div>

                <div class="form-group">
                    <label>Categorias *</label>
                    <div class="checkbox-group" style="flex-direction: column; align-items: flex-start; gap: 12px;">
                        <?php 
                        $categoriasDisponiveis = ['Praia', 'Aventura', 'Mergulho', 'Cultural', 'Ecoturismo'];
                        $categoriasPasseio = is_array($passeio['categoria'] ?? null) ? $passeio['categoria'] : (isset($passeio['categoria']) ? [$passeio['categoria']] : []);
                        foreach ($categoriasDisponiveis as $cat): 
                        ?>
                            <div class="checkbox-group">
                                <input type="checkbox" id="categoria_<?= strtolower($cat) ?>" name="categorias[]" value="<?= htmlspecialchars($cat) ?>" 
                                       <?= in_array($cat, $categoriasPasseio) ? 'checked' : '' ?>>
                                <label for="categoria_<?= strtolower($cat) ?>" style="margin-bottom: 0; font-weight: normal;">
                                    <?php
                                    $icones = [
                                        'Praia' => '🏖️',
                                        'Aventura' => '🚙',
                                        'Mergulho' => '🤿',
                                        'Cultural' => '🏛️',
                                        'Ecoturismo' => '🌿'
                                    ];
                                    echo ($icones[$cat] ?? '') . ' ' . $cat;
                                    ?>
                                </label>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <p class="help-text">Selecione uma ou mais categorias</p>
                </div>

                <div class="form-group">
                    <label for="descricao_curta">Descrição Curta *</label>
                    <textarea id="descricao_curta" name="descricao_curta" required><?= htmlspecialchars($passeio['descricao_curta']) ?></textarea>
                    <p class="help-text">Máximo 150 caracteres - aparece no card</p>
                </div>

                <div class="form-group">
                    <label for="descricao_completa">Roteiro do Passeio *</label>
                    <textarea id="descricao_completa" name="descricao_completa" required><?= htmlspecialchars($passeio['descricao_completa']) ?></textarea>
                    <p class="help-text">Roteiro detalhado do passeio</p>
                </div>

                <div class="form-group">
                    <label for="duracao">Duração média *</label>
                    <input type="text" id="duracao" name="duracao" value="<?= htmlspecialchars($passeio['duracao']) ?>" placeholder="Ex: 8 horas" required>
                </div>

                <div class="form-group">
                    <label for="posicao">Posição na página de passeios *</label>
                    <input type="number" id="posicao" name="posicao" value="<?= htmlspecialchars($passeio['posicao'] ?? '999') ?>" placeholder="Ex: 1, 2, 3..." min="1" required>
                    <p class="help-text">Número que define a ordem de exibição na página. Menor número aparece primeiro (1 = primeiro lugar). Passeios sem posição definida aparecem por último.</p>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="destaque" name="destaque" value="1" <?= $passeio['destaque'] ? 'checked' : '' ?>>
                    <label for="destaque">⭐ Marcar como destaque</label>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="ativo" name="ativo" value="1" <?= $passeio['ativo'] ? 'checked' : '' ?>>
                    <label for="ativo">✓ Passeio ativo (visível no site)</label>
                </div>
            </div>

            <!-- Imagens -->
            <div class="form-section">
                <h2 class="section-title">📸 Imagens</h2>
                
                <div class="form-group">
                    <label>Imagem de Capa *</label>
                    <div class="file-upload" onclick="document.getElementById('imagem_capa').click()">
                        <p>📁 Clique para selecionar imagem de capa</p>
                        <p class="help-text">JPG, PNG ou WEBP - Máx 5MB</p>
                    </div>
                    <input type="file" id="imagem_capa" name="imagem_capa" accept="image/*" style="display:none" <?= !$modoEdicao ? 'required' : '' ?>>
                    <input type="hidden" name="remover_imagem_capa" id="remover_imagem_capa" value="0">
                    <p class="upload-status" id="imagem-capa-status">Nenhum arquivo selecionado.</p>
                    <div class="preview-grid" id="imagem-capa-preview"></div>
                    <?php if ($modoEdicao && $passeio['imagem_capa']): ?>
                        <div class="preview-grid" id="imagem-capa-atual">
                            <div class="preview-item">
                                <img src="../<?= htmlspecialchars($passeio['imagem_capa']) ?>" alt="Capa atual">
                            </div>
                        </div>
                        <button type="button" class="btn-inline secondary" id="remover-capa-btn">🗑️ Remover imagem atual</button>
                    <?php endif; ?>
                </div>

                <div class="form-group">
                    <label>Galeria de Fotos</label>
                    <div class="file-upload" onclick="document.getElementById('galeria').click()">
                        <p>📁 Clique para adicionar fotos à galeria</p>
                        <p class="help-text">Selecione múltiplas imagens</p>
                    </div>
                    <input type="file" id="galeria" name="galeria[]" accept="image/*" multiple style="display:none">
                    <p class="upload-status" id="galeria-status">Nenhuma nova imagem selecionada.</p>
                    <div class="preview-grid" id="galeria-preview"></div>
                    <?php if ($modoEdicao && !empty($passeio['galeria'])): ?>
                        <p class="help-text" style="margin-top:15px;">Imagens atuais - marque para remover antes de salvar.</p>
                        <div class="preview-grid existing-gallery">
                            <?php foreach ($passeio['galeria'] as $index => $foto): ?>
                                <?php $fotoUrl = str_replace('../', '', $foto['url']); ?>
                                <div class="preview-item existing-gallery-item">
                                    <img src="../<?= htmlspecialchars($fotoUrl) ?>" alt="Foto da galeria">
                                    <label class="existing-controls">
                                        <input type="checkbox" name="remover_galeria[]" value="<?= htmlspecialchars($fotoUrl) ?>">
                                        <span>Remover</span>
                                    </label>
                                    <input type="hidden" name="galeria_atual[<?= $index ?>][url]" value="<?= htmlspecialchars($fotoUrl) ?>">
                                    <input type="hidden" name="galeria_atual[<?= $index ?>][alt]" value="<?= htmlspecialchars($foto['alt'] ?? '') ?>">
                                    <input type="hidden" name="galeria_atual[<?= $index ?>][ordem]" value="<?= htmlspecialchars($foto['ordem'] ?? ($index + 1)) ?>">
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Detalhes do Passeio -->
            <div class="form-section">
                <h2 class="section-title">ℹ️ Detalhes do Passeio</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="tipo_passeio">Tipo de Passeio *</label>
                        <input type="text" id="tipo_passeio" name="tipo_passeio" value="<?= htmlspecialchars($passeio['tipo_passeio'] ?? $passeio['dificuldade'] ?? '') ?>" placeholder="Ex: Passeio de barco, Tour guiado, Aventura" required>
                        <p class="help-text">Descreva o tipo de passeio (Ex: Passeio de barco, Tour guiado, Aventura, etc.)</p>
                    </div>

                </div>

                <div class="form-group">
                    <label for="min_pessoas">Mínimo de Pessoas *</label>
                    <input type="number" id="min_pessoas" name="min_pessoas" value="<?= htmlspecialchars($passeio['min_pessoas'] ?? $passeio['max_pessoas'] ?? '1') ?>" required>
                    <p class="help-text">Número mínimo de pessoas necessárias para realizar o passeio</p>
                </div>

                <div class="form-group">
                    <label>Horários de Saída</label>
                    <div id="horarios-list" class="dynamic-list">
                        <?php 
                        $horarios = $passeio['horarios'] ?: ['08:00'];
                        foreach ($horarios as $index => $horario): 
                        ?>
                            <div class="dynamic-item">
                                <input type="text" name="horarios[]" value="<?= htmlspecialchars($horario) ?>" placeholder="Ex: 08:00">
                                <?php if ($index > 0): ?>
                                    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remover</button>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="btn-add" onclick="adicionarHorario()">+ Adicionar Horário de Saída</button>
                </div>

                <div class="form-group">
                    <label>O que está incluído</label>
                    <div id="inclui-list" class="dynamic-list">
                        <?php 
                        $inclui = $passeio['inclui'] ?: ['Transporte ida e volta'];
                        foreach ($inclui as $index => $item): 
                        ?>
                            <div class="dynamic-item">
                                <input type="text" name="inclui[]" value="<?= htmlspecialchars($item) ?>">
                                <?php if ($index > 0): ?>
                                    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remover</button>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="btn-add" onclick="adicionarInclui()">+ Adicionar Item</button>
                </div>

                <div class="form-group">
                    <label>O que NÃO está incluído</label>
                    <div id="nao-inclui-list" class="dynamic-list">
                        <?php 
                        $naoInclui = $passeio['nao_inclui'] ?: ['Alimentação'];
                        foreach ($naoInclui as $index => $item): 
                        ?>
                            <div class="dynamic-item">
                                <input type="text" name="nao_inclui[]" value="<?= htmlspecialchars($item) ?>">
                                <?php if ($index > 0): ?>
                                    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remover</button>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="btn-add" onclick="adicionarNaoInclui()">+ Adicionar Item</button>
                </div>

                <div class="form-group">
                    <label for="observacoes">Observações Importantes</label>
                    <textarea id="observacoes" name="observacoes"><?= htmlspecialchars($passeio['observacoes']) ?></textarea>
                </div>

                <div class="form-group">
                    <label for="politica_criancas">Política de Crianças</label>
                    <textarea id="politica_criancas" name="politica_criancas" placeholder="Ex: Crianças até 5 anos não pagam. Crianças de 6 a 12 anos pagam 50% do valor..."><?= htmlspecialchars($passeio['politica_criancas'] ?? '') ?></textarea>
                    <p class="help-text">Informações sobre políticas de preços e regras para crianças neste passeio</p>
                </div>
            </div>

            <button type="submit" class="btn-salvar">
                💾 <?= $modoEdicao ? 'Salvar Alterações' : 'Criar Passeio' ?>
            </button>
        </form>
    </div>

    <script>
        function adicionarHorario() {
            const container = document.getElementById('horarios-list');
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <input type="text" name="horarios[]" placeholder="Ex: 14:00">
                <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remover</button>
            `;
            container.appendChild(div);
        }

        function adicionarInclui() {
            const container = document.getElementById('inclui-list');
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <input type="text" name="inclui[]" placeholder="O que está incluído">
                <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remover</button>
            `;
            container.appendChild(div);
        }

        function adicionarNaoInclui() {
            const container = document.getElementById('nao-inclui-list');
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <input type="text" name="nao_inclui[]" placeholder="O que NÃO está incluído">
                <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remover</button>
            `;
            container.appendChild(div);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const imagemCapaInput = document.getElementById('imagem_capa');
            const imagemCapaPreview = document.getElementById('imagem-capa-preview');
            const imagemCapaStatus = document.getElementById('imagem-capa-status');
            const removerCapaInput = document.getElementById('remover_imagem_capa');
            const removerCapaBtn = document.getElementById('remover-capa-btn');
            const imagemCapaAtual = document.getElementById('imagem-capa-atual');

            const resetarPreviewCapa = (mensagem = 'Nenhum arquivo selecionado.') => {
                imagemCapaPreview.innerHTML = '';
                imagemCapaStatus.textContent = mensagem;
            };

            imagemCapaInput?.addEventListener('change', () => {
                if (imagemCapaInput.files && imagemCapaInput.files[0]) {
                    const file = imagemCapaInput.files[0];
                    removerCapaInput.value = '0';
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagemCapaPreview.innerHTML = `
                            <div class="preview-item">
                                <img src="${e.target.result}" alt="Prévia da capa">
                            </div>
                        `;
                    };
                    reader.readAsDataURL(file);
                    imagemCapaStatus.textContent = `1 arquivo selecionado (${file.name})`;
                    if (imagemCapaAtual) {
                        imagemCapaAtual.style.display = 'none';
                    }
                } else {
                    resetarPreviewCapa();
                }
            });

            removerCapaBtn?.addEventListener('click', () => {
                removerCapaInput.value = '1';
                imagemCapaInput.value = '';
                resetarPreviewCapa('Imagem marcada para remoção.');
                if (imagemCapaAtual) {
                    imagemCapaAtual.style.display = 'none';
                }
            });

            const galeriaInput = document.getElementById('galeria');
            const galeriaPreview = document.getElementById('galeria-preview');
            const galeriaStatus = document.getElementById('galeria-status');

            galeriaInput?.addEventListener('change', () => {
                galeriaPreview.innerHTML = '';
                if (!galeriaInput.files || galeriaInput.files.length === 0) {
                    galeriaStatus.textContent = 'Nenhuma nova imagem selecionada.';
                    return;
                }

                galeriaStatus.textContent = `${galeriaInput.files.length} nova(s) imagem(ns) selecionada(s).`;
                Array.from(galeriaInput.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const div = document.createElement('div');
                        div.className = 'preview-item';
                        div.innerHTML = `<img src="${e.target.result}" alt="${file.name}">`;
                        galeriaPreview.appendChild(div);
                    };
                    reader.readAsDataURL(file);
                });
            });

            document.querySelectorAll('.existing-gallery-item input[type="checkbox"]').forEach((checkbox) => {
                checkbox.addEventListener('change', () => {
                    const wrapper = checkbox.closest('.existing-gallery-item');
                    if (wrapper) {
                        wrapper.classList.toggle('marked-remove', checkbox.checked);
                    }
                });
            });
        });
    </script>
</body>
</html>