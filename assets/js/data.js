/* ==========================================================================
   SALMAN — capa de datos del prototipo
   --------------------------------------------------------------------------
   IMPORTANTE: los nombres de proyecto, precios, áreas y fechas de este archivo
   son CONTENIDO ILUSTRATIVO para la demo de la propuesta. Deben reemplazarse
   por las fichas técnicas reales antes de publicar. La estructura ya está
   preparada para conectarse a un CMS/CRM (ver README.md).
   ========================================================================== */

const CONFIG = {
  brand: 'SALMAN',
  legal: 'SALMAN Constructora + Inmobiliaria S.A.S.',
  whatsapp: '573244286166',            // línea operativa de SALMAN (+57 324 428 6166)
  phoneDisplay: '+57 324 428 6166',
  email: 'SalmanSAS.gerencia@gmail.com',
  city: { es: 'Cartagena, Bolívar', en: 'Cartagena, Colombia' },
  hours: { es: 'Lun a sáb · 8:00 a 18:00', en: 'Mon–Sat · 8am–6pm' },
  trm: 4070,                            // TRM de referencia solo para mostrar equivalencias
  ivaNote: { es: 'Precios en millones de COP. IVA y acabados según ficha técnica.', en: 'Prices in COP millions. VAT and finishes per technical sheet.' }
};

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

/* Rutas humanas del concierge: tres departamentos + preventa VIP.
   Conviven con Salma para no perder la atención inmediata con IA. */
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

/* --------------------------------------------------------------------------
   Base de conocimiento de Salma (prototipo).
   En producción esta base se reemplaza por RAG sobre fichas técnicas, precios,
   disponibilidad y documentos legales (ver propuesta, sección 4).
   -------------------------------------------------------------------------- */
