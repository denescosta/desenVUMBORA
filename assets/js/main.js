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
    // Remover listeners antigos se existirem
    const newButton = sidebarButton.cloneNode(true);
    sidebarButton.parentNode.replaceChild(newButton, sidebarButton);
    
    // Adicionar novo listener
    const finalButton = document.getElementById('botao-sidebar');
    finalButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sidebar.classList.toggle('aberta');
      document.body.classList.toggle('sidebar-aberta', sidebar.classList.contains('aberta'));
    });
    
    // Fecha a sidebar ao clicar no overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('aberta');
        document.body.classList.remove('sidebar-aberta');
      });
    }
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
  // Adicionar listeners para botões CTA e navegação âncora
  const anchorButtons = document.querySelectorAll('.btn, .cta-button, .tour-btn, .secondary-button, .hero-btn, nav a');
  anchorButtons.forEach(btn => {
    const href = btn.getAttribute('href');
    // Tratar links que começam com # ou que apontam para index.html#ancora
    if (href && (href.startsWith('#') || href.includes('#testimonials') || href.includes('#about') || href.includes('#tours'))) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        let targetHash = href;
        
        // Se o link aponta para index.html#ancora, extrair apenas o hash
        if (href.includes('#')) {
          targetHash = '#' + href.split('#')[1];
        }
        
        // Se estiver em outra página, redirecionar para index.html com o hash
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage !== 'index.html' && targetHash) {
          window.location.href = '../index.html' + targetHash;
          return;
        }
        
        // Se já estiver na home, fazer scroll
        if (currentPage === 'index.html') {
          history.replaceState(null, '', targetHash); // Atualiza o hash sem scroll automático do navegador
          setTimeout(() => {
            smoothScroll(targetHash);
          }, 100);
        }
      });
    }
  });
}

// Inicialização da página sobre
function initAboutPage() {
  // Adicionar efeitos específicos da página sobre
  const skills = document.querySelectorAll('.skill');
  skills.forEach((skill, index) => {
    skill.style.animationDelay = `${index * 0.1}s`;
  });
}

