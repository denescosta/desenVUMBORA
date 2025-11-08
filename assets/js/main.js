// main.js - Scripts principais da aplicação

// Configurações globais
const CONFIG = {
  animationDuration: 300,
  scrollOffset: 0
};

// Função para scroll suave
function smoothScroll(target) {
  let element = document.querySelector(target);
  if (element) {
    // Se houver um h2 dentro da seção, rola até ele
    const h2 = element.querySelector('h2');
    if (h2) element = h2;
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Função para animar elementos quando entram na viewport
function animateOnScroll() {
  const elements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => {
    observer.observe(element);
  });
}

// Função para manipular formulários
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  
  // Verificar se é o formulário de contato
  if (form.id === 'contato-form') {
    await handleContactFormSubmit(form);
  } else {
    // Comportamento padrão para outros formulários
    const formData = new FormData(form);
    console.log('Formulário enviado:', Object.fromEntries(formData));
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simular envio
    setTimeout(() => {
      submitButton.textContent = 'Enviado!';
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        form.reset();
      }, 2000);
    }, 1000);
  }
}

// Função para enviar email via EmailJS
async function handleContactFormSubmit(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const messageDiv = document.getElementById('form-message');
  const originalText = submitButton.textContent;
  
  // Validar campos obrigatórios
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  
  if (!nome || !email || !mensagem) {
    showMessage(messageDiv, 'Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  // Validar email
  if (!isValidEmail(email)) {
    showMessage(messageDiv, 'Por favor, insira um e-mail válido.', 'error');
    return;
  }
  
  // Preparar dados para enviar
  const templateParams = {
    from_name: nome,
    from_email: email,
    phone: telefone || 'Não informado',
    message: mensagem,
    to_email: 'denes_11@hotmail.com'
  };
  
  submitButton.textContent = 'Enviando...';
  submitButton.disabled = true;
  messageDiv.style.display = 'none';
  
  try {
    // Enviar email via EmailJS
    await emailjs.send(
      'service_jx6aned',      // Substitua pelo Service ID do EmailJS
      'template_jcygbvs',     // Substitua pelo Template ID do EmailJS
      templateParams
    );
    
    showMessage(messageDiv, '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    submitButton.textContent = 'Enviado!';
    form.reset();
    
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 3000);
    
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    showMessage(messageDiv, '❌ Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.', 'error');
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Função para mostrar mensagens de feedback
function showMessage(element, message, type) {
  element.textContent = message;
  element.style.display = 'block';
  element.style.padding = '10px';
  element.style.borderRadius = '6px';
  element.style.marginTop = '10px';
  
  if (type === 'success') {
    element.style.backgroundColor = '#d4edda';
    element.style.color = '#155724';
    element.style.border = '1px solid #c3e6cb';
  } else {
    element.style.backgroundColor = '#f8d7da';
    element.style.color = '#721c24';
    element.style.border = '1px solid #f5c6cb';
  }
}

// Função para adicionar efeitos visuais
function addVisualEffects() {
  // Adicionar classes CSS para animações
  const cards = document.querySelectorAll('.card, .service-item');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Função para controlar o menu mobile (se necessário)
function toggleMobileMenu() {
  const nav = document.querySelector('nav');
  const burger = document.querySelector('.burger-menu');

  if (burger) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
      burger.classList.toggle('active');
    });
  }
}

// Função para controlar o menu lateral (sidebar)
function toggleSidebar() {
  const sidebar = document.querySelector('header .sidebar');
  const sidebarButton = document.getElementById('botao-sidebar');
  if (sidebar && sidebarButton) {
    sidebarButton.addEventListener('click', (e) => {
      sidebar.classList.toggle('aberta');
      document.body.classList.toggle('sidebar-aberta', sidebar.classList.contains('aberta'));
      document.getElementById('header').classList.toggle('sidebar-aberta', sidebar.classList.contains('aberta'));
      e.stopPropagation();
    });
    // Fecha a sidebar ao clicar fora
    document.addEventListener('click', (e) => {
      if (
        sidebar.classList.contains('aberta') &&
        !sidebar.contains(e.target) &&
        e.target !== sidebarButton
      ) {
        sidebar.classList.remove('aberta');
        document.body.classList.remove('sidebar-aberta');
        document.getElementById('header').classList.remove('sidebar-aberta');
      }
    });
    // Fecha a sidebar ao clicar em qualquer link da sidebar
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const isAnchor = href && href.startsWith('#');
        if (isAnchor) {
          e.preventDefault();
          history.replaceState(null, '', href); // Atualiza o hash sem scroll automático do navegador
        }
        sidebar.classList.remove('aberta');
        document.body.classList.remove('sidebar-aberta');
        document.getElementById('header').classList.remove('sidebar-aberta');
        // Força o navegador a processar o fechamento antes do scroll
        void sidebar.offsetWidth;
        if (isAnchor) {
          smoothScroll(href);
        }
      });
    });
  }
}

