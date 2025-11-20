<?php
// salvar-passeio.php
require_once 'config.php';
verificarLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: painel.php');
    exit;
}

$modoEdicao = isset($_POST['modo_edicao']) && $_POST['modo_edicao'] == '1';
$dados = carregarPasseios();
$passeios = $dados['passeios'] ?? [];
$passeioExistente = null;

// Gerar ou usar ID existente
if ($modoEdicao) {
    $id = $_POST['id'];
    $slug = $_POST['slug'] ?? criarSlug($_POST['nome']);
    foreach ($passeios as $p) {
        if ($p['id'] === $id) {
            $passeioExistente = $p;
            break;
        }
    }
} else {
    $id = uniqid('passeio_');
    $slug = criarSlug($_POST['nome']);
}

// Criar pasta de upload do passeio
$pastaPasseio = UPLOADS_PATH . $slug . '/';
if (!is_dir($pastaPasseio)) {
    mkdir($pastaPasseio, 0755, true);
}

// Processar categorias (pode ser array ou string única para compatibilidade)
$categorias = [];
if (isset($_POST['categorias']) && is_array($_POST['categorias'])) {
    $categorias = array_map('trim', $_POST['categorias']);
    $categorias = array_filter($categorias); // Remove valores vazios
} elseif (isset($_POST['categoria'])) {
    // Compatibilidade: se vier como string única, converte para array
    $categorias = [trim($_POST['categoria'])];
}

// Validar que pelo menos uma categoria foi selecionada
if (empty($categorias)) {
    header('Location: formulario-passeio.php?erro=' . urlencode('Selecione pelo menos uma categoria.'));
    exit;
}

// Validar tipo de passeio
if (empty(trim($_POST['tipo_passeio'] ?? ''))) {
    header('Location: formulario-passeio.php?erro=' . urlencode('O tipo de passeio é obrigatório.'));
    exit;
}

// Preparar dados do passeio
$passeio = [
    'id' => $id,
    'nome' => trim($_POST['nome']),
    'slug' => $slug,
    'descricao_curta' => trim($_POST['descricao_curta']),
    'descricao_completa' => trim($_POST['descricao_completa']),
    'duracao' => trim($_POST['duracao']),
    'categoria' => $categorias, // Agora é um array
    'destaque' => isset($_POST['destaque']),
    'ativo' => isset($_POST['ativo']),
    'tipo_passeio' => trim($_POST['tipo_passeio'] ?? ''),
    'min_pessoas' => (string)(int)$_POST['min_pessoas'],
    'observacoes' => trim($_POST['observacoes']),
    'data_atualizacao' => date('Y-m-d')
];

// Se for novo passeio, adicionar data de criação
if (!$modoEdicao) {
    $passeio['data_criacao'] = date('Y-m-d');
} else {
    $passeio['data_criacao'] = $passeioExistente['data_criacao'] ?? date('Y-m-d');
}

// Processar imagem de capa
$removerImagemCapa = isset($_POST['remover_imagem_capa']) && $_POST['remover_imagem_capa'] === '1';
$imagemCapaAnterior = $passeioExistente['imagem_capa'] ?? '';

if (isset($_FILES['imagem_capa']) && $_FILES['imagem_capa']['error'] === UPLOAD_ERR_OK) {
    $resultadoUpload = uploadImagem($_FILES['imagem_capa'], $pastaPasseio);
    if (isset($resultadoUpload['sucesso'])) {
        $novoCaminho = normalizarCaminhoUpload($resultadoUpload['caminho']);
        $passeio['imagem_capa'] = $novoCaminho;
        if ($imagemCapaAnterior && $imagemCapaAnterior !== $novoCaminho) {
            removerArquivoSeExistir($imagemCapaAnterior);
        }
    }
} elseif ($removerImagemCapa) {
    removerArquivoSeExistir($imagemCapaAnterior);
    $passeio['imagem_capa'] = '';
} elseif ($modoEdicao) {
    $passeio['imagem_capa'] = $imagemCapaAnterior;
}

// Processar galeria de fotos
$galeria = [];
$galeriaAtual = $_POST['galeria_atual'] ?? [];
$removerGaleria = $_POST['remover_galeria'] ?? [];
if (!is_array($removerGaleria)) {
    $removerGaleria = [];
}
$removerGaleria = array_map('normalizarCaminhoUpload', $removerGaleria);

if (is_array($galeriaAtual)) {
    foreach ($galeriaAtual as $foto) {
        if (!isset($foto['url'])) {
            continue;
        }
        $urlNormalizada = normalizarCaminhoUpload($foto['url']);
        if (in_array($urlNormalizada, $removerGaleria, true)) {
            removerArquivoSeExistir($urlNormalizada);
            continue;
        }

        $galeria[] = [
            'url' => $urlNormalizada,
            'alt' => $foto['alt'] ?? ('Foto do passeio ' . $passeio['nome']),
            'ordem' => isset($foto['ordem']) ? (int)$foto['ordem'] : (count($galeria) + 1)
        ];
    }
}

$ordem = count($galeria) + 1;
if (isset($_FILES['galeria']) && is_array($_FILES['galeria']['tmp_name'])) {
    foreach ($_FILES['galeria']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['galeria']['error'][$key] === UPLOAD_ERR_OK) {
            $arquivo = [
                'name' => $_FILES['galeria']['name'][$key],
                'type' => $_FILES['galeria']['type'][$key],
                'tmp_name' => $tmpName,
                'error' => $_FILES['galeria']['error'][$key],
                'size' => $_FILES['galeria']['size'][$key]
            ];
            
            $resultadoUpload = uploadImagem($arquivo, $pastaPasseio);
            if (isset($resultadoUpload['sucesso'])) {
                $galeria[] = [
                    'url' => normalizarCaminhoUpload($resultadoUpload['caminho']),
                    'alt' => 'Foto do passeio ' . $passeio['nome'],
                    'ordem' => $ordem++
                ];
            }
        }
    }
}

$ordemRecalculada = 1;
foreach ($galeria as &$fotoGal) {
    $fotoGal['ordem'] = $ordemRecalculada++;
}
unset($fotoGal);

$passeio['galeria'] = $galeria;

// Processar arrays (horários, inclui, não inclui)
$passeio['horarios'] = array_filter(array_map('trim', $_POST['horarios'] ?? []));
$passeio['inclui'] = array_filter(array_map('trim', $_POST['inclui'] ?? []));
$passeio['nao_inclui'] = array_filter(array_map('trim', $_POST['nao_inclui'] ?? []));

// Atualizar ou adicionar passeio
if ($modoEdicao) {
    // Substituir passeio existente
    foreach ($passeios as $index => $p) {
        if ($p['id'] === $id) {
            $passeios[$index] = $passeio;
            break;
        }
    }
} else {
    // Adicionar novo passeio
    $passeios[] = $passeio;
}

// Salvar dados
$dados['passeios'] = $passeios;
if (salvarPasseios($dados)) {
    header('Location: painel.php?mensagem=salvo');
} else {
    header('Location: painel.php?erro=erro_salvar');
}
exit;
?>