// Inicialização da página contato
function initContactPage() {
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

// Controle de carregamento da seção de tours
let toursSectionLoading = null;
let toursSectionInitialized = false;
let toursCarouselInstance = null;

function setToursNavigationState(isActive) {
  const toursSection = document.querySelector('#tours');
  if (!toursSection) return;

  const prevBtn = toursSection.querySelector('.carousel-btn-prev');
  const nextBtn = toursSection.querySelector('.carousel-btn-next');
  const indicators = toursSection.querySelector('.carousel-indicators');

  if (prevBtn) prevBtn.disabled = !isActive;
  if (nextBtn) nextBtn.disabled = !isActive;
  if (!isActive && indicators) {
    indicators.innerHTML = '';
  }
}

function initToursCarousel(force = false) {
  const toursSection = document.querySelector('#tours') || document.querySelector('.tours');
  if (!toursSection) {
    return;
  }

  const carouselWrapper = toursSection.querySelector('.tours-carousel-wrapper');
  const toursList = toursSection.querySelector('#tours-destaques');
  let prevBtn = toursSection.querySelector('.carousel-btn-prev');
  let nextBtn = toursSection.querySelector('.carousel-btn-next');
  let indicatorsContainer = toursSection.querySelector('.carousel-indicators');

  if (!carouselWrapper || !toursList || !prevBtn || !nextBtn) {
    return;
  }

  const tourCards = toursList.querySelectorAll('.tour-card');
  if (tourCards.length === 0) {
    setToursNavigationState(false);
    return;
  }

  if (!indicatorsContainer) {
    indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    carouselWrapper.insertAdjacentElement('afterend', indicatorsContainer);
  }

  // Armazenar referências para remover listeners depois
  // Não precisamos clonar os botões, apenas garantir que os listeners sejam únicos
  let currentIndex = 0;
  let cardsToShow = 4;
  
  // Constantes para autoplay
  const AUTOPLAY_DELAY = 4000; // 4 segundos entre slides
  const AUTOPLAY_PAUSE_ON_INTERACTION = 10000; // Pausa por 10s após interação
  
  // Handlers que serão armazenados para remoção posterior
  let prevSlideHandler = null;
  let nextSlideHandler = null;
  let keyHandler = null;
  let resizeHandler = null;
  
  // Variáveis para autoplay
  let autoplayInterval = null;
  let autoplayPaused = false;
  let autoplayResumeTimeout = null;

  function getCardsToShow() {
    const width = window.innerWidth;
    if (width >= 1400) return 4;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  function getMaxSlides() {
    cardsToShow = getCardsToShow();
    return Math.max(0, tourCards.length - cardsToShow);
  }

  function createIndicators() {
    if (!indicatorsContainer) return;
    indicatorsContainer.innerHTML = '';
    const total = getMaxSlides() + 1;
    if (total <= 1) {
      setToursNavigationState(false);
      return;
    }

    setToursNavigationState(true);

    for (let i = 0; i < total; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(indicator);
    }
  }

  function updateIndicators() {
    if (!indicatorsContainer) return;
    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  function updateButtons() {
    const maxSlides = getMaxSlides();
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxSlides;
  }

  function getGap() {
    const computedStyle = window.getComputedStyle(toursList);
    const gap = parseInt(computedStyle.gap || '32', 10);
    return Number.isNaN(gap) ? 32 : gap;
  }

  function moveCarousel() {
    const firstCard = tourCards[0];
    const carousel = toursSection.querySelector('.tours-carousel');
    if (!firstCard || !carousel) return;

    const cardWidth = firstCard.offsetWidth;
    if (cardWidth === 0) {
      setTimeout(moveCarousel, 50);
      return;
    }

    const gap = getGap();
    const carouselWidth = carousel.offsetWidth;
    
    // Em mobile, o card ocupa 100% da viewport e o gap fica fora
    if (window.innerWidth <= 768) {
      // O card ocupa 100% da largura do carrossel
      // O gap fica entre os cards, mas fora da viewport
      // Calcula o translateX para alinhar o card à esquerda da viewport
      const translateX = -(currentIndex * (carouselWidth + gap));
      toursList.style.transform = `translateX(${translateX}px)`;
    } else {
      // Em desktop, comportamento normal (alinhado à esquerda)
      const translateX = -(currentIndex * (cardWidth + gap));
      toursList.style.transform = `translateX(${translateX}px)`;
    }
    
    toursList.style.transition = 'transform 0.5s ease';
    updateIndicators();
    updateButtons();
  }

  function goToSlide(index) {
    const maxSlides = getMaxSlides();
    currentIndex = Math.max(0, Math.min(index, maxSlides));
    moveCarousel();
    // Pausa autoplay temporariamente ao navegar manualmente
    if (autoplayInterval || autoplayPaused) {
      pauseOnInteraction();
    }
  }

  // Variáveis para armazenar referências dos handlers de swipe (mobile)
  let swipeHandlers = null;
  let swipeCarousel = null;
  
  // Remover listeners antigos se existirem
  if (toursCarouselInstance && toursCarouselInstance.destroy) {
    toursCarouselInstance.destroy();
  }

  function nextSlide(e) {
    if (e) e.preventDefault();
    goToSlide(currentIndex + 1);
  }

  function prevSlide(e) {
    if (e) e.preventDefault();
    goToSlide(currentIndex - 1);
  }

  // Armazenar referências dos handlers
  prevSlideHandler = prevSlide;
  nextSlideHandler = nextSlide;

  prevBtn.addEventListener('click', prevSlideHandler);
  nextBtn.addEventListener('click', nextSlideHandler);

  keyHandler = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  carouselWrapper.setAttribute('role', 'region');
  carouselWrapper.setAttribute('aria-label', 'Carrossel de passeios em destaque');
  carouselWrapper.addEventListener('keydown', keyHandler);

  // ========== AUTOPLAY ==========
  function startAutoplay() {
    if (autoplayInterval) return; // Já está rodando
    
    autoplayInterval = setInterval(() => {
      if (!autoplayPaused) {
        const maxSlides = getMaxSlides();
        if (currentIndex >= maxSlides) {
          // Volta para o início quando chega no fim
          goToSlide(0);
        } else {
          // Vai para o próximo slide
          nextSlide();
        }
      }
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
    if (autoplayResumeTimeout) {
      clearTimeout(autoplayResumeTimeout);
      autoplayResumeTimeout = null;
    }
  }

  function pauseAutoplay() {
    autoplayPaused = true;
    stopAutoplay();
  }

  function resumeAutoplay() {
    autoplayPaused = false;
    // Cancela qualquer timeout de retomada pendente
    if (autoplayResumeTimeout) {
      clearTimeout(autoplayResumeTimeout);
      autoplayResumeTimeout = null;
    }
    startAutoplay();
  }

  // Pausa quando o usuário interage e agenda retomada
  function pauseOnInteraction() {
    pauseAutoplay();
    // Cancela qualquer timeout anterior e agenda um novo
    if (autoplayResumeTimeout) {
      clearTimeout(autoplayResumeTimeout);
    }
    autoplayResumeTimeout = setTimeout(() => {
      resumeAutoplay();
      autoplayResumeTimeout = null;
    }, AUTOPLAY_PAUSE_ON_INTERACTION);
  }

  // Pausa no hover
  carouselWrapper.addEventListener('mouseenter', pauseAutoplay);
  carouselWrapper.addEventListener('mouseleave', resumeAutoplay);
  
  // Pausa ao clicar nos indicadores (goToSlide já pausa automaticamente)
  // Os botões prev/next também já chamam goToSlide, então não precisamos adicionar listeners extras

  // ========== SWIPE APENAS PARA MOBILE (TOUCH) ==========
  // Detecta se é dispositivo touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    const carousel = toursSection.querySelector('.tours-carousel');
    let isDragging = false;
    let dragStartX = 0;
    let dragStartTime = 0;
    let startElement = null;
    const MIN_SWIPE_DISTANCE = 50; // Distância mínima em pixels para considerar um swipe
    const MIN_SWIPE_SPEED = 0.3; // Velocidade mínima em pixels/ms para considerar um swipe rápido

    // Função para verificar se o elemento é clicável (link, botão, etc)
    function isClickableElement(element) {
      if (!element) return false;
      
      // Verifica se é um link, botão ou elemento com evento de clique
      const tagName = element.tagName.toLowerCase();
      if (tagName === 'a' || tagName === 'button') {
        return true;
      }
      
      // Verifica se tem role de botão ou link
      const role = element.getAttribute('role');
      if (role === 'button' || role === 'link') {
        return true;
      }
      
      // Verifica se tem classe de botão
      if (element.classList.contains('tour-btn') || 
          element.classList.contains('btn') ||
          element.closest('.tour-btn') ||
          element.closest('a')) {
        return true;
      }
      
      return false;
    }

    // Função para calcular a posição base do carrossel
    function getBaseTranslateX() {
      const firstCard = tourCards[0];
      if (!firstCard || !carousel) return 0;
      
      const cardWidth = firstCard.offsetWidth;
      if (cardWidth === 0) {
        // Tenta ler a posição atual do transform
        const currentTransform = window.getComputedStyle(toursList).transform;
        if (currentTransform && currentTransform !== 'none') {
          const matrix = currentTransform.match(/matrix\(([^)]+)\)/);
          if (matrix && matrix[1]) {
            const values = matrix[1].split(',').map(v => parseFloat(v.trim()));
            return values[4] || 0; // translateX está na posição 4 da matrix
          }
        }
        return 0;
      }
      
      const gap = getGap();
      const carouselWidth = carousel.offsetWidth;
      
      if (window.innerWidth <= 768) {
        return -(currentIndex * (carouselWidth + gap));
      } else {
        return -(currentIndex * (cardWidth + gap));
      }
    }

    // Inicia o swipe
    function startSwipe(e) {
      const touch = e.touches[0];
      startElement = document.elementFromPoint(touch.clientX, touch.clientY);
      
      // Se tocou em um elemento clicável, não inicia o swipe
      if (isClickableElement(startElement)) {
        return;
      }
      
      isDragging = true;
      dragStartX = touch.clientX;
      dragStartTime = Date.now();
      
      // Remove transição durante o swipe para feedback visual melhor
      toursList.style.transition = 'none';
      
      // Pausa autoplay durante swipe
      pauseAutoplay();
      
      // Previne scroll apenas se não for um elemento clicável
      if (!isClickableElement(startElement)) {
        e.preventDefault();
      }
    }

    // Atualiza o swipe
    function updateSwipe(e) {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const diff = dragStartX - touch.clientX;
      
      // Calcula a posição base do carrossel
      const baseTranslateX = getBaseTranslateX();
      
      // Aplica o swipe em tempo real
      toursList.style.transform = `translateX(${baseTranslateX - diff}px)`;
    }

    // Finaliza o swipe
    function endSwipe(e) {
      if (!isDragging) return;
      
      isDragging = false;
      const touch = e.changedTouches[0];
      const dragEndX = touch.clientX;
      const dragDistance = dragStartX - dragEndX;
      const dragTime = Date.now() - dragStartTime;
      const dragSpeed = dragTime > 0 ? Math.abs(dragDistance) / dragTime : 0;
      
      // Verifica se soltou sobre um elemento clicável
      const endElement = document.elementFromPoint(touch.clientX, touch.clientY);
      if (isClickableElement(endElement) || isClickableElement(startElement)) {
        // Se foi um clique em elemento interativo, restaura posição e não processa swipe
        toursList.style.transition = 'transform 0.5s ease';
        moveCarousel();
        return;
      }
      
      // Restaura a transição
      toursList.style.transition = 'transform 0.5s ease';
      
      // Determina se deve mudar de slide
      const shouldChangeSlide = Math.abs(dragDistance) > MIN_SWIPE_DISTANCE || 
                                (dragSpeed > MIN_SWIPE_SPEED && Math.abs(dragDistance) > 20);
      
      if (shouldChangeSlide) {
        if (dragDistance > 0) {
          // Deslizou para a esquerda - próximo slide
          nextSlide();
        } else {
          // Deslizou para a direita - slide anterior
          prevSlide();
        }
      } else {
        // Não mudou de slide, volta para a posição atual
        moveCarousel();
      }
      
      // Retoma autoplay após um tempo
      setTimeout(() => {
        resumeAutoplay();
      }, AUTOPLAY_PAUSE_ON_INTERACTION);
      
      startElement = null;
    }

    // Event listeners para touch (apenas mobile)
    // touchstart precisa ser passive: false para permitir preventDefault quando necessário
    carousel.addEventListener('touchstart', startSwipe, { passive: false });
    carousel.addEventListener('touchmove', updateSwipe, { passive: true });
    carousel.addEventListener('touchend', endSwipe, { passive: true });
    carousel.addEventListener('touchcancel', endSwipe, { passive: true });

    // Armazenar referências dos handlers para remoção posterior
    swipeHandlers = {
      touchstart: startSwipe,
      touchmove: updateSwipe,
      touchend: endSwipe,
      touchcancel: endSwipe
    };
    swipeCarousel = carousel;
  }

  // Inicia o autoplay após inicializar tudo
  createIndicators();
  requestAnimationFrame(() => {
    setTimeout(() => {
      moveCarousel();
      // Inicia autoplay apenas se houver mais de um slide
      const maxSlides = getMaxSlides();
      if (maxSlides > 0) {
        startAutoplay();
      }
    }, 50);
  });

  let resizeTimeout = null;
  resizeHandler = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const maxSlides = getMaxSlides();
      if (currentIndex > maxSlides) {
        currentIndex = maxSlides;
      }
      createIndicators();
      moveCarousel();
      // Reinicia autoplay após resize se necessário
      if (maxSlides > 0 && !autoplayInterval) {
        startAutoplay();
      } else if (maxSlides === 0) {
        stopAutoplay();
      }
    }, 150);
  };

  window.addEventListener('resize', resizeHandler);

  toursCarouselInstance = {
    destroy: () => {
      stopAutoplay();
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      if (keyHandler) {
        carouselWrapper.removeEventListener('keydown', keyHandler);
      }
      if (prevSlideHandler && prevBtn) {
        prevBtn.removeEventListener('click', prevSlideHandler);
      }
      if (nextSlideHandler && nextBtn) {
        nextBtn.removeEventListener('click', nextSlideHandler);
      }
      carouselWrapper.removeEventListener('mouseenter', pauseAutoplay);
      carouselWrapper.removeEventListener('mouseleave', resumeAutoplay);
      
      // Remove handlers de swipe se existirem (apenas mobile)
      if (swipeHandlers && swipeCarousel) {
        swipeCarousel.removeEventListener('touchstart', swipeHandlers.touchstart);
        swipeCarousel.removeEventListener('touchmove', swipeHandlers.touchmove);
        swipeCarousel.removeEventListener('touchend', swipeHandlers.touchend);
        swipeCarousel.removeEventListener('touchcancel', swipeHandlers.touchcancel);
      }
    }
  };
}

