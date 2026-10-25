/* ==========================================================================
   SALMAN — Rutas humanas del Concierge (data/concierge.js)
   Tres departamentos + preventa VIP + orientación general.
   Conviven con Salma para no perder la atención inmediata con IA.
   ========================================================================== */
'use strict';

const CONCIERGE = [
  {
    id: 'comercial',
    label: { es: 'Quiero comprar o visitar', en: 'I want to buy or visit' },
    desc: { es: 'Disponibilidad, precios y citas.', en: 'Availability, pricing and visits.' },
    msg: {
      es: 'Hola SALMAN, vengo de la web. Solicito atención del *1. ÁREA COMERCIAL Y VENTAS* para conocer disponibilidad, precios y agendar una visita.',
      en: 'Hi SALMAN, I am coming from the website. I would like the *1. SALES TEAM* for availability, pricing and booking a visit.'
    }
  },
  {
    id: 'diseno',
    label: { es: 'Planos y diseño', en: 'Plans & design' },
    desc: { es: 'Planos, especificaciones y acabados.', en: 'Plans, specifications and finishes.' },
    msg: {
      es: 'Hola SALMAN, vengo de la web. Solicito atención del *2. DISEÑO Y ARQUITECTURA* para revisar planos, especificaciones técnicas y acabados.',
      en: 'Hi SALMAN, I am coming from the website. I would like *2. DESIGN & ARCHITECTURE* to review plans, technical specifications and finishes.'
    }
  },
  {
    id: 'gerencia',
    label: { es: 'Invertir o aliarme', en: 'Invest or partner' },
    desc: { es: 'Inversión, alianzas y lotes.', en: 'Investment, partnerships and land.' },
    msg: {
      es: 'Hola SALMAN, vengo de la web. Solicito atención de *3. GERENCIA / B2B* para temas de inversión patrimonial, alianzas o licitaciones.',
      en: 'Hi SALMAN, I am coming from the website. I would like *3. MANAGEMENT / B2B* for investment, partnerships or tenders.'
    }
  },
  {
    id: 'vip',
    label: { es: 'Lista Cero VIP', en: 'Lista Cero VIP' },
    desc: { es: 'Preventa privada frente al mar.', en: 'Private beachfront pre-sale.' },
    msg: {
      es: 'Hola SALMAN. Deseo ingresar al *PROYECTO VIP CARTAGENA (Lista Cero)*. Mi código o solicitud de validación es: *{code}*.',
      en: 'Hi SALMAN. I would like to join the *CARTAGENA VIP PROJECT (Lista Cero)*. My code or validation request is: *{code}*.'
    }
  },
  {
    id: 'orientacion',
    help: true,
    label: { es: 'No sé, oriéntenme', en: 'Not sure, guide me' },
    desc: { es: 'Los conectamos con el área correcta.', en: 'We’ll connect you with the right team.' },
    msg: {
      es: 'Hola SALMAN, vengo de la web. No sé con qué área hablar; necesito orientación sobre proyectos, diseño o inversión. ¿Me pueden dirigir con la persona correcta?',
      en: 'Hi SALMAN, I am coming from the website. I am not sure which team to talk to; I need guidance on projects, design or investment. Could you connect me with the right person?'
    }
  }
];

window.SALMAN = window.SALMAN || {};
window.SALMAN.CONCIERGE = CONCIERGE;
