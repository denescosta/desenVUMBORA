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
    const cardsHTML = this.testimonials.map(t => this.criarCardHTML(t)).join('');
    const duplicatedCardsHTML = this.testimonials.map(t => this.criarCardHTML(t)).join('');

    container.innerHTML = cardsHTML + duplicatedCardsHTML;
    
    // Garantir que a animação CSS seja aplicada corretamente
    // Força o navegador a recalcular o layout
    void container.offsetWidth;
    
    // Garantir que a animação não seja interrompida no mobile
    requestAnimationFrame(() => {
      const scrollElement = container;
      if (scrollElement) {
        // Remove qualquer estilo inline que possa estar interferindo
        scrollElement.style.animation = '';
        scrollElement.style.transform = '';
        // Força o navegador a aplicar a animação CSS novamente
        scrollElement.offsetHeight;
      }
    });
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

