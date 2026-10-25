/* ==========================================================================
   SALMAN — Proyectos, servicios y preguntas frecuentes (data/projects.js)
   --------------------------------------------------------------------------
   IMPORTANTE: los nombres de proyecto, precios, áreas y fechas de este archivo
   son CONTENIDO ILUSTRATIVO para la demo de la propuesta. Deben reemplazarse
   por las fichas técnicas reales antes de publicar. La estructura ya está
   preparada para conectarse a un CMS/CRM (ver README.md).
   ========================================================================== */
'use strict';

const PROJECTS = [
  {
    id: 'marina',
    name: 'Marina Cangrejo Azul',
    type: 'inversion',
    typeLabel: { es: 'Inversión · Turístico', en: 'Investment · Resort' },
    location: { es: 'Cangrejo Azul, Cartagena', en: 'Cangrejo Azul, Cartagena' },
    status: { es: 'Preventa · Lista Cero', en: 'Pre-sale · Lista Cero' },
    statusKey: 'presale',
    img: 'marina',
    gallery: ['marina', 'lobby', 'playa'],
    beds: '2 – 4',
    area: '118 – 286 m²',
    delivery: { es: 'Diciembre 2027', en: 'December 2027' },
    priceFrom: 1180,
    available: 12,
    total: 40,
    soldPct: 68,
    hook: {
      es: 'Residencias frente al mar con marina privada y club de playa, en el sector de mayor valorización de Cartagena.',
      en: 'Beachfront residences with a private marina and beach club, in Cartagena’s fastest-appreciating district.'
    },
    desc: {
      es: 'Marina Cangrejo Azul integra 40 residencias de 2 a 4 alcobas, marina privada, club de playa, spa y coworking. Un proyecto pensado para vivir el Caribe y para generar renta vacacional desde el primer año, con administración profesional incluida.',
      en: 'Marina Cangrejo Azul brings together 40 residences with 2 to 4 bedrooms, a private marina, beach club, spa and coworking. Designed to live the Caribbean and to generate rental income from year one, with professional management included.'
    },
    amenities: {
      es: ['Marina privada', 'Club de playa', 'Spa y gimnasio', 'Coworking', 'Seguridad 24/7', 'Administración de rentas'],
      en: ['Private marina', 'Beach club', 'Spa & gym', 'Coworking', '24/7 security', 'Rental management']
    },
    payment: {
      es: 'Cuota inicial 20% · 36 cuotas durante obra · saldo contra escritura o crédito.',
      en: '20% down payment · 36 installments during construction · balance at closing or mortgage.'
    },
    featured: true
  },
  {
    id: 'torres',
    name: 'Torres Bocagrande',
    type: 'residencial',
    typeLabel: { es: 'Residencial', en: 'Residential' },
    location: { es: 'Bocagrande, Cartagena', en: 'Bocagrande, Cartagena' },
    status: { es: 'En obra', en: 'Under construction' },
    statusKey: 'building',
    img: 'torres',
    gallery: ['torres', 'hero', 'lobby'],
    beds: '1 – 3',
    area: '62 – 148 m²',
    delivery: { es: 'Junio 2026', en: 'June 2026' },
    priceFrom: 690,
    available: 9,
    total: 96,
    soldPct: 81,
    hook: {
      es: 'Vida urbana a dos calles de la playa, con rooftop y amenidades para residentes.',
      en: 'Urban living two blocks from the beach, with a rooftop and resident amenities.'
    },
    desc: {
      es: 'Dos torres de 24 pisos con apartamentos de 1 a 3 alcobas, rooftop con piscina, gimnasio y salón social. Una de las últimas oportunidades de Bocagrande con entrega en 2026.',
      en: 'Two 24-storey towers with 1 to 3-bedroom apartments, rooftop pool, gym and residents’ lounge. One of the last remaining Bocagrande opportunities delivering in 2026.'
    },
    amenities: {
      es: ['Rooftop con piscina', 'Gimnasio', 'Salón social', 'Lobby atendido', 'Parqueaderos', 'Planta eléctrica'],
      en: ['Rooftop pool', 'Gym', 'Residents’ lounge', 'Attended lobby', 'Parking', 'Backup power']
    },
    payment: {
      es: 'Cuota inicial 20% · saldo contra entrega · crédito hipotecario disponible.',
      en: '20% down payment · balance on delivery · mortgage available.'
    },
    featured: false
  },
  {
    id: 'punta-arena',
    name: 'Casa Club Punta Arena',
    type: 'turistico',
    typeLabel: { es: 'Turístico · Casas', en: 'Resort · Villas' },
    location: { es: 'Punta Arena, Cartagena', en: 'Punta Arena, Cartagena' },
    status: { es: 'Últimas unidades', en: 'Final units' },
    statusKey: 'last',
    img: 'casa-club',
    gallery: ['casa-club', 'playa', 'lobby'],
    beds: '3 – 5',
    area: '210 – 340 m²',
    delivery: { es: 'Marzo 2028', en: 'March 2028' },
    priceFrom: 2450,
    available: 4,
    total: 18,
    soldPct: 78,
    hook: {
      es: 'Solo 18 casas de arquitectura tropical a metros de la arena, con casa club privada.',
      en: 'Only 18 tropical-architecture villas steps from the sand, with a private clubhouse.'
    },
    desc: {
      es: 'Un enclave de 18 casas con piscina privada, jardín y acceso directo a la playa. Casa club con restaurante, spa y recepción para huéspedes. Ideal para segunda vivienda o renta premium.',
      en: 'An enclave of 18 villas with private pools, gardens and direct beach access. Clubhouse with restaurant, spa and guest reception. Ideal as a second home or premium rental.'
    },
    amenities: {
      es: ['Piscina privada', 'Acceso a playa', 'Casa club', 'Concierge', 'Jardín privado', 'Renta premium'],
      en: ['Private pool', 'Beach access', 'Clubhouse', 'Concierge', 'Private garden', 'Premium rental']
    },
    payment: {
      es: 'Cuota inicial 30% · 24 cuotas · saldo contra escritura.',
      en: '30% down payment · 24 installments · balance at closing.'
    },
    featured: false
  },
  {
    id: 'mar-abierto',
    name: 'Residencias Mar Abierto',
    type: 'residencial',
    typeLabel: { es: 'Residencial', en: 'Residential' },
    location: { es: 'Crespo, Cartagena', en: 'Crespo, Cartagena' },
    status: { es: 'Preventa', en: 'Pre-sale' },
    statusKey: 'presale',
    img: 'playa',
    gallery: ['playa', 'lobby', 'hero'],
    beds: '2 – 3',
    area: '95 – 160 m²',
    delivery: { es: 'Noviembre 2027', en: 'November 2027' },
    priceFrom: 820,
    available: 22,
    total: 64,
    soldPct: 66,
    hook: {
      es: 'Apartamentos luminosos a cinco minutos del aeropuerto, pensados para vivir todo el año.',
      en: 'Bright apartments five minutes from the airport, designed for year-round living.'
    },
    desc: {
      es: 'Torre única de 64 apartamentos con terrazas amplias, piscina, gimnasio y zona de trabajo. Una opción equilibrada entre ubicación, precio y calidad de vida.',
      en: 'A single tower of 64 apartments with generous terraces, pool, gym and co-working area. A balanced choice between location, price and quality of life.'
    },
    amenities: {
      es: ['Piscina', 'Gimnasio', 'Terraza', 'Zona de trabajo', 'Parqueaderos', 'Pet friendly'],
      en: ['Pool', 'Gym', 'Terrace', 'Workspace', 'Parking', 'Pet friendly']
    },
    payment: {
      es: 'Cuota inicial 15% · 30 cuotas · saldo contra entrega.',
      en: '15% down payment · 30 installments · balance on delivery.'
    },
    featured: false
  }
];

