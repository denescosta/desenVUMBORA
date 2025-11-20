/* ============================================
   CONFIG.JS - Configurações Globais do Site
   ============================================ */

// Número do WhatsApp (formato internacional sem + e espaços)
// Exemplo: 558491274782 (Brasil: 55 + DDD + número)
// ALTERE AQUI para mudar o número em todo o site
window.WHATSAPP_NUMBER = '558491274782';

// Formata o número para exibição (com DDD e formatação brasileira)
// ALTERE AQUI para mudar a exibição do número em todo o site
window.WHATSAPP_NUMBER_FORMATTED = '(84) 91274-7822';

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
  
  const mensagem = `Olá! Gostaria de mais informações sobre o passeio:\n\n` +
    `📍 ${passeio.nome}\n` +
    `⏱️ ${passeio.duracao}`;
  
  return window.getWhatsAppLink(mensagem);
};

// Mensagem padrão para contato geral do site
window.WHATSAPP_MENSAGEM_GERAL = 'Olá! Vim através do site VUMBORA e gostaria de mais informações sobre os passeios.';

// Email de contato
// ALTERE AQUI para mudar o email em todo o site
window.CONTACT_EMAIL = 'contato123@vumbora.com.br';

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