const KB = [
  {
    id: 'greet',
    keys: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hello', 'hi', 'good morning', 'good afternoon', 'que tal', 'saludos', 'hola buenas'],
    es: 'Hola, soy Salma, la asesora digital de SALMAN. Puedo contarte de proyectos, precios, financiación y agendar una visita. ¿Qué te gustaría saber?',
    en: 'Hi, I’m Salma, SALMAN’s digital advisor. I can tell you about projects, pricing, financing and book a visit. What would you like to know?',
    chips: ['projects', 'price', 'visit', 'brochure']
  },
  {
    id: 'projects',
    keys: ['proyecto', 'proyectos', 'portafolio', 'disponible', 'disponibles', 'disponibilidad', 'que venden', 'project', 'projects', 'portfolio', 'available', 'availability', 'what do you have'],
    es: 'Tenemos cuatro proyectos activos en Cartagena:\n\n• Marina Cangrejo Azul — preventa frente al mar, desde COP $1.180 M.\n• Torres Bocagrande — en obra, entrega junio 2026, desde COP $690 M.\n• Casa Club Punta Arena — 18 casas, últimas 4 unidades, desde COP $2.450 M.\n• Residencias Mar Abierto — preventa en Crespo, desde COP $820 M.\n\n¿Quieres que te muestre las fichas o prefieres hablar con un asesor?',
    en: 'We have four active projects in Cartagena:\n\n• Marina Cangrejo Azul — beachfront pre-sale, from COP $1,180M.\n• Torres Bocagrande — under construction, June 2026 delivery, from COP $690M.\n• Casa Club Punta Arena — 18 villas, last 4 units, from COP $2,450M.\n• Residencias Mar Abierto — pre-sale in Crespo, from COP $820M.\n\nWould you like to see the project sheets or speak with an advisor?',
    chips: ['marina', 'torres', 'price', 'visit'],
    action: 'portfolio'
  },
  {
    id: 'marina',
    keys: ['marina', 'cangrejo', 'azul', 'frente al mar', 'beachfront', 'marina cangrejo'],
    es: 'Marina Cangrejo Azul es nuestro proyecto insignia: 40 residencias de 2 a 4 alcobas (118–286 m²), marina privada, club de playa y spa. Entrega diciembre 2027. Desde COP $1.180 M, con cuota inicial del 20% y 36 cuotas durante obra. Hoy quedan 12 unidades y la etapa 1 está 68% vendida.',
    en: 'Marina Cangrejo Azul is our flagship: 40 residences with 2–4 bedrooms (118–286 m²), a private marina, beach club and spa. Delivery December 2027. From COP $1,180M, with 20% down and 36 installments during construction. 12 units remain and phase 1 is 68% sold.',
    chips: ['marina_price', 'visit', 'brochure', 'payment'],
    action: 'open_project:marina'
  },
  {
    id: 'marina_price',
    keys: ['precio marina', 'cuanto vale marina', 'cuanto cuesta marina', 'cuánto cuesta marina', 'precio de marina', 'marina price', 'how much marina', 'valor marina'],
    es: 'Marina Cangrejo Azul arranca en COP $1.180 M para 2 alcobas (118 m²) y llega a COP $3.900 M en la tipología de 4 alcobas con marina. Los precios de Lista Cero se mantienen hasta el lanzamiento público. Te comparto la lista completa por WhatsApp si quieres.',
    en: 'Marina Cangrejo Azul starts at COP $1,180M for a 2-bedroom (118 m²) and reaches COP $3,900M for the 4-bedroom marina residence. Lista Cero pricing holds until the public launch. I can share the full price list on WhatsApp.',
    chips: ['brochure', 'payment', 'visit']
  },
  {
    id: 'price',
    keys: ['precio', 'precios', 'cuanto', 'cuánto', 'vale', 'cuesta', 'valor', 'price', 'prices', 'cost', 'how much', 'starting'],
    es: 'Los precios van desde COP $690 M (Torres Bocagrande, 1 alcoba) hasta COP $3.900 M (Marina, 4 alcobas con marina). Cada proyecto tiene su propia lista y condiciones de Lista Cero. ¿Te interesa una tipología o un rango de inversión en particular?',
    en: 'Prices range from COP $690M (Torres Bocagrande, 1 bedroom) to COP $3,900M (Marina, 4 bedrooms with marina). Each project has its own list and Lista Cero terms. Are you interested in a specific layout or investment range?',
    chips: ['marina', 'torres', 'payment', 'brochure']
  },
  {
    id: 'payment',
    keys: ['financiacion', 'financiación', 'financiar', 'financian', 'financiamiento', 'credito', 'crédito', 'hipoteca', 'credito hipotecario', 'cuota inicial', 'pago', 'pagos', 'formas de pago', 'plan de pagos', 'financing', 'mortgage', 'down payment', 'installments'],
    es: 'Manejamos tres caminos: crédito hipotecario con tu banco, plan de pagos directo con SALMAN durante la obra (cuota inicial desde 15% y hasta 36 cuotas) o compra de contado con descuento por pronto pago. La calculadora de la página te da una cuota estimada; el plan definitivo lo estructura un asesor.',
    en: 'There are three routes: a mortgage with your bank, a direct payment plan with SALMAN during construction (down payment from 15% and up to 36 installments), or cash with an early-payment discount. The calculator gives an estimate; an advisor structures the final plan.',
    chips: ['calculator', 'visit', 'advisor']
  },
  {
    id: 'listacero',
    keys: ['lista cero', 'listacero', 'vip', 'preventa', 'preventas', 'pre-sale', 'presale', 'early access'],
    es: 'La Lista Cero es el acceso antes del lanzamiento público: eliges unidad primero, con precio de estructuración y condiciones de pago preferentes. No tiene costo; se confirma con un asesor y un cupo por comprador. Para Marina Cangrejo Azul quedan 12 cupos.',
    en: 'Lista Cero is access before the public launch: you choose your unit first, at structuring-stage pricing and preferential payment terms. It is free; it is confirmed with an advisor, one spot per buyer. 12 spots remain for Marina Cangrejo Azul.',
    chips: ['marina', 'advisor', 'visit']
  },
  {
    id: 'visit',
    keys: ['visita', 'visitar', 'agendar', 'cita', 'reunion', 'reunión', 'sala de ventas', 'visit', 'appointment', 'schedule', 'meeting', 'tour'],
    es: 'Con gusto. Atendemos en la sala de ventas en Cartagena con cita previa, de lunes a sábado de 8:00 a 18:00, y hacemos recorridos virtuales por video-llamada. Puedo tomar tus datos y un asesor confirma el horario, o puedes elegir la fecha tú mismo en la sección de contacto.',
    en: 'Happy to help. We meet at the Cartagena sales gallery by appointment, Monday to Saturday 8am–6pm, and offer virtual walkthroughs by video call. I can take your details and an advisor will confirm the time, or you can pick a date in the contact section.',
    chips: ['booking', 'advisor', 'whatsapp'],
    action: 'scroll:#agenda'
  },
  {
    id: 'location',
    keys: ['ubicacion', 'ubicación', 'donde', 'dónde', 'direccion', 'dirección', 'location', 'where', 'address', 'zona'],
    es: 'Los proyectos están en Cartagena: Cangrejo Azul (Marina), Bocagrande (Torres), Punta Arena (Casa Club) y Crespo (Mar Abierto). La sala de ventas está en Cartagena y coordina visitas a cada obra. ¿Quieres que un asesor te envíe la ubicación exacta?',
    en: 'The projects are in Cartagena: Cangrejo Azul (Marina), Bocagrande (Torres), Punta Arena (Casa Club) and Crespo (Mar Abierto). The sales gallery is in Cartagena and coordinates visits to each site. Shall an advisor send you the exact location?',
    chips: ['visit', 'advisor', 'whatsapp']
  },
  {
    id: 'delivery',
    keys: ['entrega', 'entregas', 'cuando entregan', 'fecha de entrega', 'delivery', 'when is it ready', 'handover'],
    es: 'Torres Bocagrande: junio 2026 (en obra). Marina Cangrejo Azul y Residencias Mar Abierto: 2027. Casa Club Punta Arena: marzo 2028. Las fechas y condiciones quedan en el contrato, con reportes de avance periódicos.',
    en: 'Torres Bocagrande: June 2026 (under construction). Marina Cangrejo Azul and Residencias Mar Abierto: 2027. Casa Club Punta Arena: March 2028. Dates and terms are set in the contract, with periodic progress reports.',
    chips: ['projects', 'advisor']
  },
  {
    id: 'abroad',
    keys: ['extranjero', 'extranjeros', 'fuera del pais', 'fuera del país', 'desde estados unidos', 'desde usa', 'desde europa', 'desde el exterior', 'vivo fuera', 'vivo en', 'miami', 'nueva york', 'new york', 'panama', 'comprar desde', 'comprar desde miami', 'desde miami', 'abroad', 'foreign', 'from the us', 'international', 'remoto', 'remote'],
    es: 'Sí, acompañamos compradores internacionales de principio a fin: video-llamadas, recorridos virtuales, revisión jurídica, firma digital y apoderado si lo necesitas. El pago puede hacerse por transferencia internacional; te explicamos el proceso cambiario y tributario con nuestro equipo legal.',
    en: 'Yes, we support international buyers end to end: video calls, virtual tours, legal review, digital signature and a local proxy if needed. Payment can be made by international transfer; our legal team explains the currency and tax process.',
    chips: ['advisor', 'brochure', 'visit']
  },
  {
    id: 'english',
    keys: ['ingles', 'inglés', 'english', 'hablan ingles', 'do you speak english', 'speak english'],
    es: 'Of course. I can continue in English — just tell me what you need. Our sales team is bilingual too, and we can send documents in English.',
    en: 'Of course. I can continue in English — just tell me what you need. Our sales team is bilingual too, and we can send documents in English.',
    chips: ['projects', 'price', 'visit']
  },
  {
    id: 'amenities',
    keys: ['amenidades', 'amenities', 'piscina', 'gimnasio', 'spa', 'marina', 'playa', 'beach', 'pool', 'gym', 'parqueadero', 'parking', 'mascotas', 'pets'],
    es: 'Depende del proyecto. Marina Cangrejo Azul: marina privada, club de playa, spa, gimnasio y coworking. Torres Bocagrande: rooftop con piscina y gimnasio. Casa Club: piscina privada y casa club. Mar Abierto: piscina, gimnasio y zona de trabajo; es pet friendly. ¿Te interesa alguno en particular?',
    en: 'It depends on the project. Marina Cangrejo Azul: private marina, beach club, spa, gym and coworking. Torres Bocagrande: rooftop pool and gym. Casa Club: private pool and clubhouse. Mar Abierto: pool, gym and workspace; pet friendly. Any in particular?',
    chips: ['marina', 'torres', 'projects']
  },
  {
    id: 'services',
    keys: ['servicios', 'construyen', 'construccion', 'construcción', 'interventoria', 'interventoría', 'auditoria', 'auditoría', 'diseno', 'diseño', 'services', 'construction', 'design', 'build'],
    es: 'SALMAN hace dos cosas: construcción (gestión integral, diseño arquitectónico y urbano, interventoría, auditorías, visualización 3D y consultoría 360°) e inmobiliaria (búsqueda, evaluación técnica, jurídica y financiera, y estructuración de la compra). ¿Buscas construir, comprar o invertir?',
    en: 'SALMAN does two things: construction (end-to-end management, architectural and urban design, site supervision, audits, 3D visualisation and 360° consulting) and real estate (search, technical, legal and financial assessment, and purchase structuring). Are you looking to build, buy or invest?',
    chips: ['advisor', 'projects', 'visit']
  },
  {
    id: 'invest',
    keys: ['inversion', 'inversión', 'rentabilidad', 'renta', 'roi', 'airbnb', 'arriendo', 'invest', 'investment', 'return', 'rental', 'yield'],
    es: 'Cartagena combina segunda vivienda y renta vacacional. En Marina Cangrejo Azul manejamos proyecciones de ocupación y tarifa para cada tipología, y ofrecemos administración de rentas. La calculadora de la página estima la cuota; el estudio de rentabilidad se entrega con la ficha financiera. ¿Quieres que te lo envíe un asesor?',
    en: 'Cartagena combines second homes and holiday rentals. For Marina Cangrejo Azul we model occupancy and rates per layout, and offer rental management. The page calculator estimates the mortgage payment; the return study comes with the financial sheet. Shall an advisor send it?',
    chips: ['brochure', 'advisor', 'calculator']
  },
  {
    id: 'process',
    keys: ['proceso', 'etapas', 'como comprar', 'cómo comprar', 'quiero comprar', 'comprar', 'compra', 'pasos', 'process', 'steps', 'how to buy', 'workflow'],
    es: 'El proceso es: 1) conversación y selección de proyecto; 2) visita o recorrido virtual; 3) selección de unidad y cotización; 4) estudio de crédito o plan de pagos; 5) promesa de compraventa y cuota inicial; 6) seguimiento de obra con reportes; 7) entrega y escritura. Un asesor te acompaña en cada paso.',
    en: 'The process: 1) conversation and project shortlist; 2) visit or virtual tour; 3) unit selection and quote; 4) mortgage or payment plan review; 5) purchase agreement and down payment; 6) construction updates; 7) delivery and deed. An advisor supports every step.',
    chips: ['visit', 'advisor', 'projects']
  },
  {
    id: 'trust',
    keys: ['quienes son', 'quiénes son', 'empresa', 'experiencia', 'años', 'confiable', 'confianza', 'about', 'company', 'experience', 'trust', 'who are you'],
    es: 'SALMAN es una constructora e inmobiliaria colombiana con sede en Cartagena. Trabajamos con equipo propio de diseño, obra e interventoría, y acompañamiento jurídico en cada compra. En la propuesta de mejora recomendamos publicar años de operación, metros entregados y certificaciones verificables: hoy el sitio no los muestra.',
    en: 'SALMAN is a Colombian developer and real estate firm based in Cartagena. We work with an in-house design, construction and supervision team, plus legal support on every purchase. In the improvement proposal we recommend publishing years in operation, square metres delivered and verifiable certifications: today the site does not show them.',
    chips: ['services', 'projects', 'advisor']
  },
  {
    id: 'contact',
    keys: ['contacto', 'telefono', 'teléfono', 'correo', 'email', 'whatsapp', 'llamar', 'contact', 'phone', 'call', 'mail'],
    es: 'Puedes escribirnos por WhatsApp al +57 324 428 6166, llamar al mismo número o escribir a SalmanSAS.gerencia@gmail.com. Atendemos de lunes a sábado, 8:00 a 18:00 (GMT-5). Si prefieres, te contacto yo con un asesor ahora mismo.',
    en: 'You can message us on WhatsApp at +57 324 428 6166, call the same number or email SalmanSAS.gerencia@gmail.com. We are available Monday to Saturday, 8am–6pm (GMT-5). If you prefer, I can connect you with an advisor right now.',
    chips: ['whatsapp', 'advisor', 'booking']
  },
  {
    id: 'advisor',
    keys: ['asesor', 'humano', 'persona', 'hablar con alguien', 'agente', 'advisor', 'human', 'agent', 'speak to someone', 'real person'],
    es: 'Claro. Déjame tus datos y un asesor te escribe por WhatsApp en horario de atención. También puedo abrir WhatsApp con el resumen de nuestra conversación para que no tengas que repetir nada.',
    en: 'Of course. Leave your details and an advisor will message you on WhatsApp during business hours. I can also open WhatsApp with a summary of our conversation so you don’t have to repeat anything.',
    chips: ['lead', 'whatsapp'],
    action: 'lead'
  },
  {
    id: 'brochure',
    keys: ['brochure', 'ficha', 'ficha tecnica', 'ficha técnica', 'catalogo', 'catálogo', 'planos', 'pdf', 'technical sheet', 'floor plans', 'catalog'],
    es: 'Te comparto la ficha técnica con planos, acabados, lista de precios y disponibilidad. Déjame tu nombre y WhatsApp y la enviamos al instante. ¿Para cuál proyecto la quieres?',
    en: 'I’ll share the technical sheet with floor plans, finishes, price list and availability. Leave your name and WhatsApp and we’ll send it right away. Which project is it for?',
    chips: ['marina', 'torres', 'punta-arena', 'mar-abierto'],
    action: 'lead'
  },
  {
    id: 'thanks',
    keys: ['gracias', 'muchas gracias', 'thanks', 'thank you', 'perfecto', 'excelente'],
    es: 'Con gusto. Si quieres, te dejo en contacto con un asesor o te comparto la ficha del proyecto. También puedes escribirme cuando quieras: sigo aquí.',
    en: 'My pleasure. If you like, I can connect you with an advisor or share the project sheet. You can write to me anytime: I’m here.',
    chips: ['advisor', 'brochure', 'projects']
  },
  {
    id: 'fallback',
    keys: [],
    es: 'No tengo ese dato verificado y prefiero no improvisar con información de un inmueble. Puedo conectarte con un asesor que lo confirma, o responder sobre proyectos, precios, financiación, visitas y disponibilidad. ¿Cuál prefieres?',
    en: 'I don’t have that verified and I’d rather not improvise with property details. I can connect you with an advisor who will confirm, or answer about projects, pricing, financing, visits and availability. Which do you prefer?',
    chips: ['advisor', 'projects', 'whatsapp']
  }
];
