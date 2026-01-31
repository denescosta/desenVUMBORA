<?php
/**
 * API para enviar email de contato
 * Recebe dados via POST e envia email para o destinatário configurado
 * Compatível com Hostinger
 */

// Desabilitar exibição de erros no output (para não quebrar o JSON)
error_reporting(0);
ini_set('display_errors', 0);

// Permitir CORS (para chamadas do frontend)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Apenas aceitar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'erro' => 'Método não permitido']);
    exit;
}

// ============================================
// CONFIGURAÇÃO - Altere aqui se necessário
// ============================================
$EMAIL_DESTINO = 'contato@vumborapassear.com.br';
$NOME_SITE = 'VUMBORA';
// Domínio do site (usado no remetente do email)
$DOMINIO = $_SERVER['HTTP_HOST'] ?? 'vumborapassear.com.br';
// ============================================

try {
    // Receber dados do formulário
    $inputRaw = file_get_contents('php://input');
    $dados = json_decode($inputRaw, true);

    // Se não recebeu JSON, tentar form-data
    if (empty($dados)) {
        $dados = $_POST;
    }

    // Se ainda estiver vazio, retornar erro
    if (empty($dados)) {
        throw new Exception('Nenhum dado recebido');
    }

    // Validar campos obrigatórios
    $camposObrigatorios = ['nome', 'email', 'assunto', 'mensagem'];
    foreach ($camposObrigatorios as $campo) {
        if (empty($dados[$campo])) {
            throw new Exception("Campo '$campo' é obrigatório");
        }
    }

    // Sanitizar dados
    $nome = htmlspecialchars(strip_tags(trim($dados['nome'])));
    $email = filter_var(trim($dados['email']), FILTER_SANITIZE_EMAIL);
    $telefone = htmlspecialchars(strip_tags(trim($dados['telefone'] ?? 'Não informado')));
    $assunto = htmlspecialchars(strip_tags(trim($dados['assunto'])));
    $mensagem = htmlspecialchars(strip_tags(trim($dados['mensagem'])));

    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    // Mapear assuntos
    $assuntosMap = [
        'orcamento' => 'Solicitar Orçamento',
        'duvidas' => 'Dúvidas sobre Passeios',
        'reserva' => 'Reservar Passeio',
        'outros' => 'Outros'
    ];
    $assuntoTexto = $assuntosMap[$assunto] ?? $assunto;

    // Montar o email
    $assuntoEmail = "[$NOME_SITE] $assuntoTexto - $nome";

    // Converter quebras de linha da mensagem para <br>
    $mensagemHtml = nl2br($mensagem);

    $corpoEmail = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;'>
            <h2 style='margin: 0;'>📬 Nova Mensagem de Contato</h2>
            <p style='margin: 10px 0 0 0;'>Recebida através do site $NOME_SITE</p>
        </div>
        <div style='background: #f9f9f9; padding: 20px; border: 1px solid #ddd;'>
            <div style='margin-bottom: 15px;'>
                <div style='font-weight: bold; color: #8B4513;'>👤 Nome:</div>
                <div style='margin-top: 5px;'>$nome</div>
            </div>
            <div style='margin-bottom: 15px;'>
                <div style='font-weight: bold; color: #8B4513;'>📧 E-mail:</div>
                <div style='margin-top: 5px;'><a href='mailto:$email'>$email</a></div>
            </div>
            <div style='margin-bottom: 15px;'>
                <div style='font-weight: bold; color: #8B4513;'>📱 Telefone/WhatsApp:</div>
                <div style='margin-top: 5px;'>$telefone</div>
            </div>
            <div style='margin-bottom: 15px;'>
                <div style='font-weight: bold; color: #8B4513;'>📋 Assunto:</div>
                <div style='margin-top: 5px;'>$assuntoTexto</div>
            </div>
            <div style='margin-bottom: 15px;'>
                <div style='font-weight: bold; color: #8B4513;'>💬 Mensagem:</div>
                <div style='background: white; padding: 15px; border-left: 4px solid #8B4513; margin-top: 10px;'>$mensagemHtml</div>
            </div>
        </div>
        <div style='text-align: center; padding: 15px; font-size: 12px; color: #888;'>
            Este email foi enviado automaticamente pelo formulário de contato do site $NOME_SITE.
        </div>
    </div>
</body>
</html>
";

    // Headers do email - Formato compatível com Hostinger
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $NOME_SITE <noreply@$DOMINIO>\r\n";
    $headers .= "Reply-To: $nome <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Tentar enviar o email
    $enviado = mail($EMAIL_DESTINO, $assuntoEmail, $corpoEmail, $headers);

    if ($enviado) {
        echo json_encode([
            'sucesso' => true, 
            'mensagem' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        ]);
    } else {
        throw new Exception('Falha ao enviar email. Tente novamente.');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false, 
        'erro' => $e->getMessage()
    ]);
}
