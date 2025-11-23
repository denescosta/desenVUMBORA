// passeios.js - Sistema de gerenciamento de passeios

class PasseiosManager {
  constructor() {
    this.passeios = [];
    this.passeioAtual = null;
    // Detectar caminho correto do JSON baseado na URL atual
    this.dataPath = this.detectarCaminhoData();
  }

  // Detecta o caminho correto do JSON baseado na localização atual
  detectarCaminhoData() {
    const path = window.location.pathname;
    // Se estiver em pages/, precisa de ../data/
    // Se estiver na raiz, precisa de data/
    if (path.includes('/pages/')) {
      return '../data/passeios.json';
    }
    return 'data/passeios.json';
  }

  // Detecta o caminho correto para seções HTML baseado na localização atual
  detectarCaminhoSections() {
    const path = window.location.pathname;
    // Se estiver em pages/, precisa de ../sections/
    // Se estiver na raiz, precisa de sections/
    if (path.includes('/pages/')) {
      return '../sections/';
    }
    return 'sections/';
  }

  // Carrega todos os passeios do JSON
  async carregarPasseios() {
    try {
      // Adicionar timeout de 10 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(this.dataPath, {
        signal: controller.signal,
        cache: 'no-cache' // Evitar cache em desenvolvimento
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !Array.isArray(data.passeios)) {
        throw new Error('Formato de dados inválido');
      }
      
      // Normalizar categorias (converter string para array se necessário) e remover preços
      this.passeios = data.passeios.filter(p => p.ativo).map(p => {
        // Normalizar categoria: se for string, converte para array
        if (!Array.isArray(p.categoria)) {
          p.categoria = p.categoria ? [p.categoria] : [];
        }
        // Remover campos de preço se existirem
        delete p.preco;
        delete p.preco_formatado;
        return p;
      });
      
      console.log(`✅ ${this.passeios.length} passeio(s) carregado(s)`);
      return this.passeios;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ Timeout ao carregar passeios (10s)');
      } else {
        console.error('❌ Erro ao carregar passeios:', error);
        console.error('   Caminho tentado:', this.dataPath);
      }
      return [];
    }
  }

  // Busca um passeio específico por ID ou slug
  buscarPasseio(identificador) {
    return this.passeios.find(p =>
      p.id === identificador || p.slug === identificador
    );
  }

  // Busca passeios por categoria (suporta categorias como array ou string)
  buscarPorCategoria(categoria) {
    return this.passeios.filter(p => {
      // Filtro especial para "Destaque" - verifica o campo booleano
      if (categoria === 'Destaque') {
        return p.destaque === true;
      }
      // Para outras categorias, verifica no array de categorias
      const categoriasPasseio = Array.isArray(p.categoria) ? p.categoria : [p.categoria];
      return categoriasPasseio.includes(categoria);
    });
  }

  // Busca passeios em destaque
  buscarDestaques() {
    return this.passeios.filter(p => p.destaque);
  }

  // Formata categorias para exibição (suporta array ou string)
  formatarCategorias(categoria) {
    if (Array.isArray(categoria)) {
      return categoria.join(', ');
    }
    return categoria || '';
  }

  // Cria card de passeio para o catálogo
  criarCard(passeio, options = {}) {
    const linkPrefix = options.linkPrefix || '';
    const detailsUrl = `${linkPrefix}passeio.html?id=${passeio.slug}`;
    const categoriasTexto = this.formatarCategorias(passeio.categoria);
    
    // Gera link do WhatsApp para agendamento
    let whatsappLink = '#';
    if (typeof window.getWhatsAppLinkPasseio === 'function') {
      whatsappLink = window.getWhatsAppLinkPasseio(passeio);
    } else {
      // Fallback caso config.js não tenha carregado
      const telefone = window.WHATSAPP_NUMBER || '558491274782';
      const mensagem = encodeURIComponent(
        `Olá! Vim através do VUMBORA e quero agendar um passeio:\n\n` +
        `📍 ${passeio.nome}\n` +
        `⏱️ ${passeio.duracao}`
      );
      whatsappLink = `https://wa.me/${telefone}?text=${mensagem}`;
    }

    return `
      <article class="tour-card">
        <div class="tour-image">
          <img src="../${passeio.imagem_capa}" alt="${passeio.nome}" loading="lazy" 
               onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect fill=\\'%23e0e0e0\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'16\\'%3EImagem não disponível%3C/text%3E%3C/svg%3E';">
          ${passeio.destaque ? '<span class="tour-badge">Destaque</span>' : ''}
        </div>
        <div class="tour-content">
          <div class="tour-category">${categoriasTexto}</div>
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
          </div>
          <div class="tour-buttons">
            <a href="${whatsappLink}" class="tour-btn tour-btn-whatsapp" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Agende agora
            </a>
            <a href="${detailsUrl}" class="tour-btn tour-btn-details">Ver Detalhes</a>
          </div>
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

    // Mostrar loading enquanto carrega
    if (this.passeios.length === 0) {
      container.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Carregando passeios...</p>
        </div>
      `;
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

    // Renderizar cards
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
    console.log('🔄 Preenchendo detalhes do passeio:', passeio.nome);
    
    // Verificar se os elementos principais existem
    const nomeElement = document.getElementById('passeio-nome');
    if (!nomeElement) {
      console.error('❌ Elemento passeio-nome não encontrado. HTML pode não ter sido carregado.');
      return;
    }
    
    // Título da página
    document.title = `${passeio.nome} - VUMBORA`;

    // Imagem de capa
    const imgCapa = document.getElementById('passeio-imagem-capa');
    if (imgCapa) {
      imgCapa.src = `../${passeio.imagem_capa}`;
      imgCapa.alt = passeio.nome;
      imgCapa.onerror = function() {
        this.onerror = null;
        this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\'%3E%3Crect fill=\'%23e0e0e0\' width=\'800\' height=\'600\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'sans-serif\' font-size=\'24\'%3EImagem não disponível%3C/text%3E%3C/svg%3E';
      };
    } else {
      console.warn('⚠️ Elemento passeio-imagem-capa não encontrado');
    }

    // Informações básicas
    const categoriasTexto = this.formatarCategorias(passeio.categoria);
    this.setTextContent('passeio-categoria', categoriasTexto);
    const categoriaBadge = document.getElementById('passeio-categoria-badge');
    if (categoriaBadge) {
      categoriaBadge.textContent = categoriasTexto;
    }
    this.setTextContent('passeio-nome', passeio.nome);
    this.setTextContent('passeio-descricao', passeio.descricao_completa);
    this.setTextContent('passeio-duracao', passeio.duracao);
    // Tipo de passeio (compatibilidade: usa tipo_passeio ou dificuldade)
    const tipoPasseio = passeio.tipo_passeio || passeio.dificuldade || '-';
    this.setTextContent('passeio-tipo-passeio', tipoPasseio);
    // Mínimo de pessoas (compatibilidade: usa min_pessoas ou max_pessoas)
    const minPessoas = passeio.min_pessoas || passeio.max_pessoas || '1';
    this.setTextContent('passeio-min-pessoas', `${minPessoas} pessoa${minPessoas !== '1' ? 's' : ''}`);

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

    // Política de Crianças
    const politicaCriancasCard = document.getElementById('passeio-politica-criancas-card');
    const politicaCriancasContent = document.getElementById('passeio-politica-criancas');
    if (politicaCriancasCard && politicaCriancasContent) {
      if (passeio.politica_criancas && passeio.politica_criancas.trim()) {
        // Se o conteúdo tiver quebras de linha, preservar formatação
        const textoFormatado = passeio.politica_criancas
          .split('\n')
          .filter(linha => linha.trim())
          .map(linha => `<p>${linha.trim()}</p>`)
          .join('');
        politicaCriancasContent.innerHTML = textoFormatado;
        politicaCriancasCard.style.display = 'block';
      } else {
        politicaCriancasCard.style.display = 'none';
      }
    }

    // Horários de Saída
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
  async renderizarGaleria(galeria) {
    const carouselContainer = document.getElementById('galeria-carousel-container');
    if (!carouselContainer || !galeria || galeria.length === 0) return;

    // Carrega o HTML do carrossel
    try {
      const sectionsPath = this.detectarCaminhoSections();
      const carouselPath = `${sectionsPath}galeria-carousel.html`;
      
      const response = await fetch(carouselPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const carouselHTML = await response.text();
      carouselContainer.innerHTML = carouselHTML;
    } catch (error) {
      console.error('❌ Erro ao carregar carrossel da galeria:', error);
      return;
    }

    // Aguarda um pouco para garantir que o DOM foi atualizado
    await new Promise(resolve => setTimeout(resolve, 50));

    // Agora busca o container de fotos dentro do carrossel carregado
    const container = document.getElementById('passeio-galeria');
    if (!container) {
      console.error('❌ Container passeio-galeria não encontrado após carregar carrossel');
      return;
    }

    // Ordena galeria pela ordem definida
    const galeriaOrdenada = [...galeria].sort((a, b) => a.ordem - b.ordem);

    container.innerHTML = galeriaOrdenada.map((foto, index) => `
      <div class="gallery-item" data-pswp-width="1200" data-pswp-height="800">
        <a href="../${foto.url}" 
           data-pswp-src="../${foto.url}"
           target="_blank"
           rel="noopener noreferrer">
          <img src="../${foto.url}" alt="${foto.alt}" loading="lazy" 
               onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect fill=\\'%23e0e0e0\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'14\\'%3EImagem não disponível%3C/text%3E%3C/svg%3E';">
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

    // Aguarda mais um pouco para garantir que as imagens foram renderizadas
    await new Promise(resolve => setTimeout(resolve, 100));

    // Inicializa PhotoSwipe
    this.inicializarPhotoSwipe(galeriaOrdenada);
    
    // Inicializa o carrossel da galeria
    this.inicializarCarrosselGaleria();
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

    // Navegação por swipe (toque)
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Distância mínima em pixels para considerar um swipe

    overlay.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchStartX - touchEndX;
      
      // Swipe para a esquerda (foto anterior)
      if (swipeDistance < -minSwipeDistance && currentIndex > 0) {
        mostrarImagem(currentIndex - 1);
      }
      
      // Swipe para a direita (próxima foto)
      if (swipeDistance > minSwipeDistance && currentIndex < galeria.length - 1) {
        mostrarImagem(currentIndex + 1);
      }
    }
  }

  // Configura botão de WhatsApp com mensagem personalizada
  configurarBotaoWhatsApp(passeio) {
    const botaoWhatsApp = document.getElementById('btn-reservar-whatsapp');
    if (!botaoWhatsApp) return;

    // Usa a constante global do WhatsApp
    if (typeof window.getWhatsAppLinkPasseio === 'function') {
      botaoWhatsApp.href = window.getWhatsAppLinkPasseio(passeio);
    } else {
      // Fallback caso config.js não tenha carregado
      const telefone = window.WHATSAPP_NUMBER || '558491274782';
      const mensagem = encodeURIComponent(
        `Olá! Vim através do VUMBORA e quero agendar um passeio:\n\n` +
        `📍 ${passeio.nome}\n` +
        `⏱️ ${passeio.duracao}`
      );
      botaoWhatsApp.href = `https://wa.me/${telefone}?text=${mensagem}`;
    }
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

  // Inicializa o carrossel da galeria de fotos
  inicializarCarrosselGaleria() {
    const galeriaContainer = document.querySelector('.passeio-galeria-container');
    if (!galeriaContainer) return;

    const carouselWrapper = galeriaContainer.querySelector('.passeio-galeria-carousel-wrapper');
    const galeriaList = document.getElementById('passeio-galeria');
    const prevBtn = galeriaContainer.querySelector('.galeria-carousel-btn-prev');
    const nextBtn = galeriaContainer.querySelector('.galeria-carousel-btn-next');
    let indicatorsContainer = galeriaContainer.querySelector('.galeria-carousel-indicators');

    if (!carouselWrapper || !galeriaList || !prevBtn || !nextBtn) return;

    const galleryItems = galeriaList.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (indicatorsContainer) indicatorsContainer.style.display = 'none';
      return;
    }

    if (!indicatorsContainer) {
      indicatorsContainer = document.createElement('div');
      indicatorsContainer.className = 'galeria-carousel-indicators';
      carouselWrapper.insertAdjacentElement('afterend', indicatorsContainer);
    }

    let currentIndex = 0;
    let itemsToShow = 4;

    function getItemsToShow() {
      const width = window.innerWidth;
      if (width >= 1024) return 4;
      if (width >= 768) return 3;
      if (width >= 480) return 2;
      return 1;
    }

    function getMaxSlides() {
      // Não atualiza itemsToShow aqui, deve ser atualizado antes de chamar
      // Calcula quantos slides completos podemos ter
      // Se temos 10 fotos e mostramos 4, podemos ter slides até a foto 6 (10 - 4 = 6)
      // Mas se passamos de 4 em 4, o último slide válido é quando ainda temos pelo menos 1 foto
      // Então: se temos 10 fotos, último slide começa na foto 6 (mostra 6-9, 4 fotos)
      // Mas se passamos de 4 em 4, o último slide válido seria índice 1 (mostra 4-7)
      // E o penúltimo seria índice 0 (mostra 0-3)
      
      // Ajuste: calcula quantos "pulos" de itemsToShow podemos fazer
      // Se temos 10 fotos e itemsToShow = 4:
      // - Podemos pular: 0, 4, 8 (3 posições)
      // - Mas a última posição (8) só tem 2 fotos, então não é válida se queremos 4
      // - Então maxSlides = Math.floor((10 - 4) / 4) = Math.floor(6/4) = 1
      
      if (galleryItems.length <= itemsToShow) {
        return 0; // Todas as fotos cabem em um slide
      }
      
      // Calcula quantos slides podemos ter passando itemsToShow por vez
      // Exemplo: 10 fotos, itemsToShow = 4
      // - Slide 0: fotos 0-3
      // - Slide 1: fotos 4-7  
      // - Slide 2: fotos 8-9 (incompleto, mas válido)
      // 
      // Fórmula: quantos "pulos" de itemsToShow podemos fazer até chegar no final
      // (galleryItems.length - itemsToShow) / itemsToShow = quantos slides adicionais além do primeiro
      // Usa Math.ceil para incluir o último slide mesmo que tenha menos fotos
      const slidesAdicionais = Math.ceil((galleryItems.length - itemsToShow) / itemsToShow);
      return Math.max(0, slidesAdicionais);
    }

    function createIndicators() {
      if (!indicatorsContainer) return;
      
      // Recalcula itemsToShow antes de calcular indicadores
      itemsToShow = getItemsToShow();
      const maxSlides = getMaxSlides();
      const total = maxSlides + 1;
      
      // Ajusta currentIndex se estiver fora do range válido
      if (currentIndex > maxSlides) {
        currentIndex = maxSlides;
      }
      
      // Limpa indicadores existentes
      indicatorsContainer.innerHTML = '';
      
      // Se não há necessidade de carrossel (todas as fotos cabem na tela)
      if (total <= 1 || galleryItems.length <= itemsToShow) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        indicatorsContainer.style.display = 'none';
        return;
      }

      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
      indicatorsContainer.style.display = 'flex';

      // Cria os indicadores baseado no número correto de slides
      for (let i = 0; i < total; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'galeria-carousel-indicator';
        indicator.setAttribute('aria-label', `Ir para slide ${i + 1} de ${total}`);
        if (i === currentIndex) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
      }
    }

    function updateIndicators() {
      if (!indicatorsContainer) return;
      const indicators = indicatorsContainer.querySelectorAll('.galeria-carousel-indicator');
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }

    function updateButtons() {
      itemsToShow = getItemsToShow();
      const maxSlides = getMaxSlides();
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxSlides;
    }

    function getGap() {
      const computedStyle = window.getComputedStyle(galeriaList);
      const gap = parseInt(computedStyle.gap || '15', 10);
      return Number.isNaN(gap) ? 15 : gap;
    }

    function moveCarousel() {
      const firstItem = galleryItems[0];
      const carousel = galeriaContainer.querySelector('.passeio-galeria-carousel');
      if (!firstItem || !carousel) return;

      const itemWidth = firstItem.offsetWidth;
      if (itemWidth === 0) {
        setTimeout(moveCarousel, 50);
        return;
      }

      // Atualiza itemsToShow antes de calcular
      itemsToShow = getItemsToShow();
      const gap = getGap();

      // Calcula o translateX baseado na quantidade de itens visíveis
      // Sempre passa exatamente itemsToShow itens por vez, independente do tamanho da tela
      // currentIndex * itemsToShow itens * (largura do item + gap)
      const translateX = -(currentIndex * itemsToShow * (itemWidth + gap));
      galeriaList.style.transform = `translateX(${translateX}px)`;

      galeriaList.style.transition = 'transform 0.5s ease';
      updateIndicators();
      updateButtons();
    }

    function goToSlide(index) {
      itemsToShow = getItemsToShow();
      const maxSlides = getMaxSlides();
      currentIndex = Math.max(0, Math.min(index, maxSlides));
      moveCarousel();
    }

    function nextSlide(e) {
      if (e) e.preventDefault();
      goToSlide(currentIndex + 1);
    }

    function prevSlide(e) {
      if (e) e.preventDefault();
      goToSlide(currentIndex - 1);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    const keyHandler = (e) => {
      const carouselWrapperFocused = carouselWrapper.contains(document.activeElement) || 
                                     carouselWrapper === document.activeElement;
      if (!carouselWrapperFocused) return;
      
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    carouselWrapper.setAttribute('role', 'region');
    carouselWrapper.setAttribute('aria-label', 'Carrossel de galeria de fotos');
    carouselWrapper.addEventListener('keydown', keyHandler);

    // Navegação por swipe (toque) no carrossel
    let carouselTouchStartX = 0;
    let carouselTouchEndX = 0;
    let isDragging = false;
    const minSwipeDistance = 50; // Distância mínima em pixels para considerar um swipe

    const carousel = galeriaContainer.querySelector('.passeio-galeria-carousel');
    
    carousel.addEventListener('touchstart', (e) => {
      carouselTouchStartX = e.changedTouches[0].screenX;
      isDragging = true;
      // Remove transição durante o arraste para melhor feedback visual
      galeriaList.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const currentX = e.changedTouches[0].screenX;
      const diff = carouselTouchStartX - currentX;
      
      // Calcula a posição atual do carrossel
      itemsToShow = getItemsToShow();
      const itemWidth = galleryItems[0]?.offsetWidth || 0;
      const gap = getGap();
      const baseTranslateX = -(currentIndex * itemsToShow * (itemWidth + gap));
      
      // Aplica o arraste em tempo real (subtrai diff para acompanhar o dedo)
      // Quando arrasta para a esquerda (diff positivo), move para a esquerda (mais negativo)
      // Quando arrasta para a direita (diff negativo), move para a direita (menos negativo)
      galeriaList.style.transform = `translateX(${baseTranslateX - diff}px)`;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      carouselTouchEndX = e.changedTouches[0].screenX;
      const swipeDistance = carouselTouchStartX - carouselTouchEndX;
      
      // Restaura a transição
      galeriaList.style.transition = 'transform 0.5s ease';
      
      // Swipe para a esquerda (slide anterior)
      if (swipeDistance < -minSwipeDistance) {
        prevSlide();
      }
      // Swipe para a direita (próximo slide)
      else if (swipeDistance > minSwipeDistance) {
        nextSlide();
      }
      // Se não foi um swipe válido, volta para a posição atual
      else {
        moveCarousel();
      }
    }, { passive: true });

    let resizeTimeout = null;
    const resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Recalcula itemsToShow
        itemsToShow = getItemsToShow();
        const maxSlides = getMaxSlides();
        
        // Ajusta currentIndex se necessário
        if (currentIndex > maxSlides) {
          currentIndex = maxSlides;
        }
        
        // Recria os indicadores com a quantidade correta
        createIndicators();
        
        // Move o carrossel para a posição correta
        moveCarousel();
      }, 150);
    };

    window.addEventListener('resize', resizeHandler);

    createIndicators();
    requestAnimationFrame(() => {
      setTimeout(() => {
        moveCarousel();
      }, 50);
    });
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

// ========== MODAL DE POLÍTICA DE CANCELAMENTO ==========
function inicializarModalPoliticaCancelamento() {
  const modal = document.getElementById('modal-politica-cancelamento');
  const btnAbrir = document.getElementById('btn-abrir-politica-cancelamento');
  const btnFechar = document.getElementById('btn-fechar-modal');
  const btnFecharX = document.getElementById('modal-politica-close');
  const overlay = modal?.querySelector('.modal-politica-overlay');

  if (!modal) {
    console.warn('⚠️ Modal de política de cancelamento não encontrado');
    return;
  }

  // Função para abrir modal
  function abrirModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Função para fechar modal
  function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  if (btnAbrir) {
    btnAbrir.addEventListener('click', abrirModal);
  }

  if (btnFechar) {
    btnFechar.addEventListener('click', fecharModal);
  }

  if (btnFecharX) {
    btnFecharX.addEventListener('click', fecharModal);
  }

  if (overlay) {
    overlay.addEventListener('click', fecharModal);
  }

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      fecharModal();
    }
  });
}

// Inicializar modal quando o conteúdo for carregado
document.addEventListener('contentLoaded', () => {
  setTimeout(() => {
    inicializarModalPoliticaCancelamento();
  }, 300);
});

// Fallback para inicialização
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    inicializarModalPoliticaCancelamento();
  }, 1000);
});