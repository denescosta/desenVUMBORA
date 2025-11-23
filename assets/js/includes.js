// includes.js - Sistema de carregamento de componentes e seções

class ComponentLoader {
  static async load(containerId, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = content;
      } else {
        // console.warn(`⚠️ Container '${containerId}' não encontrado`);
      }
    } catch (error) {
      // console.error(`❌ Erro ao carregar ${componentPath}:`, error);
    }
  }

  static async loadMultiple(components) {
    const promises = components.map(({ id, path }) =>
      this.load(id, path)
    );
    await Promise.all(promises);
  }
}

// Configuração global de componentes
const COMPONENTS = {
  header: '../components/header.html',
  footer: '../components/footer.html'
};

// Configuração específica para cada página
window.PAGE_CONFIGS = {
  'index.html': [
    { id: 'hero', path: '../sections/hero.html' },
    { id: 'about', path: '../sections/about.html' },
    { id: 'tours', path: '../sections/tours.html' },
    { id: 'servicos-privativos', path: '../sections/servicos-privativos.html' },
    { id: 'transfers', path: '../sections/transfers.html' },
    { id: 'testimonials', path: '../sections/testimonials.html' }
    // { id: 'faq', path: '../sections/faq.html' },
    // { id: 'blog', path: '../sections/blog.html' },
    // { id: 'contact', path: '../sections/contact.html' }
  ],
  'catalogo.html': [
    { id: 'catalogo-content', path: '../sections/catalogo-content.html' }
  ],
  'passeio.html': [
    { id: 'passeio-content', path: '../sections/passeio-content.html' }
  ],
  'conheca.html': [
    { id: 'conheca-page', path: '../sections/conheca.html' }
  ],
  'sobre.html': [
    { id: 'about-detailed', path: '../sections/about.html' }
  ],
  'contato.html': [
    { id: 'contact-form', path: '../sections/contact.html' }
  ],
  'about-us.html': [
    { id: 'about-us-content', path: '../sections/about-us-content.html' }
  ],
  'como-funciona.html': [
    { id: 'como-funciona-content', path: '../sections/como-funciona-content.html' }
  ],
  'servicos-privativos.html': [
    { id: 'servicos-privativos-content', path: '../sections/servicos-privativos-content.html' }
  ],
  'transfers.html': [
    { id: 'transfers-content', path: '../sections/transfers-content.html' }
  ]
};

// Função para detectar página atual
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page === '' ? 'index.html' : page;
}

// Função para destacar link ativo no menu
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Auto-carregamento quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
  // Carregar componentes comuns (header, footer)
  await ComponentLoader.loadMultiple([
    { id: 'header', path: COMPONENTS.header },
    { id: 'footer', path: COMPONENTS.footer }
  ]);

  // Destacar link ativo após carregar header
  setTimeout(setActiveNavLink, 100);

  // Inicializar sidebar após carregar header
  setTimeout(() => {
    if (typeof window.toggleSidebar === 'function') {
      window.toggleSidebar();
    } else if (typeof toggleSidebar === 'function') {
      toggleSidebar();
    }
  }, 150);

  // Configurar links do WhatsApp após carregar componentes
  setTimeout(() => {
    if (typeof window.configurarLinksWhatsApp === 'function') {
      window.configurarLinksWhatsApp();
    }
    if (typeof window.configurarInformacoesContato === 'function') {
      window.configurarInformacoesContato();
    }
  }, 200);

  // Reconfigurar links do WhatsApp quando conteúdo for carregado (hero, etc)
  document.addEventListener('contentLoaded', () => {
    setTimeout(() => {
      if (typeof window.configurarLinksWhatsApp === 'function') {
        window.configurarLinksWhatsApp();
      }
    }, 100);
  });

  // Carregar seções específicas da página
  const currentPage = getCurrentPage();
  const pageConfig = PAGE_CONFIGS[currentPage];

  if (pageConfig) {
    await ComponentLoader.loadMultiple(pageConfig);

    // Disparar evento customizado quando conteúdo for carregado
    const contentLoadedEvent = new CustomEvent('contentLoaded', {
      detail: { pageConfig }
    });
    document.dispatchEvent(contentLoadedEvent);

    // Inicializar carrossel se a seção de tours foi carregada
    if (pageConfig.some(config => config.id === 'tours' || config.path.includes('tours.html'))) {
      // Aguardar um pouco mais para garantir que os elementos estão renderizados
      setTimeout(() => {
        if (typeof window.initToursSection === 'function') {
          window.initToursSection();
        }
      }, 500);
    }

    // Configurar links do WhatsApp se o hero foi carregado
    if (pageConfig.some(config => config.id === 'hero' || config.path.includes('hero.html'))) {
      setTimeout(() => {
        if (typeof window.configurarLinksWhatsApp === 'function') {
          window.configurarLinksWhatsApp();
        }
      }, 300);
    }

    // Carregar depoimentos se a seção de testimonials foi carregada
    if (pageConfig.some(config => config.id === 'testimonials' || config.path.includes('testimonials.html'))) {
      setTimeout(() => {
        if (typeof window.initTestimonials === 'function') {
          window.initTestimonials();
        }
      }, 500);
    }

    // Scroll suave para âncora após carregar seções, se necessário
    if (window.pendingScrollTarget) {
      setTimeout(() => {
        if (typeof smoothScroll === 'function') {
          smoothScroll(window.pendingScrollTarget);
        }
        window.pendingScrollTarget = null;
      }, 50);
    }
  }
});

// Função utilitária para carregar componente individual
window.loadComponent = ComponentLoader.load;
window.loadMultipleComponents = ComponentLoader.loadMultiple;