// Função para inicializar os passeios em destaque
async function initToursSection(force = false) {
  const toursSection = document.querySelector('#tours') || document.querySelector('.tours');
  const destaquesGrid = document.getElementById('tours-destaques');

  if (!toursSection || !destaquesGrid) {
    return;
  }

  if (typeof window.passeiosManager === 'undefined') {
    //console.warn('⚠️ passeiosManager não disponível para renderizar destaques');
    return;
  }

  if (toursSectionInitialized && !force) {
    return;
  }

  if (toursSectionLoading && !force) {
    return toursSectionLoading;
  }

  destaquesGrid.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando passeios...</p>
    </div>
  `;

  toursSectionLoading = window.passeiosManager.renderizarDestaques('tours-destaques', 8, { linkPrefix: 'pages/' })
    .then((total) => {
      toursSectionInitialized = true;
      if (total > 0) {
        requestAnimationFrame(() => {
          setTimeout(() => initToursCarousel(true), 50);
        });
      } else {
        setToursNavigationState(false);
      }
    })
    .catch((error) => {
      console.error('❌ Erro ao renderizar os passeios em destaque:', error);
      destaquesGrid.innerHTML = '<p class="no-results">Não foi possível carregar os passeios agora.</p>';
      setToursNavigationState(false);
    })
    .finally(() => {
      toursSectionLoading = null;
    });

  return toursSectionLoading;
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar carregamento dos componentes
  setTimeout(() => {
    animateOnScroll();
    addVisualEffects();
    toggleMobileMenu();
    toggleSidebar(); // <-- Adiciona inicialização do sidebar
    initPageSpecificFeatures();
    initToursSection(); // <-- Inicializa os destaques de passeios

    // Handler para links do nav que apontam para âncoras (ex: Feedbacks -> #testimonials)
    const navLinks = document.querySelectorAll('nav.main-nav a, .sidebar a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Verificar se o link aponta para index.html#ancora
        if (href && href.includes('#testimonials')) {
          e.preventDefault();
          const currentPage = window.location.pathname.split('/').pop() || 'index.html';
          
          // Se não estiver na home, redirecionar
          if (currentPage !== 'index.html') {
            window.location.href = '../index.html#testimonials';
            return;
          }
          
          // Se já estiver na home, fazer scroll
          history.replaceState(null, '', '#testimonials');
          setTimeout(() => {
            smoothScroll('#testimonials');
          }, 100);
        }
      });
    });

    // Scroll suave para hash na URL após carregamento
    if (window.location.hash) {
      setTimeout(() => {
        smoothScroll(window.location.hash);
      }, 200);
    }
  }, 200);
});

// Re-inicializar destaques após carregar componentes dinâmicos
if (window.loadComponent) {
  const originalLoad = window.loadComponent;
  window.loadComponent = async function (containerId, componentPath) {
    await originalLoad(containerId, componentPath);
    // Se o componente carregado contém a seção de tours, re-inicializa os destaques
    if (containerId === 'tours' || componentPath.includes('tours.html')) {
      setTimeout(() => {
        initToursSection(true);
      }, 100);
    }
  };
}

// Funcionalidades globais
window.smoothScroll = smoothScroll;
window.validateField = validateField;
window.initToursSection = initToursSection;
window.initToursCarousel = initToursCarousel;
window.toggleSidebar = toggleSidebar;