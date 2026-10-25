# Contexto del Proyecto — SALMAN Web v2

- **Cliente:** SALMAN Constructora + Inmobiliaria S.A.S. (Cartagena de Indias, Colombia)
- **Propósito comercial:** Sitio web bilingüe (ES/EN) de presentación corporativa y captación comercial para proyectos residenciales, turísticos, servicios de construcción/diseño, estructuración de inversión y acceso a preventa privada *Lista Cero (VIP)*.
- **Restricciones innegociables:**
  1. El cliente ya aprobó visualmente esta versión: **prohibido rediseñar** o alterar textos comerciales, fichas o precios ilustrativos.
  2. Teléfono oficial: **`+57 315 775 7794`** (`https://wa.me/573157757794`). Prohibido usar el número antiguo `324`.
  3. Cabecera `X-Robots-Tag: noindex, nofollow` en `vercel.json`: **no retirar** sin autorización.
  4. Modelo de IA: **`gemini-2.5-flash`** en `lib/salman.js` y `.env.example`.
  5. Sin secretos ni `.env` en el repositorio.
  6. El código VIP de *Lista Cero* **nunca se valida en el navegador ni por la IA**: siempre lo valida un humano por WhatsApp.
  7. Conservar las **5 rutas del Concierge** (`comercial`, `diseno`, `gerencia`, `vip`, `orientacion`), el historial del chat, la voz (Web Speech API), i18n ES/EN, el fallback local (`KB`) y la captura de leads.
  8. No migrar a frameworks (React/Vue/Next), no agregar bundlers ni `node_modules`, no mover `/api` ni `/lib` y no renombrar `index.html`.