const SERVICES = [
  {
    group: { es: 'Constructora', en: 'Construction' },
    intro: {
      es: 'Estructuramos, diseñamos y ejecutamos el proyecto con un solo equipo responsable del presupuesto, el cronograma y la calidad.',
      en: 'We structure, design and build with a single team accountable for budget, schedule and quality.'
    },
    items: [
      { t: { es: 'Gestión integral de proyectos', en: 'End-to-end project management' }, d: { es: 'Planeación, presupuesto, cronograma y coordinación de especialistas bajo un solo responsable.', en: 'Planning, budget, schedule and coordination of specialists under one accountable lead.' } },
      { t: { es: 'Diseño arquitectónico', en: 'Architectural design' }, d: { es: 'Arquitectura contemporánea y funcional, coherente con el lugar y con el presupuesto del cliente.', en: 'Contemporary, functional architecture aligned with the site and the client’s budget.' } },
      { t: { es: 'Diseño urbano', en: 'Urban design' }, d: { es: 'Integramos arquitectura, espacio público y contexto normativo desde la etapa de prefactibilidad.', en: 'We integrate architecture, public space and zoning from the feasibility stage.' } },
      { t: { es: 'Interventoría y auditorías', en: 'Site supervision & audits' }, d: { es: 'Control técnico y administrativo, revisión de costos y detección temprana de desviaciones.', en: 'Technical and administrative control, cost review and early detection of deviations.' } },
      { t: { es: 'Visualización 3D', en: '3D visualisation' }, d: { es: 'Renders, recorridos y planos de venta que permiten decidir con información, no con imaginación.', en: 'Renders, walkthroughs and sales plans that support decisions with facts, not imagination.' } },
      { t: { es: 'Consultoría 360°', en: '360° consulting' }, d: { es: 'Viabilidad, licencias, estructuración financiera y comercialización en una sola conversación.', en: 'Feasibility, permits, financial structuring and sales in a single conversation.' } }
    ]
  },
  {
    group: { es: 'Inmobiliaria', en: 'Real estate' },
    intro: {
      es: 'Acompañamos la compra, la inversión y la venta con análisis técnico, jurídico y financiero del inmueble.',
      en: 'We support purchases, investments and sales with technical, legal and financial analysis of the property.'
    },
    items: [
      { t: { es: 'Búsqueda y acompañamiento', en: 'Search & advisory' }, d: { es: 'Filtramos opciones según presupuesto, uso y expectativa de valorización. Sin listados infinitos.', en: 'We shortlist options by budget, use and appreciation expectations. No endless listings.' } },
      { t: { es: 'Evaluación y diagnóstico', en: 'Property assessment' }, d: { es: 'Condiciones físicas, técnicas y de entorno de propiedades urbanas y rurales.', en: 'Physical, technical and contextual conditions of urban and rural properties.' } },
      { t: { es: 'Análisis normativo', en: 'Zoning analysis' }, d: { es: 'Qué se puede construir, qué no y con qué riesgo, antes de firmar.', en: 'What can be built, what cannot, and at what risk — before signing.' } },
      { t: { es: 'Evaluación jurídica', en: 'Legal review' }, d: { es: 'Títulos, linderos, afectaciones y antecedentes del inmueble.', en: 'Title, boundaries, encumbrances and property records.' } },
      { t: { es: 'Evaluación financiera', en: 'Financial analysis' }, d: { es: 'Flujo de caja, rentabilidad esperada y sensibilidad a ocupación y precio.', en: 'Cash flow, expected return and sensitivity to occupancy and price.' } },
      { t: { es: 'Estructuración de la compra', en: 'Purchase structuring' }, d: { es: 'Negociación, promesa, cuota inicial y coordinación con el banco o el fondo.', en: 'Negotiation, purchase agreement, down payment and coordination with bank or fund.' } }
    ]
  }
];

