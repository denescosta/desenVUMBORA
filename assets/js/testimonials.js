// testimonials.js - Sistema de carregamento de depoimentos

class TestimonialsManager {
  constructor() {
    this.testimonials = [];
    this.dataPath = this.detectarCaminhoData();
  }

  detectarCaminhoData() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
      return '../data/testimonials.json';
    }
    return 'data/testimonials.json';
  }

  async carregarDepoimentos() {
    try {
      const response = await fetch(this.dataPath, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.testimonials = data.testimonials || [];
      
      return this.testimonials;
    } catch (error) {
      console.error('❌ Erro ao carregar depoimentos:', error);
      console.error('   Caminho tentado:', this.dataPath);
      return [];
    }
  }

  criarCardHTML(testimonial) {
    let starsHTML = '';
    if (testimonial.estrelas && testimonial.estrelas > 0) {
      starsHTML = '<div class="testimonial-rating">';
      for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star ${i <= testimonial.estrelas ? 'filled' : 'empty'}">★</span>`;
      }
      starsHTML += '</div>';
    }

    return `
      <div class="testimonial-card">
        ${starsHTML}
        <p class="testimonial-text">"${testimonial.texto || ''}"</p>
        <div class="testimonial-info">
          <span class="testimonial-author">${testimonial.autor || ''}</span>
          <span class="testimonial-date">${testimonial.data || ''}</span>
        </div>
      </div>
    `;
  }

  async renderizarDepoimentos() {
    const container = document.getElementById('testimonials-container');
    if (!container) {
      console.warn('⚠️ Container de depoimentos não encontrado');
      return;
    }

    // Mostrar loading enquanto carrega
    if (this.testimonials.length === 0) {
      await this.carregarDepoimentos();
    }

    if (this.testimonials.length === 0) {
      container.innerHTML = 
        '<div class="testimonial-card"><p class="testimonial-text">Nenhum depoimento cadastrado ainda.</p></div>';
      return;
    }

    // Ordenar por posição (menor número primeiro), depois por data
    this.testimonials.sort((a, b) => {
      const posA = parseInt(a.posicao) || 999;
      const posB = parseInt(b.posicao) || 999;

      if (posA !== posB) {
        return posA - posB;
      }

      const dataA = a.data ? new Date(a.data.split('/').reverse().join('-')) : 0;
      const dataB = b.data ? new Date(b.data.split('/').reverse().join('-')) : 0;
      return dataB - dataA;
    });

    // Renderizar cards (duplicar para loop infinito)
    // Criar os cards originais
    const cardsHTML = this.testimonials.map(t => this.criarCardHTML(t)).join('');
    // Criar os cards duplicados (sem gap adicional)
    const duplicatedCardsHTML = this.testimonials.map(t => this.criarCardHTML(t)).join('');

    // Renderizar tudo junto para garantir continuidade
    container.innerHTML = cardsHTML + duplicatedCardsHTML;
    
    // AGUARDAR que os cards sejam totalmente renderizados e suas dimensões calculadas
    // antes de iniciar a animação
    const initAnimation = () => {
      // Forçar o navegador a calcular as dimensões finais
      void container.offsetWidth;
      void container.offsetHeight;
      
      // Verificar se os cards têm dimensões válidas
      const firstCard = container.querySelector('.testimonial-card');
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const containerWidth = container.scrollWidth || container.offsetWidth;
        
        // Só iniciar a animação se os cards tiverem dimensões válidas
        // e se o container tiver largura suficiente (pelo menos 2x a largura de um card)
        if (cardWidth > 0 && containerWidth >= cardWidth * 2) {
          // Aguardar mais frames para garantir que tudo está totalmente renderizado
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // Verificar novamente as dimensões antes de iniciar
                const finalCardWidth = firstCard.offsetWidth;
                const finalContainerWidth = container.scrollWidth || container.offsetWidth;
                
                if (finalCardWidth > 0 && finalContainerWidth >= finalCardWidth * 2) {
                  // Adicionar a classe que inicia a animação
                  container.classList.add('animation-ready');
                  
                  // Forçar reflow final para garantir que a animação seja aplicada
                  void container.offsetWidth;
                  
                  // Adicionar funcionalidade de pausar no touch (mobile)
                  // Usar bind para garantir o contexto correto
                  const manager = this;
                  setTimeout(() => {
                    manager.setupTouchPause(container);
                  }, 100);
                } else {
                  // Se as dimensões ainda não estiverem corretas, tentar novamente
                  setTimeout(initAnimation, 150);
                }
              });
            });
          });
        } else {
          // Se ainda não tiver dimensões válidas, tentar novamente após um delay
          setTimeout(initAnimation, 150);
        }
      } else {
        // Se não houver cards, tentar novamente após um delay
        setTimeout(initAnimation, 150);
      }
    };
    
    // Iniciar o processo de verificação após um pequeno delay
    // para garantir que o DOM foi atualizado
    setTimeout(initAnimation, 100);
  }

  setupTouchPause(container) {
    // Encontrar o wrapper dos testimonials
    const wrapper = container.closest('.testimonials-scroll-wrapper');
    if (!wrapper) {
      console.warn('⚠️ Wrapper de testimonials não encontrado');
      return;
    }

    // Variável para controlar se está pausado
    let isPaused = false;
    let pauseTimeout = null;

    // Função para pausar a animação
    const pauseAnimation = () => {
      if (container.classList.contains('animation-ready') && !isPaused) {
        // Pausar usando style inline com !important via setProperty
        container.style.setProperty('animation-play-state', 'paused', 'important');
        container.style.setProperty('-webkit-animation-play-state', 'paused', 'important');
        isPaused = true;
        
        // Limpar timeout anterior se existir
        if (pauseTimeout) {
          clearTimeout(pauseTimeout);
          pauseTimeout = null;
        }
      }
    };

    // Função para retomar a animação
    const resumeAnimation = () => {
      if (container.classList.contains('animation-ready') && isPaused) {
        // Remover o style inline para voltar ao CSS
        container.style.removeProperty('animation-play-state');
        container.style.removeProperty('-webkit-animation-play-state');
        isPaused = false;
      }
    };

    // Pausar ao tocar (touchstart) - adicionar em múltiplos elementos para garantir
    wrapper.addEventListener('touchstart', pauseAnimation, { passive: true });
    container.addEventListener('touchstart', pauseAnimation, { passive: true });
    
    // Pausar no mouseenter (para desktop) - o CSS já cuida disso, mas vamos garantir
    wrapper.addEventListener('mouseenter', pauseAnimation, { passive: true });
    
    // Retomar ao soltar (touchend) com um pequeno delay para melhor UX
    const handleTouchEnd = () => {
      // Limpar timeout anterior
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
      }
      // Retomar após 500ms
      pauseTimeout = setTimeout(() => {
        resumeAnimation();
        pauseTimeout = null;
      }, 500);
    };
    
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Retomar no mouseleave (para desktop)
    wrapper.addEventListener('mouseleave', resumeAnimation, { passive: true });

    // Também retomar se o usuário sair da área (touchcancel)
    const handleTouchCancel = () => {
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
        pauseTimeout = null;
      }
      resumeAnimation();
    };
    
    wrapper.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    container.addEventListener('touchcancel', handleTouchCancel, { passive: true });
  }
}

// Instância global
const testimonialsManager = new TestimonialsManager();

// Função global para inicializar depoimentos
window.initTestimonials = async function() {
  await testimonialsManager.renderizarDepoimentos();
};

// Exportar para uso global
window.testimonialsManager = testimonialsManager;

