/* ============================================
   CONFIG.JS - Configurações Globais do Site
   ============================================ */

// ============================================
// VERSÃO DO SITE - CACHE BUSTING
// ============================================
// IMPORTANTE: Atualize este número sempre que fizer alterações no site!
// Isso força o navegador do cliente a baixar os arquivos atualizados.
// Exemplos: '1.0.1', '1.0.2', '1.1.0' ou use a data: '2024.11.29'
window.SITE_VERSION = '1.0.6';

// Número do WhatsApp (formato internacional sem + e espaços)
// Exemplo: 558491274782 (Brasil: 55 + DDD + número)
// ALTERE AQUI para mudar o número em todo o site
window.WHATSAPP_NUMBER = '5584994280443';

// Formata o número para exibição (com DDD e formatação brasileira)
// ALTERE AQUI para mudar a exibição do número em todo o site
window.WHATSAPP_NUMBER_FORMATTED = '(84) 99428-0443';

// Função auxiliar para criar link do WhatsApp
window.getWhatsAppLink = function(mensagem = '') {
  // Garantir que o número está no formato correto (apenas números)
  const numeroLimpo = String(window.WHATSAPP_NUMBER || '').replace(/\D/g, '');
  if (!numeroLimpo) {
    console.error('Número do WhatsApp não configurado corretamente');
    return '#';
  }
  const mensagemEncoded = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${numeroLimpo}${mensagemEncoded}`;
};

// Função auxiliar para criar link do WhatsApp com mensagem de passeio
window.getWhatsAppLinkPasseio = function(passeio) {
  if (!passeio) return window.getWhatsAppLink();
  
  const mensagem = `Olá! Vim através do VUMBORA e quero agendar um passeio:\n\n` +
    `📍 ${passeio.nome}\n` +
    `⏱️ ${passeio.duracao}`;
  
  return window.getWhatsAppLink(mensagem);
};

// Mensagem padrão para contato geral do site
window.WHATSAPP_MENSAGEM_GERAL = 'Olá! Vim através do site VUMBORA e gostaria de mais informações sobre os passeios.';

// Email de contato
// ALTERE AQUI para mudar o email em todo o site
window.CONTACT_EMAIL = 'contato@vumborapassear.com.br';

// Endereço da empresa
// ALTERE AQUI para mudar o endereço em todo o site
window.CONTACT_ADDRESS = 'Natal, Rio Grande do Norte, Brasil';

// Função para configurar todos os links do WhatsApp na página
window.configurarLinksWhatsApp = function() {
  // Header - com mensagem personalizada
  const whatsappHeader = document.getElementById('whatsapp-header-link');
  if (whatsappHeader) {
    whatsappHeader.href = window.getWhatsAppLink(window.WHATSAPP_MENSAGEM_GERAL);
    // Garantir que abre em nova aba
    if (!whatsappHeader.hasAttribute('target')) {
      whatsappHeader.setAttribute('target', '_blank');
      whatsappHeader.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Hero - com mensagem personalizada
  const whatsappHero = document.getElementById('whatsapp-hero-link');
  if (whatsappHero) {
    whatsappHero.href = window.getWhatsAppLink(window.WHATSAPP_MENSAGEM_GERAL);
    // Garantir que abre em nova aba
    if (!whatsappHero.hasAttribute('target')) {
      whatsappHero.setAttribute('target', '_blank');
      whatsappHero.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Footer
  const whatsappFooter = document.getElementById('whatsapp-footer-link');
  if (whatsappFooter) {
    whatsappFooter.href = window.getWhatsAppLink();
  }

  // Página de Contato - Botão CTA
  const whatsappContactCta = document.getElementById('whatsapp-contact-cta-link');
  if (whatsappContactCta) {
    whatsappContactCta.href = window.getWhatsAppLink(window.WHATSAPP_MENSAGEM_GERAL);
    // Garantir que abre em nova aba
    if (!whatsappContactCta.hasAttribute('target')) {
      whatsappContactCta.setAttribute('target', '_blank');
      whatsappContactCta.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Página Como Funciona - Links do WhatsApp
  const whatsappComoFunciona = document.getElementById('whatsapp-como-funciona-link');
  if (whatsappComoFunciona) {
    whatsappComoFunciona.href = window.getWhatsAppLink(window.WHATSAPP_MENSAGEM_GERAL);
    if (!whatsappComoFunciona.hasAttribute('target')) {
      whatsappComoFunciona.setAttribute('target', '_blank');
      whatsappComoFunciona.setAttribute('rel', 'noopener noreferrer');
    }
  }

  const whatsappCtaComoFunciona = document.getElementById('whatsapp-cta-como-funciona-link');
  if (whatsappCtaComoFunciona) {
    whatsappCtaComoFunciona.href = window.getWhatsAppLink(window.WHATSAPP_MENSAGEM_GERAL);
    if (!whatsappCtaComoFunciona.hasAttribute('target')) {
      whatsappCtaComoFunciona.setAttribute('target', '_blank');
      whatsappCtaComoFunciona.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Seção About - Card WhatsApp
  const whatsappAboutCard = document.getElementById('whatsapp-about-card-link');
  if (whatsappAboutCard) {
    whatsappAboutCard.href = window.getWhatsAppLink(window.WHATSAPP_MENSAGEM_GERAL);
    if (!whatsappAboutCard.hasAttribute('target')) {
      whatsappAboutCard.setAttribute('target', '_blank');
      whatsappAboutCard.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Página Serviços Privativos - Link WhatsApp
  const whatsappServicos = document.getElementById('whatsapp-servicos-link');
  if (whatsappServicos) {
    const mensagemServicos = 'Olá! Vim através do site VUMBORA e gostaria de solicitar um orçamento para locação de van/ônibus.';
    whatsappServicos.href = window.getWhatsAppLink(mensagemServicos);
    if (!whatsappServicos.hasAttribute('target')) {
      whatsappServicos.setAttribute('target', '_blank');
      whatsappServicos.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Página Transfers - Link WhatsApp
  const whatsappTransfers = document.getElementById('whatsapp-transfers-link');
  if (whatsappTransfers) {
    const mensagemTransfers = 'Olá! Vim através do site VUMBORA e gostaria de solicitar um orçamento para transfer.';
    whatsappTransfers.href = window.getWhatsAppLink(mensagemTransfers);
    if (!whatsappTransfers.hasAttribute('target')) {
      whatsappTransfers.setAttribute('target', '_blank');
      whatsappTransfers.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Home - Seção Serviços Privativos - Link WhatsApp
  const whatsappServicosPrivativosHome = document.getElementById('whatsapp-servicos-privativos-home-link');
  if (whatsappServicosPrivativosHome) {
    const mensagemServicosPrivativos = 'Olá! Vim através do site VUMBORA e gostaria de solicitar um orçamento para locação de van/ônibus.';
    whatsappServicosPrivativosHome.href = window.getWhatsAppLink(mensagemServicosPrivativos);
    if (!whatsappServicosPrivativosHome.hasAttribute('target')) {
      whatsappServicosPrivativosHome.setAttribute('target', '_blank');
      whatsappServicosPrivativosHome.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Home - Seção Transfers - Link WhatsApp
  const whatsappTransfersHome = document.getElementById('whatsapp-transfers-home-link');
  if (whatsappTransfersHome) {
    const mensagemTransfersHome = 'Olá! Vim através do site VUMBORA e gostaria de solicitar um orçamento para transfer.';
    whatsappTransfersHome.href = window.getWhatsAppLink(mensagemTransfersHome);
    if (!whatsappTransfersHome.hasAttribute('target')) {
      whatsappTransfersHome.setAttribute('target', '_blank');
      whatsappTransfersHome.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Textos do footer
  const whatsappText = document.getElementById('footer-whatsapp-text');
  const telefoneText = document.getElementById('footer-telefone');
  const footerEmail = document.getElementById('footer-email');
  if (window.WHATSAPP_NUMBER_FORMATTED) {
    if (whatsappText) whatsappText.textContent = window.WHATSAPP_NUMBER_FORMATTED;
    if (telefoneText) telefoneText.textContent = window.WHATSAPP_NUMBER_FORMATTED;
  }
  if (window.CONTACT_EMAIL && footerEmail) {
    footerEmail.textContent = window.CONTACT_EMAIL;
  }
};

// Função para configurar informações de contato na página
window.configurarInformacoesContato = function() {
  // Email
  const emailElements = document.querySelectorAll('[data-contact-email]');
  emailElements.forEach(el => {
    if (window.CONTACT_EMAIL) {
      if (el.tagName === 'A') {
        el.href = `mailto:${window.CONTACT_EMAIL}`;
        el.textContent = window.CONTACT_EMAIL;
      } else {
        el.textContent = window.CONTACT_EMAIL;
      }
    }
  });

  // Endereço
  const addressElements = document.querySelectorAll('[data-contact-address]');
  addressElements.forEach(el => {
    if (window.CONTACT_ADDRESS) {
      el.textContent = window.CONTACT_ADDRESS;
    }
  });

  // WhatsApp
  const whatsappElements = document.querySelectorAll('[data-contact-whatsapp]');
  whatsappElements.forEach(el => {
    if (window.WHATSAPP_NUMBER_FORMATTED) {
      el.textContent = window.WHATSAPP_NUMBER_FORMATTED;
    }
  });
};

// Configura automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.configurarLinksWhatsApp();
    window.configurarInformacoesContato();
  });
} else {
  window.configurarLinksWhatsApp();
  window.configurarInformacoesContato();
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================

// Função para inicializar o formulário de contato
window.initContactForm = function() {
  const form = document.getElementById('contato-form');
  const formMessage = document.getElementById('form-message');
  const btnSubmit = form?.querySelector('.btn-submit');
  const btnText = btnSubmit?.querySelector('.btn-text');
  const btnLoading = btnSubmit?.querySelector('.btn-loading');

  if (!form) {
    console.log('Formulário de contato não encontrado');
    return;
  }

  // Evitar inicialização duplicada
  if (form.dataset.initialized === 'true') {
    return;
  }
  form.dataset.initialized = 'true';

  console.log('Formulário de contato inicializado');

  // Detectar caminho base do site
  function getBasePath() {
    const path = window.location.pathname;
    // Se estiver em /pages/, voltar um nível
    if (path.includes('/pages/')) {
      return '../';
    }
    // Se estiver na raiz
    return './';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Esconder mensagem anterior
    if (formMessage) formMessage.style.display = 'none';

    // Desabilitar botão e mostrar loading
    if (btnSubmit) btnSubmit.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';

    // Coletar dados do formulário
    const formData = {
      nome: document.getElementById('nome')?.value || '',
      email: document.getElementById('email')?.value || '',
      telefone: document.getElementById('telefone')?.value || 'Não informado',
      assunto: document.getElementById('assunto')?.value || '',
      mensagem: document.getElementById('mensagem')?.value || ''
    };

    try {
      // Enviar para a API PHP
      const apiUrl = getBasePath() + 'api/enviar-contato.php';
      console.log('Enviando para:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Verificar se a resposta é válida
      if (!response.ok) {
        const textoErro = await response.text();
        console.error('Resposta do servidor:', textoErro);
        throw new Error('Erro no servidor: ' + response.status);
      }

      const resultado = await response.json();

      if (resultado.sucesso) {
        // Sucesso
        if (formMessage) {
          formMessage.className = 'form-message form-message-success';
          formMessage.innerHTML = '✅ ' + resultado.mensagem;
          formMessage.style.display = 'block';
        }
        form.reset();
      } else {
        throw new Error(resultado.erro || 'Erro desconhecido');
      }

      // Scroll para a mensagem
      if (formMessage) {
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      if (formMessage) {
        formMessage.className = 'form-message form-message-error';
        formMessage.innerHTML = '❌ ' + (error.message || 'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } finally {
      // Reabilitar botão
      if (btnSubmit) btnSubmit.disabled = false;
      if (btnText) btnText.style.display = 'inline';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  });
};