const FAQ = [
  {
    q: { es: '¿Qué es la Lista Cero?', en: 'What is the Lista Cero?' },
    a: { es: 'Es el acceso anticipado a un proyecto antes de su lanzamiento público: precios de estructuración, selección de unidad y condiciones de pago preferentes. Los cupos son limitados y se confirman con un asesor.', en: 'It is early access to a project before its public launch: structuring-stage pricing, unit selection and preferential payment terms. Spots are limited and confirmed with an advisor.' }
  },
  {
    q: { es: '¿Dónde están ubicados los proyectos?', en: 'Where are the projects located?' },
    a: { es: 'Todos están en Cartagena: Cangrejo Azul, Bocagrande, Punta Arena y Crespo. La sala de ventas atiende con cita previa y también hacemos visitas virtuales.', en: 'All are in Cartagena: Cangrejo Azul, Bocagrande, Punta Arena and Crespo. The sales gallery receives visitors by appointment, and we also offer virtual tours.' }
  },
  {
    q: { es: '¿Puedo comprar desde el exterior?', en: 'Can I buy from abroad?' },
    a: { es: 'Sí. Acompañamos el proceso completo de forma remota: video-llamadas, firma digital y coordinación con apoderado si se requiere. El pago se hace en pesos colombianos o por transferencia internacional.', en: 'Yes. We support the entire process remotely: video calls, digital signature and a local proxy if needed. Payment is in Colombian pesos or by international transfer.' }
  },
  {
    q: { es: '¿Cómo funciona la financiación?', en: 'How does financing work?' },
    a: { es: 'Puedes comprar con recursos propios, con crédito hipotecario o con un plan de pagos directo con SALMAN durante la obra. La calculadora de esta página es una referencia y no constituye una oferta crediticia.', en: 'You can buy with your own funds, a mortgage, or a direct payment plan with SALMAN during construction. The calculator on this page is a reference only and is not a credit offer.' }
  },
  {
    q: { es: '¿Qué incluye el precio?', en: 'What does the price include?' },
    a: { es: 'El precio base incluye la unidad, acabados de la ficha técnica y zonas comunes. Parqueadero, depósito y acabados opcionales se cotizan aparte. El detalle exacto queda en la promesa de compraventa.', en: 'The base price includes the unit, the finishes in the technical sheet and common areas. Parking, storage and optional finishes are quoted separately. Exact details are set in the purchase agreement.' }
  },
  {
    q: { es: '¿Cuándo entregan los proyectos?', en: 'When are the projects delivered?' },
    a: { es: 'Torres Bocagrande en junio de 2026, Marina Cangrejo Azul en diciembre de 2027, Residencias Mar Abierto en noviembre de 2027 y Casa Club Punta Arena en marzo de 2028. Cada contrato fija la fecha y las condiciones de entrega.', en: 'Torres Bocagrande in June 2026, Marina Cangrejo Azul in December 2027, Residencias Mar Abierto in November 2027 and Casa Club Punta Arena in March 2028. Each contract sets the delivery date and terms.' }
  },
  {
    q: { es: '¿Atienden en inglés?', en: 'Do you serve English speakers?' },
    a: { es: 'Sí. Nuestro equipo comercial y la asesora digital atienden en español e inglés, por chat, voz y WhatsApp.', en: 'Yes. Our sales team and the digital advisor serve clients in Spanish and English, by chat, voice and WhatsApp.' }
  },
  {
    q: { es: '¿Cómo protegen mis datos?', en: 'How is my data protected?' },
    a: { es: 'Tratamos tus datos con tu autorización previa, solo para atender tu solicitud, conforme a la Ley 1581 de 2012 y la política de tratamiento de SALMAN. Puedes solicitar acceso, corrección o eliminación escribiendo a nuestro correo de contacto.', en: 'We process your data with your prior consent, only to handle your request, in accordance with Colombian Law 1581 of 2012 and SALMAN’s data policy. You may request access, correction or deletion by writing to our contact email.' }
  }
];

window.SALMAN = window.SALMAN || {};
window.SALMAN.PROJECTS = PROJECTS;
window.SALMAN.SERVICES = SERVICES;
window.SALMAN.FAQ = FAQ;
window.SALMAN.projectById = (id) => PROJECTS.find((p) => p.id === id) || PROJECTS[0];
window.SALMAN.projectName = (id) => {
  const p = PROJECTS.find((item) => item.id === id) || PROJECTS[0];
  return p ? p.name : '';
};
