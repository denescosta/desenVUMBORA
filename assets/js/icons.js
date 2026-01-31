// icons.js - Sistema de ícones SVG leves para substituir emojis

/**
 * Biblioteca de ícones SVG inline
 * Substitui emojis por ícones SVG leves e escaláveis
 */

const Icons = {
  // Busca/Pesquisa
  search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>`,

  // WhatsApp/Mensagem
  message: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>`,

  // Documento/Clipboard
  document: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>`,

  // Celebração/Festa
  celebration: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>`,

  // Relógio/Tempo
  clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>`,

  // Pessoas/Grupo
  users: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>`,

  // Cartão de Crédito/Pagamento
  creditCard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>`,

  // Smartphone
  smartphone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>`,

  // Email
  mail: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>`,

  // Localização/Pin
  mapPin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>`,

  // Câmera/Foto
  camera: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>`,

  // Instagram
  instagram: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>`,

  // Check/Checkmark
  check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>`,

  // X/Close
  x: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`,

  // Bebê/Criança - Chupeta
  baby: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C9 2 7 4 7 7c0 1.5.5 2.5 1 3v2.5c0 .8.7 1.5 1.5 1.5h3c.8 0 1.5-.7 1.5-1.5V10c.5-.5 1-1.5 1-3 0-3-2-5-5-5z"></path>
    <ellipse cx="12" cy="7" rx="3" ry="2.5"></ellipse>
    <path d="M12 12.5v2"></path>
    <path d="M10 15h4"></path>
    <circle cx="12" cy="16.5" r="1.5"></circle>
  </svg>`,

  // Alerta/Aviso
  alert: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>`,

  // Pergunta/Help
  help: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>`,

  // Caneta/Escrever
  edit: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>`,

  // Alvo/Objetivo
  target: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>`,

  // Van - Van de perfil (lateral) - usando path fornecido
  van: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 12H21.9282M8 17H16M8 17C8 18.1046 7.10457 19 6 19C4.89543 19 4 18.1046 4 17M8 17C8 15.8954 7.10457 15 6 15C4.89543 15 4 15.8954 4 17M16 17C16 18.1046 16.8954 19 18 19C19.1046 19 20 18.1046 20 17M16 17C16 15.8954 16.8954 15 18 15C19.1046 15 20 15.8954 20 17M14 5V12M8 5V12M4 17C2.89543 17 2 16.1046 2 15V8.2C2 7.0799 2 6.51984 2.21799 6.09202C2.40973 5.71569 2.71569 5.40973 3.09202 5.21799C3.51984 5 4.0799 5 5.2 5H16.143C16.8193 5 17.1575 5 17.4599 5.09871C17.7275 5.18605 17.9737 5.32889 18.1822 5.51789C18.418 5.7315 18.5858 6.02512 18.9213 6.61236L21.5784 11.2622C21.7354 11.5369 21.8139 11.6744 21.8694 11.8202C21.9186 11.9497 21.9543 12.084 21.9758 12.2209C22 12.3751 22 12.5333 22 12.8498V15C22 16.1046 21.1046 17 20 17"></path>
  </svg>`,

  // Ônibus - Ônibus de perfil (lateral) - usando path fornecido
  bus: `<svg width="24" height="24" viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 0C8.90625 0 6.644531 0.398438 5.09375 1.75C3.542969 3.101563 3 5.230469 3 8L3 12L2 12C0.90625 12 0 12.90625 0 14L0 22C0 23.09375 0.90625 24 2 24L3 24L3 41C3 42.222656 3.382813 43.25 4 44.03125L4 47C4 48.644531 5.355469 50 7 50L11 50C12.644531 50 14 48.644531 14 47L14 46L36 46L36 47C36 48.644531 37.355469 50 39 50L43 50C44.644531 50 46 48.644531 46 47L46 44.03125C46.617188 43.25 47 42.222656 47 41L47 24L48 24C49.09375 24 50 23.09375 50 22L50 14C50 12.90625 49.09375 12 48 12L47 12L47 9C47 6.355469 46.789063 4.191406 45.71875 2.53125C44.648438 0.871094 42.6875 0 40 0 Z M 12 2L40 2C42.3125 2 43.351563 2.542969 44.03125 3.59375C44.710938 4.644531 45 6.484375 45 9L45 41C45 42.386719 44.601563 42.933594 43.78125 43.375C42.960938 43.816406 41.585938 44 40 44L10 44C8.414063 44 7.039063 43.816406 6.21875 43.375C5.398438 42.933594 5 42.386719 5 41L5 8C5 5.484375 5.457031 4.109375 6.40625 3.28125C7.355469 2.453125 9.09375 2 12 2 Z M 15 3C13.90625 3 13 3.90625 13 5L13 7C13 8.09375 13.90625 9 15 9L36 9C37.09375 9 38 8.09375 38 7L38 5C38 3.90625 37.09375 3 36 3 Z M 15 5L36 5L36 7L15 7 Z M 11 10C9.832031 10 8.765625 10.296875 8.03125 11.03125C7.296875 11.765625 7 12.832031 7 14L7 26C7 27.167969 7.296875 28.234375 8.03125 28.96875C8.765625 29.703125 9.832031 30 11 30L39 29.9375C39.816406 29.9375 40.695313 29.625 41.5 29C42.304688 28.375 43 27.324219 43 26L43 14C43 12.832031 42.703125 11.765625 41.96875 11.03125C41.234375 10.296875 40.167969 10 39 10 Z M 11 12L39 12C39.832031 12 40.265625 12.203125 40.53125 12.46875C40.796875 12.734375 41 13.167969 41 14L41 26C41 26.675781 40.714844 27.070313 40.28125 27.40625C39.847656 27.742188 39.230469 27.9375 39 27.9375L11 28C10.167969 28 9.734375 27.796875 9.46875 27.53125C9.203125 27.265625 9 26.832031 9 26L9 14C9 13.167969 9.203125 12.734375 9.46875 12.46875C9.734375 12.203125 10.167969 12 11 12 Z M 2 14L3 14L3 22L2 22 Z M 47 14L48 14L48 22L47 22 Z M 11.5 33C9.027344 33 7 35.027344 7 37.5C7 39.972656 9.027344 42 11.5 42C13.972656 42 16 39.972656 16 37.5C16 35.027344 13.972656 33 11.5 33 Z M 38.5 33C36.027344 33 34 35.027344 34 37.5C34 39.972656 36.027344 42 38.5 42C40.972656 42 43 39.972656 43 37.5C43 35.027344 40.972656 33 38.5 33 Z M 11.5 35C12.890625 35 14 36.109375 14 37.5C14 38.890625 12.890625 40 11.5 40C10.109375 40 9 38.890625 9 37.5C9 36.109375 10.109375 35 11.5 35 Z M 38.5 35C39.890625 35 41 36.109375 41 37.5C41 38.890625 39.890625 40 38.5 40C37.109375 40 36 38.890625 36 37.5C36 36.109375 37.109375 35 38.5 35 Z M 6 45.4375C7.199219 45.890625 8.566406 46 10 46L12 46L12 47C12 47.5625 11.5625 48 11 48L7 48C6.4375 48 6 47.5625 6 47 Z M 44 45.4375L44 47C44 47.5625 43.5625 48 43 48L39 48C38.4375 48 38 47.5625 38 47L38 46L40 46C41.433594 46 42.800781 45.890625 44 45.4375Z"/>
  </svg>`,

  // Estrela
  star: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>`,

  // Mapa
  map: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>`,

  // Telefone
  phone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>`,

  // Escudo/Segurança
  shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>`,

  // Sparkle/Brilho
  sparkle: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2v4"></path>
    <path d="M12 18v4"></path>
    <path d="M4.93 4.93l2.83 2.83"></path>
    <path d="M16.24 16.24l2.83 2.83"></path>
    <path d="M2 12h4"></path>
    <path d="M18 12h4"></path>
    <path d="M4.93 19.07l2.83-2.83"></path>
    <path d="M16.24 7.76l2.83-2.83"></path>
  </svg>`,

  // Dinheiro/Moeda
  dollar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>`,

  // Avião
  plane: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>`,

  // Praia
  beach: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>`,

  // Hotel
  hotel: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
    <polyline points="6 12 18 12"></polyline>
  </svg>`,

  // Carro
  car: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
    <polygon points="12 15 17 11 7 11 12 15"></polygon>
    <line x1="7" y1="11" x2="17" y2="11"></line>
  </svg>`,

  // Mala/Bagagem - Mala de viagem (Transfer com Carretinha) - usando path fornecido
  suitcase: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2,13.5v2a1,1,0,0,0,1,1H13a3,3,0,0,0,6,0h2a1,1,0,0,0,1-1v-8a3,3,0,0,0-3-3H9a3,3,0,0,0-3,3v7H4v-1a1,1,0,0,0-2,0Zm13,3a1,1,0,1,1,1,1A1,1,0,0,1,15,16.5Zm-7-6H20v4H18.22a3,3,0,0,0-4.44,0H8Zm0-3a1,1,0,0,1,1-1H19a1,1,0,0,1,1,1v1H8Z"/>
  </svg>`,

  // Coração
  heart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>`,

  // Prédio/Edifício
  building: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 21h18"></path>
    <path d="M5 21V7l8-4v18"></path>
    <path d="M19 21V11l-6-4"></path>
    <line x1="9" y1="9" x2="9" y2="9"></line>
    <line x1="9" y1="12" x2="9" y2="12"></line>
    <line x1="9" y1="15" x2="9" y2="15"></line>
    <line x1="9" y1="18" x2="9" y2="18"></line>
  </svg>`,

  // Carro de corrida/Buggy
  raceCar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
    <polygon points="12 15 17 11 7 11 12 15"></polygon>
    <line x1="7" y1="11" x2="17" y2="11"></line>
    <circle cx="6" cy="16" r="2"></circle>
    <circle cx="18" cy="16" r="2"></circle>
  </svg>`,

  // Motocicleta/Quadriciclo
  motorcycle: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
    <path d="M12 15l-2-4h-3l2 4"></path>
    <path d="M12 15l2-4h3l-2 4"></path>
    <circle cx="6" cy="16" r="2"></circle>
    <circle cx="18" cy="16" r="2"></circle>
  </svg>`,

  // Piloto/Guia
  pilot: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    <path d="M9 11h6"></path>
  </svg>`,

  // SUV/Carro maior - Carro normal de perfil (Transfer sem Carretinha) - usando path fornecido
  suv: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 17H16M8 17C8 18.1046 7.10457 19 6 19C4.89543 19 4 18.1046 4 17M8 17C8 15.8954 7.10457 15 6 15C4.89543 15 4 15.8954 4 17M16 17C16 18.1046 16.8954 19 18 19C19.1046 19 20 18.1046 20 17M16 17C16 15.8954 16.8954 15 18 15C19.1046 15 20 15.8954 20 17M10 5V11M4 11L4.33152 9.01088C4.56901 7.58593 4.68776 6.87345 5.0433 6.3388C5.35671 5.8675 5.79705 5.49447 6.31346 5.26281C6.8993 5 7.6216 5 9.06621 5H12.4311C13.3703 5 13.8399 5 14.2662 5.12945C14.6436 5.24406 14.9946 5.43194 15.2993 5.68236C15.6435 5.96523 15.904 6.35597 16.425 7.13744L19 11M4 17H3.6C3.03995 17 2.75992 17 2.54601 16.891C2.35785 16.7951 2.20487 16.6422 2.10899 16.454C2 16.2401 2 15.9601 2 15.4V14.2C2 13.0799 2 12.5198 2.21799 12.092C2.40973 11.7157 2.71569 11.4097 3.09202 11.218C3.51984 11 4.0799 11 5.2 11H17.2C17.9432 11 18.3148 11 18.6257 11.0492C20.3373 11.3203 21.6797 12.6627 21.9508 14.3743C22 14.6852 22 15.0568 22 15.8C22 15.9858 22 16.0787 21.9877 16.1564C21.9199 16.5843 21.5843 16.9199 21.1564 16.9877C21.0787 17 20.9858 17 20.8 17H20"></path>
  </svg>`,

  // Snorkel/Máscara de mergulho
  snorkel: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="12" rx="8" ry="6"></ellipse>
    <path d="M8 12h8"></path>
    <path d="M12 8v8"></path>
    <line x1="12" y1="6" x2="12" y2="4"></line>
    <line x1="12" y1="18" x2="12" y2="20"></line>
  </svg>`,

  // Raio/Energia
  lightning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>`,

  // Família
  family: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    <path d="M13 11h6"></path>
    <circle cx="19" cy="7" r="2"></circle>
  </svg>`,

  // Estrela brilhante
  starBright: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>`,

  // Cadeado/Tranca
  lock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>`,

  // Aperto de mão
  handshake: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"></path>
    <path d="M7 18h1a2 2 0 0 0 2-2v-4.5a2.5 2.5 0 0 1 5 0V16"></path>
    <path d="M13 12h2a2 2 0 1 1 0 4h-3c-.6 0-1.1-.2-1.4-.6L3 10"></path>
    <path d="M17 6h-1a2 2 0 0 0-2 2v4.5a2.5 2.5 0 0 1-5 0V8"></path>
  </svg>`,

  // Planta/Folha
  leaf: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>`
};