// Função para adicionar funcionalidades específicas da página
function initPageSpecificFeatures() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  switch (currentPage) {
    case 'index.html':
      initHomePage();
      break;
    case 'sobre.html':
      initAboutPage();
      break;
    case 'contato.html':
      initContactPage();
      break;
  }
}

// Inicialização da página inicial
function initHomePage() {
  // console.log('🏠 Inicializando página inicial...');

  // Adicionar listeners para botões CTA e navegação âncora
  const anchorButtons = document.querySelectorAll('.btn, .cta-button, .tour-btn, .secondary-button, .hero-btn, nav a');
  anchorButtons.forEach(btn => {
    if (btn.getAttribute('href') && btn.getAttribute('href').startsWith('#')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const href = btn.getAttribute('href');
        history.replaceState(null, '', href); // Atualiza o hash sem scroll automático do navegador
        smoothScroll(href);
      });
    }
  });
}

// Inicialização da página sobre
function initAboutPage() {
  // console.log('👤 Inicializando página sobre...');

  // Adicionar efeitos específicos da página sobre
  const skills = document.querySelectorAll('.skill');
  skills.forEach((skill, index) => {
    skill.style.animationDelay = `${index * 0.1}s`;
  });
}

// Inicialização da página contato
function initContactPage() {
  // console.log('📞 Inicializando página contato...');

  // Adicionar validação e handlers para formulários
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);

    // Adicionar validação em tempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
    });
  });
}

// Função para validar campos individuais
function validateField(event) {
  const field = event.target;
  const value = field.value.trim();

  // Remover mensagens de erro existentes
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Validação básica
  let isValid = true;
  let errorMessage = '';

  if (field.required && !value) {
    isValid = false;
    errorMessage = 'Este campo é obrigatório';
  } else if (field.type === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMessage = 'E-mail inválido';
  }

  // Mostrar erro se necessário
  if (!isValid) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = errorMessage;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'red';
  } else {
    field.style.borderColor = '#ddd';
  }

  return isValid;
}

// Função para validar e-mail
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Variável para armazenar a instância do carrossel
let toursCarouselInstance = null;

