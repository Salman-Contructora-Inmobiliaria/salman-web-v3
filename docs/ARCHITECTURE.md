# Arquitectura Objetivo — SALMAN Web v2

## 1. Principios de Diseño

1. **Zero Build Step (Vanilla ES5/ES6+ compatible con navegador directo y Vercel):**
   - El sitio se sirve estáticamente sin empaquetadores (`webpack`, `vite`, `esbuild`).
   - Los módulos de cliente se organizan por dominio funcional bajo `assets/js/{core,data,i18n,ui,chat}/` y se registran sobre el espacio de nombres compartido `window.SALMAN` (manteniendo la fachada pública `window.Salma` intacta).
2. **Separación de Responsabilidades (SoC):**
   - **Datos (`assets/js/data/`):** Proyectos/servicios/FAQ (`projects.js`), rutas del Concierge (`concierge.js`) y base de conocimiento local de Salma (`kb.js`).
   - **Internacionalización (`assets/js/i18n/`):** Diccionarios puros (`es.js`, `en.js`) y fachada de traducción/sincronización DOM (`index.js`).
   - **Núcleo (`assets/js/core/`):** Configuración única y teléfono oficial (`config.js`), selectores y escape XSS (`dom.js`), telemetría `dataLayer` y bus de eventos (`events.js`), y abstracción segura de `localStorage`/`sessionStorage` (`storage.js`).
   - **Interfaz de Usuario (`assets/js/ui/`):** Header, menú móvil, galería y filtros (`navigation.js`), validación y envío de formularios/modales (`forms.js`), calculadora hipotecaria (`calculator.js`) y animaciones `IntersectionObserver` (`reveal.js`).
   - **Asesora Digital y Concierge (`assets/js/chat/`):** Motor de chat, historial y fallback (`chat.js`), reconocimiento y síntesis de voz (`voice.js`), y pestaña Concierge + VIP (`concierge.js`).
   - **Orquestador (`assets/js/main.js`):** Punto de entrada único al cargar el DOM (`DOMContentLoaded`).
3. **CSS por Capas (`assets/css/`):**
   - `tokens.css`: Variables `:root` (paleta Caribe, tipografía, espaciados, sombras, radios).
   - `base.css`: Reset, tipografía base, utilidades globales (`.container`, `.section`, `.sr-only`, `.skip-link`, `.grain`).
   - `layout.css`: Header, navegación, menú móvil, Hero, ticker, grids de secciones, footer, barra móvil y media queries estructurales.
   - `components.css`: Botones, tarjetas de proyecto, filtros, galería, pasos, calculadora, acordeón FAQ, formularios, modales (`<dialog>`) y toast.
   - `chat.css`: FAB, panel de chat, cabecera, pestañas, Concierge, acceso VIP, burbujas, tarjetas en chat, formulario en chat y modo voz (`.voice`, `.orb`).
4. **Backend Serverless Intacto (`api/` y `lib/`):**
   - `api/chat.js`, `api/whatsapp.js` y `lib/salman.js` permanecen en sus rutas canónicas para compatibilidad nativa con Vercel Serverless Functions.
