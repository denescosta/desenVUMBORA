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
}

// Instância global
const testimonialsManager = new TestimonialsManager();

// Função global para inicializar depoimentos
window.initTestimonials = async function() {
  await testimonialsManager.renderizarDepoimentos();
};

// Exportar para uso global
window.testimonialsManager = testimonialsManager;