// Função para inicializar o carrossel de tours
function initToursCarousel() {
  console.log('🚀 initToursCarousel chamado');
  
  // Buscar elementos de forma mais específica
  const toursSection = document.querySelector('#tours') || document.querySelector('.tours');
  if (!toursSection) {
    console.log('❌ Seção tours não encontrada');
    return;
  }
  
  const carouselWrapper = toursSection.querySelector('.tours-carousel-wrapper');
  const toursList = toursSection.querySelector('.tours-list');
  const prevBtn = toursSection.querySelector('.carousel-btn-prev');
  const nextBtn = toursSection.querySelector('.carousel-btn-next');
  let indicatorsContainer = toursSection.querySelector('.carousel-indicators');

  console.log('🔍 Elementos encontrados:', {
    carouselWrapper: !!carouselWrapper,
    toursList: !!toursList,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn,
    indicatorsContainer: !!indicatorsContainer
  });

  // Verificar se os elementos principais existem
  if (!carouselWrapper || !toursList) {
    console.log('❌ Elementos principais do carrossel não encontrados');
    return;
  }

  // Verificar se os botões existem
  if (!prevBtn || !nextBtn) {
    console.log('❌ Botões de navegação não encontrados');
    return;
  }

  // Criar container de indicadores se não existir
  let finalIndicatorsContainer = indicatorsContainer;
  if (!finalIndicatorsContainer) {
    console.log('⚠️ Container de indicadores não encontrado, criando...');
    // Procurar o container pai (div.container dentro da seção tours)
    const toursSection = carouselWrapper.closest('.tours') || carouselWrapper.closest('#tours');
    const container = toursSection ? toursSection.querySelector('.container') : null;
    
    if (container) {
      finalIndicatorsContainer = document.createElement('div');
      finalIndicatorsContainer.className = 'carousel-indicators';
      container.appendChild(finalIndicatorsContainer);
      console.log('✅ Container de indicadores criado');
    } else {
      // Se não encontrar o container, criar após o carousel-wrapper
      finalIndicatorsContainer = document.createElement('div');
      finalIndicatorsContainer.className = 'carousel-indicators';
      carouselWrapper.parentNode.appendChild(finalIndicatorsContainer);
      console.log('✅ Container de indicadores criado após carousel-wrapper');
    }
  }

  const tourCards = toursList.querySelectorAll('.tour-card');
  const totalCards = tourCards.length;
  
  console.log('📦 Cards encontrados:', totalCards);
  
  if (totalCards === 0) {
    console.log('❌ Nenhum card encontrado');
    return;
  }

  // Limpar instância anterior se existir
  if (toursCarouselInstance) {
    console.log('🔄 Limpando instância anterior');
    if (toursCarouselInstance.destroy) {
      toursCarouselInstance.destroy();
    }
    toursCarouselInstance = null;
  }

  // Clonar e substituir botões ANTES de definir as funções
  console.log('📌 Clonando botões para remover event listeners antigos');
  const prevBtnParent = prevBtn.parentNode;
  const nextBtnParent = nextBtn.parentNode;
  const newPrevBtn = prevBtn.cloneNode(true);
  const newNextBtn = nextBtn.cloneNode(true);
  prevBtnParent.replaceChild(newPrevBtn, prevBtn);
  nextBtnParent.replaceChild(newNextBtn, nextBtn);
  
  // Obter referências dos novos botões
  const finalPrevBtn = document.querySelector('.carousel-btn-prev');
  const finalNextBtn = document.querySelector('.carousel-btn-next');
  
  console.log('✅ Botões clonados:', {
    finalPrevBtn: !!finalPrevBtn,
    finalNextBtn: !!finalNextBtn
  });

  let currentIndex = 0;
  let cardsToShow = 4;
  let resizeHandler = null;
  
  // Função helper para obter referências atuais dos botões
  const getButtonRefs = () => {
    const btnPrev = document.querySelector('.carousel-btn-prev');
    const btnNext = document.querySelector('.carousel-btn-next');
    return { prev: btnPrev || finalPrevBtn, next: btnNext || finalNextBtn };
  };

  // Função para calcular quantos cards mostrar baseado no tamanho da tela
  function getCardsToShow() {
    const width = window.innerWidth;
    if (width >= 1400) {
      return 4;
    } else if (width >= 1024) {
      return 3;
    } else if (width >= 768) {
      return 2;
    } else {
      return 1;
    }
  }

  // Função para calcular o número máximo de slides
  function getMaxSlides() {
    cardsToShow = getCardsToShow();
    const max = Math.max(0, totalCards - cardsToShow);
    return max;
  }

  // Função para criar indicadores
  function createIndicators() {
    if (!finalIndicatorsContainer) return;
    
    finalIndicatorsContainer.innerHTML = '';
    const maxSlides = getMaxSlides();
    const btns = getButtonRefs();
    
    if (maxSlides <= 0) {
      if (btns.prev) btns.prev.style.display = 'none';
      if (btns.next) btns.next.style.display = 'none';
      return;
    }

    if (btns.prev) btns.prev.style.display = 'flex';
    if (btns.next) btns.next.style.display = 'flex';

    const totalIndicators = maxSlides + 1;
    for (let i = 0; i < totalIndicators; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      if (i === 0) indicator.classList.add('active');
      indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      indicator.addEventListener('click', () => goToSlide(i));
      finalIndicatorsContainer.appendChild(indicator);
    }
  }

  // Função para atualizar indicadores
  function updateIndicators() {
    if (!finalIndicatorsContainer) return;
    
    const indicators = finalIndicatorsContainer.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Função para atualizar botões de navegação
  function updateButtons() {
    const maxSlides = getMaxSlides();
    const btns = getButtonRefs();
    if (btns.prev) btns.prev.disabled = currentIndex === 0;
    if (btns.next) btns.next.disabled = currentIndex >= maxSlides;
  }

  // Função para obter o gap real do CSS
  function getGap() {
    const computedStyle = window.getComputedStyle(toursList);
    const gap = computedStyle.gap || computedStyle.columnGap || '32px';
    return parseInt(gap) || 32;
  }

  // Função para mover o carrossel
  function moveCarousel() {
    if (tourCards.length === 0) {
      console.log('Carrossel: moveCarousel - Nenhum card encontrado');
      return;
    }
    
    cardsToShow = getCardsToShow();
    const firstCard = tourCards[0];
    
    if (!firstCard) {
      console.log('Carrossel: moveCarousel - Primeiro card não encontrado, tentando novamente...');
      setTimeout(moveCarousel, 100);
      return;
    }

    // Aguardar renderização completa
    if (firstCard.offsetWidth === 0) {
      console.log('Carrossel: moveCarousel - Largura do card é 0, tentando novamente...');
      setTimeout(moveCarousel, 100);
      return;
    }
    
    const cardWidth = firstCard.offsetWidth;
    const gap = getGap();
    const translateX = -(currentIndex * (cardWidth + gap));
    
    console.log('Carrossel: moveCarousel executado', {
      currentIndex,
      cardWidth,
      gap,
      translateX,
      cardsToShow,
      totalCards
    });
    
    toursList.style.transform = `translateX(${translateX}px)`;
    toursList.style.transition = 'transform 0.5s ease';
    updateIndicators();
    updateButtons();
  }

  // Função para ir para um slide específico
  function goToSlide(index) {
    const maxSlides = getMaxSlides();
    currentIndex = Math.max(0, Math.min(index, maxSlides));
    moveCarousel();
  }

  // Função para próximo slide
  function nextSlide(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const maxSlides = getMaxSlides();
    if (currentIndex < maxSlides) {
      currentIndex++;
      moveCarousel();
    }
    return false;
  }

  // Função para slide anterior
  function prevSlide(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentIndex > 0) {
      currentIndex--;
      moveCarousel();
    }
    return false;
  }

  // Adicionar event listeners aos botões
  console.log('📌 Adicionando event listeners aos botões');
  
  if (!finalPrevBtn || !finalNextBtn) {
    console.error('❌ Erro: Botões não encontrados após clonagem!');
    return;
  }
  
  // Adicionar event listeners diretamente
  finalPrevBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('⬅️⬅️⬅️ BOTÃO ANTERIOR CLICADO! ⬅️⬅️⬅️');
    prevSlide(e);
  }, true); // Usar capture phase para garantir que o evento seja capturado
  
  finalNextBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('➡️➡️➡️ BOTÃO PRÓXIMO CLICADO! ➡️➡️➡️');
    nextSlide(e);
  }, true); // Usar capture phase para garantir que o evento seja capturado
  
  // Também adicionar usando onclick como fallback
  finalPrevBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('⬅️ onClick - Botão ANTERIOR clicado!');
    prevSlide(e);
    return false;
  };
  
  finalNextBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('➡️ onClick - Botão PRÓXIMO clicado!');
    nextSlide(e);
    return false;
  };
  
  console.log('✅ Event listeners adicionados com sucesso!');

  // Função para recalcular e reajustar quando a janela for redimensionada
  let resizeTimeout;
  resizeHandler = function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newMaxSlides = getMaxSlides();
      if (currentIndex > newMaxSlides) {
        currentIndex = Math.max(0, newMaxSlides);
      }
      createIndicators();
      moveCarousel();
    }, 250);
  };

  window.addEventListener('resize', resizeHandler);

  // Suporte para navegação por teclado
  carouselWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide(e);
    } else if (e.key === 'ArrowRight') {
      nextSlide(e);
    }
  });

  // Tornar o carrossel acessível
  carouselWrapper.setAttribute('role', 'region');
  carouselWrapper.setAttribute('aria-label', 'Carrossel de passeios');
  finalPrevBtn.setAttribute('aria-label', 'Slide anterior');
  finalNextBtn.setAttribute('aria-label', 'Próximo slide');
  
  console.log('🎯 Carrossel inicializado com sucesso!');

  // Inicialização
  createIndicators();
  updateButtons();
  
  // Aguardar um pouco antes de mover para garantir que os elementos estão renderizados
  // Usar requestAnimationFrame para garantir que o DOM está atualizado
  requestAnimationFrame(() => {
    setTimeout(() => {
      moveCarousel();
    }, 50);
  });

  // Marcar como inicializado e armazenar referências
  toursCarouselInstance = {
    initialized: true,
    resizeHandler: resizeHandler,
    destroy: function() {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
      }
      toursCarouselInstance = null;
    }
  };
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // console.log('🎯 Inicializando scripts principais...');

  // Aguardar carregamento dos componentes
  setTimeout(() => {
    animateOnScroll();
    addVisualEffects();
    toggleMobileMenu();
    toggleSidebar(); // <-- Adiciona inicialização do sidebar
    initPageSpecificFeatures();
    initToursCarousel(); // <-- Inicializa o carrossel de tours

    // Scroll suave para hash na URL após carregamento
    if (window.location.hash) {
      setTimeout(() => {
        smoothScroll(window.location.hash);
      }, 200);
    }

    // console.log('✅ Scripts principais inicializados!');
  }, 200);
});

// Re-inicializar carrossel após carregar componentes dinâmicos
if (window.loadComponent) {
  const originalLoad = window.loadComponent;
  window.loadComponent = async function(containerId, componentPath) {
    await originalLoad(containerId, componentPath);
    // Se o componente carregado contém a seção de tours, re-inicializa o carrossel
    if (containerId === 'tours' || componentPath.includes('tours.html')) {
      setTimeout(initToursCarousel, 100);
    }
  };
}

// Funcionalidades globais
window.smoothScroll = smoothScroll;
window.validateField = validateField;
window.initToursCarousel = initToursCarousel;