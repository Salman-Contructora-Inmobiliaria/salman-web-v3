# Línea Base (Baseline) — Fase 0

- **Fecha:** 2026-10-25
- **Commit base:** `6394c59` (`chore: baseline pre-refactor (37 archivos originales)`)
- **Tag Git:** `pre-refactor`
- **Rama activa:** `refactor/orden-codigo`

---

## 1. Inventario Completo de Archivos Originales (37 archivos — 1,752,302 bytes)

| # | Ruta relativa | Tamaño (Bytes) | Líneas | Propósito | Dependencias |
|---|---|---|---|---|---|
| 1 | `.env.example` | 233 | 8 | Plantilla de variables de entorno para Gemini y WhatsApp | Ninguna |
| 2 | `.gitignore` | 74 | 8 | Reglas de exclusión de Git (`.env*`, `node_modules/`, `.vercel`) | Ninguna |
| 3 | `.vercelignore` | 126 | 7 | Exclusiones para el despliegue en Vercel (`*.md`, `start-demo.cmd`, `.env*`) | Ninguna |
| 4 | `LEEME-PRIMERO.md` | 1,672 | 43 | Guía rápida original de entrega | Ninguna |
| 5 | `api/chat.js` | 1,723 | 55 | Serverless Function `POST /api/chat` con rate-limit por IP | `../lib/salman` (`generateReply`) |
| 6 | `api/whatsapp.js` | 4,399 | 133 | Serverless Function `GET/POST /api/whatsapp` (webhook Meta Cloud API) | `../lib/salman` (`generateReply`), `process.env.WHATSAPP_*` |
| 7 | `assets/css/styles.css` | 54,274 | 818 | Sistema visual completo (tokens, reset, layout, componentes, chat, voz, responsive) | Google Fonts (`Cormorant Garamond`, `Jost`) |
| 8 | `assets/img/casa-club-560.webp` | 39,844 | — | Imagen 560w de *Casa Club Punta Arena* | Usada por `app.js` y `chat.js` |
| 9 | `assets/img/casa-club-900.webp` | 75,036 | — | Imagen 900w de *Casa Club Punta Arena* | Usada por `app.js` |
| 10 | `assets/img/favicon.svg` | 466 | 7 | Icono vectorial de marca SALMAN | Referenciado en `index.html` y `site.webmanifest` |
| 11 | `assets/img/hero-1280.webp` | 228,446 | — | Imagen principal del Hero en escritorio (1280w) | Referenciada en `index.html` |
| 12 | `assets/img/hero-560.webp` | 61,800 | — | Miniatura 560w del Hero para galerías de modales | Usada por `app.js` (`openProject`) |
| 13 | `assets/img/hero-640.webp` | 71,552 | — | Imagen del Hero para pantallas móviles (640w) | Referenciada en `index.html` |
| 14 | `assets/img/hero-900.webp` | 134,626 | — | Imagen 900w del Hero (**activo huérfano sin referencias**) | Ninguna |
| 15 | `assets/img/lobby-560.webp` | 33,596 | — | Imagen 560w de lobby para galería insignia y modales | Usada por `app.js` |
| 16 | `assets/img/lobby-900.webp` | 69,182 | — | Imagen 900w de lobby para galería insignia | Usada por `app.js` (`setGallery`) |
| 17 | `assets/img/lobby-sq.webp` | 44,736 | — | Miniatura cuadrada de lobby en galería insignia | Referenciada en `index.html:275` |
| 18 | `assets/img/marina-560.webp` | 38,726 | — | Imagen 560w de *Marina Cangrejo Azul* | Referenciada en `index.html`, `app.js`, `chat.js` |
| 19 | `assets/img/marina-900.webp` | 66,788 | — | Imagen 900w de *Marina Cangrejo Azul* | Referenciada en `index.html`, `app.js` |
| 20 | `assets/img/marina-sq.webp` | 26,366 | — | Miniatura cuadrada de *Marina Cangrejo Azul* | Referenciada en `index.html:272` |
| 21 | `assets/img/og-salman.jpg` | 259,630 | — | Imagen Open Graph / Twitter Card (1200×630) | Referenciada en `index.html:14, 22` |
| 22 | `assets/img/playa-560.webp` | 42,366 | — | Imagen 560w de *Residencias Mar Abierto* / Club de playa | Usada por `app.js` y `chat.js` |
| 23 | `assets/img/playa-900.webp` | 82,176 | — | Imagen 900w de *Residencias Mar Abierto* / Club de playa | Usada por `app.js` |
| 24 | `assets/img/playa-sq.webp` | 90,302 | — | Miniatura cuadrada de Club de playa en galería insignia | Referenciada en `index.html:278` |
| 25 | `assets/img/torres-560.webp` | 50,378 | — | Imagen 560w de *Torres Bocagrande* | Usada por `app.js` y `chat.js` |
| 26 | `assets/img/torres-900.webp` | 92,028 | — | Imagen 900w de *Torres Bocagrande* | Usada por `app.js` |
| 27 | `assets/js/app.js` | 26,194 | 638 | Lógica UI, renderizado, filtros, galería, calculadora, formularios, modales e i18n | Depende de `CONFIG`, `PROJECTS`, `SERVICES`, `FAQ` (`data.js`), `TEXT`, `LANG_META` (`i18n.js`) y opcionalmente `window.Salma` (`chat.js`) |
| 28 | `assets/js/chat.js` | 31,146 | 802 | Chat Salma, voz (Web Speech API), cliente `/api/chat`, motor `KB`, Concierge y VIP | Depende de `CONFIG`, `PROJECTS`, `CONCIERGE`, `KB` (`data.js`), `LANG_META` (`i18n.js`) y `window.SALMAN` (`app.js`) |
| 29 | `assets/js/data.js` | 35,596 | 449 | Capa de datos: `CONFIG`, `PROJECTS`, `SERVICES`, `CONCIERGE`, `FAQ`, `KB` | Ninguna (debe cargarse primero) |
| 30 | `assets/js/i18n.js` | 28,861 | 536 | Diccionarios `TEXT.es`, `TEXT.en` y `LANG_META` | Ninguna (debe cargarse antes de `app.js` y `chat.js`) |
| 31 | `index.html` | 51,668 | 833 | Documento principal HTML5, metadatos SEO/OG, JSON-LD, sprite SVG y marcado | `assets/css/styles.css`, `data.js`, `i18n.js`, `app.js`, `chat.js` |
| 32 | `lib/salman.js` | 6,559 | 156 | Prompt de sistema de Salma, reglas duras, normalización y cliente Gemini REST | `process.env.GEMINI_API_KEY`, `process.env.GEMINI_MODEL` |
| 33 | `robots.txt` | 124 | 5 | Directiva para crawlers y ruta de `sitemap.xml` | Ninguna |
| 34 | `site.webmanifest` | 458 | 14 | Manifiesto web con colores de marca e icono `favicon.svg` | `assets/img/favicon.svg` |
| 35 | `sitemap.xml` | 264 | 9 | Sitemap XML básico | Ninguna |
| 36 | `start-demo.cmd` | 423 | 19 | Script batch para levantar `python -m http.server 8080` | Python 3 en PATH |
| 37 | `vercel.json` | 464 | 18 | Cabecera `X-Robots-Tag: noindex, nofollow` y redirects `/wa` y `/asesor` | Ninguna |

