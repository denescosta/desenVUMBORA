// passeios.js - Sistema de gerenciamento de passeios

class PasseiosManager {
  constructor() {
    this.passeios = [];
    this.passeioAtual = null;
    this.dataPath = '../data/passeios.json';
  }

  // Carrega todos os passeios do JSON
  async carregarPasseios() {
    try {
      const response = await fetch(this.dataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.passeios = data.passeios.filter(p => p.ativo);
      return this.passeios;
    } catch (error) {
      console.error('❌ Erro ao carregar passeios:', error);
      return [];
    }
  }

  // Busca um passeio específico por ID ou slug
  buscarPasseio(identificador) {
    return this.passeios.find(p =>
      p.id === identificador || p.slug === identificador
    );
  }

  // Busca passeios por categoria
  buscarPorCategoria(categoria) {
    return this.passeios.filter(p => p.categoria === categoria);
  }

  // Busca passeios em destaque
  buscarDestaques() {
    return this.passeios.filter(p => p.destaque);
  }

  // Formata preço
  formatarPreco(preco) {
    return `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
  }

  // Cria card de passeio para o catálogo
  criarCard(passeio, options = {}) {
    const linkPrefix = options.linkPrefix || '';
    const detailsUrl = `${linkPrefix}passeio.html?id=${passeio.slug}`;

    return `
      <article class="tour-card">
        <div class="tour-image">
          <img src="../${passeio.imagem_capa}" alt="${passeio.nome}" loading="lazy">
          ${passeio.destaque ? '<span class="tour-badge">Destaque</span>' : ''}
        </div>
        <div class="tour-content">
          <div class="tour-category">${passeio.categoria}</div>
          <h3 class="tour-title">${passeio.nome}</h3>
          <p class="tour-description">${passeio.descricao_curta}</p>
          <div class="tour-info">
            <span class="tour-duration">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              ${passeio.duracao}
            </span>
            <span class="tour-price">${passeio.preco_formatado}</span>
          </div>
          <a href="${detailsUrl}" class="tour-btn">Ver Detalhes</a>
        </div>
      </article>
    `;
  }

  // Renderiza o catálogo de passeios
  async renderizarCatalogo(containerId = 'catalogo-lista', filtroCategoria = null, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('⚠️ Container de catálogo não encontrado');
      return;
    }

    if (this.passeios.length === 0) {
      await this.carregarPasseios();
    }

    let passeiosFiltrados = this.passeios;
    if (filtroCategoria) {
      passeiosFiltrados = this.buscarPorCategoria(filtroCategoria);
    }

    if (passeiosFiltrados.length === 0) {
      container.innerHTML = '<p class="no-results">Nenhum passeio encontrado.</p>';
      return;
    }

    container.innerHTML = passeiosFiltrados.map(p => this.criarCard(p, options)).join('');
  }

  // Renderiza os passeios em destaque (usado na home)
  async renderizarDestaques(containerId = 'tours-destaques', limite = 4, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('⚠️ Container de destaques não encontrado');
      return 0;
    }

    if (this.passeios.length === 0) {
      await this.carregarPasseios();
    }

    let destaques = this.buscarDestaques();

    if (destaques.length === 0) {
      container.innerHTML = '<p class="no-results">Nenhum passeio em destaque no momento.</p>';
      return 0;
    }

    if (limite && Number.isFinite(limite)) {
      destaques = destaques.slice(0, limite);
    }

    const cards = destaques.map(passeio => {
      if (!passeio.preco_formatado && passeio.preco) {
        passeio.preco_formatado = this.formatarPreco(passeio.preco);
      }
      return this.criarCard(passeio, options);
    }).join('');

    container.innerHTML = cards;
    return destaques.length;
  }

  // Renderiza página de passeio individual
  async renderizarPasseioIndividual() {
    // Pega o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const passeioId = urlParams.get('id');

    if (!passeioId) {
      this.mostrarErro('Passeio não encontrado');
      return;
    }

    if (this.passeios.length === 0) {
      await this.carregarPasseios();
    }

    const passeio = this.buscarPasseio(passeioId);

    if (!passeio) {
      this.mostrarErro('Passeio não encontrado');
      return;
    }

    this.passeioAtual = passeio;
    this.preencherDetalhes(passeio);
    this.renderizarGaleria(passeio.galeria);
  }

  // Preenche os detalhes do passeio na página
  preencherDetalhes(passeio) {
    // Título da página
    document.title = `${passeio.nome} - VUMBORA`;

    // Imagem de capa
    const imgCapa = document.getElementById('passeio-imagem-capa');
    if (imgCapa) {
      imgCapa.src = `../${passeio.imagem_capa}`;
      imgCapa.alt = passeio.nome;
    }

    // Informações básicas
    this.setTextContent('passeio-categoria', passeio.categoria);
    this.setTextContent('passeio-nome', passeio.nome);
    this.setTextContent('passeio-descricao', passeio.descricao_completa);
    this.setTextContent('passeio-preco', passeio.preco_formatado);
    this.setTextContent('passeio-duracao', passeio.duracao);
    this.setTextContent('passeio-dificuldade', passeio.dificuldade);
    this.setTextContent('passeio-idade-minima', `${passeio.idade_minima} anos`);
    this.setTextContent('passeio-max-pessoas', `${passeio.max_pessoas} pessoas`);

    // O que está incluído
    const incluiLista = document.getElementById('passeio-inclui');
    if (incluiLista && passeio.inclui) {
      incluiLista.innerHTML = passeio.inclui
        .map(item => `<li>${item}</li>`)
        .join('');
    }

    // O que NÃO está incluído
    const naoIncluiLista = document.getElementById('passeio-nao-inclui');
    if (naoIncluiLista && passeio.nao_inclui) {
      naoIncluiLista.innerHTML = passeio.nao_inclui
        .map(item => `<li>${item}</li>`)
        .join('');
    }

    // Horários disponíveis
    const horariosLista = document.getElementById('passeio-horarios');
    if (horariosLista && passeio.horarios) {
      horariosLista.innerHTML = passeio.horarios
        .map(horario => `<span class="horario-badge">${horario}</span>`)
        .join('');
    }

    // Observações
    this.setTextContent('passeio-observacoes', passeio.observacoes);

    // Configura botão de WhatsApp
    this.configurarBotaoWhatsApp(passeio);
  }

  // Renderiza galeria de fotos usando PhotoSwipe
  renderizarGaleria(galeria) {
    const container = document.getElementById('passeio-galeria');
    if (!container || !galeria || galeria.length === 0) return;

    // Ordena galeria pela ordem definida
    const galeriaOrdenada = [...galeria].sort((a, b) => a.ordem - b.ordem);

    container.innerHTML = galeriaOrdenada.map((foto, index) => `
      <div class="gallery-item" data-pswp-width="1200" data-pswp-height="800">
        <a href="../${foto.url}" 
           data-pswp-src="../${foto.url}"
           target="_blank"
           rel="noopener noreferrer">
          <img src="../${foto.url}" alt="${foto.alt}" loading="lazy">
          <div class="gallery-overlay">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <path d="M11 8v6M8 11h6"/>
            </svg>
          </div>
        </a>
      </div>
    `).join('');

    // Inicializa PhotoSwipe
    this.inicializarPhotoSwipe(galeriaOrdenada);
  }

  // Inicializa PhotoSwipe (galeria de fotos)
  inicializarPhotoSwipe(galeria) {
    const galleryItems = document.querySelectorAll('.gallery-item a');

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.abrirGaleria(galeria, index);
      });
    });
  }

  // Abre galeria em lightbox simplificado (sem biblioteca externa)
  abrirGaleria(galeria, indexInicial = 0) {
    let currentIndex = indexInicial;

    // Cria overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-container">
        <button class="lightbox-close" aria-label="Fechar">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        <button class="lightbox-prev" aria-label="Anterior">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button class="lightbox-next" aria-label="Próximo">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <div class="lightbox-content">
          <img src="" alt="">
          <div class="lightbox-counter"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const img = overlay.querySelector('.lightbox-content img');
    const counter = overlay.querySelector('.lightbox-counter');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    const mostrarImagem = (index) => {
      const foto = galeria[index];
      img.src = `../${foto.url}`;
      img.alt = foto.alt;
      counter.textContent = `${index + 1} / ${galeria.length}`;
      currentIndex = index;

      // Desabilita botões nos limites
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === galeria.length - 1;
    };

    mostrarImagem(currentIndex);

    // Event listeners
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) mostrarImagem(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < galeria.length - 1) mostrarImagem(currentIndex + 1);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }
    });

    // Navegação por teclado
    document.addEventListener('keydown', function keyHandler(e) {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', keyHandler);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        mostrarImagem(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < galeria.length - 1) {
        mostrarImagem(currentIndex + 1);
      }
    });
  }

  // Configura botão de WhatsApp com mensagem personalizada
  configurarBotaoWhatsApp(passeio) {
    const botaoWhatsApp = document.getElementById('btn-reservar-whatsapp');
    if (!botaoWhatsApp) return;

    const telefone = '5511977100066'; // SUBSTITUA pelo número real
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de mais informações sobre o passeio:\n\n` +
      `📍 ${passeio.nome}\n` +
      `💰 ${passeio.preco_formatado}\n` +
      `⏱️ ${passeio.duracao}`
    );

    botaoWhatsApp.href = `https://wa.me/${telefone}?text=${mensagem}`;
  }