/**
 * Função helper para obter um ícone SVG
 * @param {string} iconName - Nome do ícone
 * @param {object} options - Opções de customização (size, color, class)
 * @returns {string} - HTML do ícone SVG
 */
function getIcon(iconName, options = {}) {
  const {
    size = 24,
    color = 'currentColor',
    className = ''
  } = options;

  if (!Icons[iconName]) {
    console.warn(`Ícone "${iconName}" não encontrado`);
    return '';
  }

  let icon = Icons[iconName];
  
  // Aplicar tamanho
  icon = icon.replace(/width="24" height="24"/g, `width="${size}" height="${size}"`);
  
  // Aplicar cor
  if (color !== 'currentColor') {
    icon = icon.replace(/stroke="currentColor"/g, `stroke="${color}"`);
    icon = icon.replace(/fill="currentColor"/g, `fill="${color}"`);
  }
  
  // Aplicar classe
  if (className) {
    icon = icon.replace(/<svg/, `<svg class="${className}"`);
  }

  return icon;
}

/**
 * Função para substituir emojis em texto por ícones SVG
 * @param {string} text - Texto com emojis
 * @returns {string} - Texto com ícones SVG
 */
function replaceEmojisWithIcons(text) {
  const emojiMap = {
    '🔍': 'search',
    '💬': 'message',
    '📋': 'document',
    '🎉': 'celebration',
    '⏰': 'clock',
    '⏱️': 'clock',
    '👥': 'users',
    '💳': 'creditCard',
    '📱': 'smartphone',
    '📧': 'mail',
    '📍': 'mapPin',
    '📸': 'camera',
    '✅': 'check',
    '❌': 'x',
    '👶': 'baby',
    '⚠️': 'alert',
    '❓': 'help',
    '📝': 'edit',
    '🎯': 'target',
    '🚐': 'van',
    '🚌': 'bus',
    '⭐': 'star',
    '🗺️': 'map',
    '📞': 'phone',
    '🛡️': 'shield',
    '✨': 'sparkle',
    '💰': 'dollar',
    '✈️': 'plane',
    '🏖️': 'beach',
    '🏨': 'hotel',
    '🚗': 'car',
    '🧳': 'suitcase',
    '❤️': 'heart',
    '🏛️': 'building',
    '🏎️': 'raceCar',
    '🏍️': 'motorcycle',
    '👨‍✈️': 'pilot',
    '🚙': 'suv',
    '🤿': 'snorkel',
    '⚡': 'lightning',
    '👨‍👩‍👧‍👦': 'family',
    '🌟': 'starBright',
    '🔒': 'lock',
    '📷': 'instagram',
    '📸': 'camera',
    '🤝': 'handshake',
    '🌿': 'leaf'
  };

  let result = text;
  for (const [emoji, iconName] of Object.entries(emojiMap)) {
    if (result.includes(emoji)) {
      const icon = getIcon(iconName, { size: 20, className: 'inline-icon' });
      result = result.replace(new RegExp(emoji, 'g'), icon);
    }
  }
  return result;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.Icons = Icons;
  window.getIcon = getIcon;
  window.replaceEmojisWithIcons = replaceEmojisWithIcons;
}