---

## 2. Orden de Carga y Dependencias entre Scripts en `index.html`

En `index.html:828-831`, los scripts se cargan de forma síncrona al final de `<body>`:

```html
<script src="assets/js/data.js"></script>
<script src="assets/js/i18n.js"></script>
<script src="assets/js/app.js"></script>
<script src="assets/js/chat.js"></script>
```

### Mapa de dependencias de ejecución inmediata (Top-Level) vs diferida (`init`)

1. **`assets/js/data.js`:**
   - Define en el ámbito global: `CONFIG`, `PROJECTS`, `SERVICES`, `CONCIERGE`, `FAQ`, `KB`.
   - No depende de ningún otro script.
2. **`assets/js/i18n.js`:**
   - Define en el ámbito global: `TEXT`, `LANG_META`.
   - No depende de ningún otro script.
3. **`assets/js/app.js`:**
   - **En tiempo de definición de la IIFE (línea 11):** Lee `CONFIG.whatsapp` inmediatamente al evaluar `const WA = ...`. Si `data.js` no se cargó antes, falla con `ReferenceError: CONFIG is not defined`.
   - **En `init()` (línea 596):** Lee `TEXT`, `LANG_META`, `PROJECTS`, `SERVICES`, `FAQ` y registra `window.SALMAN` (línea 628).
4. **`assets/js/chat.js`:**
   - **En tiempo de definición de la IIFE (líneas 12 y 15):** Lee `CONFIG.whatsapp` y `KB.map(...)` inmediatamente. Si `data.js` no se cargó antes, falla con `ReferenceError`.
   - **En `init()` (línea 768):** Lee `window.SALMAN?.lang`, `window.SALMAN?.t`, `window.SALMAN?.tf`, `window.SALMAN?.track`, `window.SALMAN?.money`, `PROJECTS`, `CONCIERGE`, `LANG_META` y expone `window.Salma` (línea 801).

---

## 3. Registro de Ejecución de Línea Base

- **Servidor local:** Levantado en `http://127.0.0.1:51188` con soporte de rutas estáticas y funciones `/api/chat` y `/api/whatsapp`.
- **Consola del navegador:** `0` errores, `0` warnings, `0` excepciones no capturadas.
- **Red (Recursos estáticos):** `25` peticiones estáticas devuelven `200 OK` (`0` errores 404).
- **Red (`/api/chat` sin clave en local):** Devuelve `503 {"error":"ai_unavailable"}` esperado; `chat.js` captura el estado, registra `chat_api_fallback` en `window.dataLayer` y responde con la base local `KB`.
- **Responsive (`390x844`, `768x1024`, `1440x900`):** Sin desbordamiento horizontal (`scrollWidth <= innerWidth`) en las 3 resoluciones. En `390x844` se activa `.mobile-bar` y `#menuBtn`; en `768x1024` se oculta `.nav` y se muestra `#menuBtn`; en `1440x900` se muestran `.nav` y `.hero-card`.
- **Concierge y 5 rutas:** Verificadas las 4 tarjetas de `#conciergeGrid` (`comercial`, `diseno`, `gerencia`, `vip`), el botón `#conciergeHelp` (`orientacion`), la conversión a mayúsculas de `#vipCode` (`lc-2026` → `LC-2026`) sin validación en navegador, y el botón `.concierge__back` ("Volver a Salma").