  // Utilitário para definir conteúdo de texto
  setTextContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = content;
    }
  }

  // Mostra erro quando passeio não é encontrado
  mostrarErro(mensagem) {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="error-container" style="text-align: center; padding: 60px 20px;">
          <h1 style="font-size: 3rem; color: #e74c3c;">😕</h1>
          <h2 style="margin: 20px 0; color: #2c3e50;">${mensagem}</h2>
          <p style="color: #7f8c8d; margin-bottom: 30px;">O passeio que você procura não existe ou foi removido.</p>
          <a href="catalogo.html" class="btn" style="display: inline-block; padding: 12px 30px; background: #3498db; color: white; text-decoration: none; border-radius: 6px;">
            Ver Todos os Passeios
          </a>
        </div>
      `;
    }
  }
}

// Instância global
const passeiosManager = new PasseiosManager();

// Funções globais de conveniência
window.carregarCatalogoPasseios = async (filtroCategoria = null, options = {}) => {
  await passeiosManager.renderizarCatalogo('catalogo-lista', filtroCategoria, options);
};

window.carregarPasseioIndividual = async () => {
  await passeiosManager.renderizarPasseioIndividual();
};

window.filtrarPasseios = async (evt, categoria) => {
  const eventObj = evt || window.event;
  const filtroButtons = document.querySelectorAll('.catalogo-filtros .filtro-btn');

  filtroButtons.forEach(btn => btn.classList.remove('active'));

  if (eventObj && eventObj.currentTarget) {
    eventObj.currentTarget.classList.add('active');
  } else if (eventObj && eventObj.target) {
    eventObj.target.classList.add('active');
  }

  const filtro = categoria === 'todas' ? null : categoria;
  await window.carregarCatalogoPasseios(filtro);
};

// Exportar para uso global
window.passeiosManager = passeiosManager;