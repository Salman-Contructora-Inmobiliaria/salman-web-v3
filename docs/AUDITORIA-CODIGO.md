# Auditoría de Código — SALMAN Web v2

- **Fecha de auditoría:** 2026-10-25
- **Commit auditado (Línea Base):** `6394c59` (etiqueta `pre-refactor`, rama `refactor/orden-codigo`)
- **Alcance:** Totalidad del paquete `salman-web-v2-completo/` (37 archivos originales, 1,752,302 bytes / ~1.67 MiB). Incluye frontend estático (`index.html`, `assets/css/styles.css`, `assets/js/*.js`, `assets/img/*`), funciones serverless (`api/chat.js`, `api/whatsapp.js`, `lib/salman.js`) y configuración de despliegue (`vercel.json`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `.env.example`, `start-demo.cmd`).
- **Fase actual:** Fase 0 completada (sin modificar código fuente). Se actualizará la sección *Antes / Después* al concluir las Fases 3 y 4.

---

## 1. Resumen Ejecutivo

El sitio de **SALMAN Constructora + Inmobiliaria S.A.S.** presenta una interfaz editorial sólida, cero dependencias externas de cliente, paridad bilingüe ES/EN (239 claves por idioma), contratos serverless bien delimitados (`/api/chat` y `/api/whatsapp`), protección de claves vía `process.env` y degradación elegante (*fallback* a `KB` local cuando la API de IA no está disponible).

Sin embargo, la auditoría estática y dinámica sobre el commit base `6394c59` identificó **16 hallazgos verificados con evidencia**, entre los que destacan:
1. **Teléfono incorrecto en línea base (`HAL-01`, Alta — Consistencia de datos):** Existen **18 referencias** al número antiguo `+57 324 428 6166` (`573244286166`) repartidas en `assets/js/data.js`, `index.html`, `lib/salman.js` y `vercel.json`, incumpliendo la restricción operativa de usar únicamente `+57 315 775 7794` (`wa.me/573157757794`).
2. **Webhook `/api/whatsapp` sin validación de firma HMAC (`HAL-02`, Alta — Seguridad/API):** `POST /api/whatsapp` procesa payloads entrantes sin verificar la cabecera `X-Hub-Signature-256` de Meta.
3. **Bug funcional de accesibilidad en galería (`HAL-05`, Media — Accesibilidad/UI):** En `assets/js/app.js:137`, `setGallery(img, index)` compara `index === 0` e `index === 1`, pero los botones en `index.html:271-279` usan `data-index="1..3"`, asignando el atributo `alt` de la imagen equivocada al hacer clic en las miniaturas.
4. **Acoplamiento monolítico y variables globales (`HAL-06`, `HAL-07`, Media — Arquitectura/Mantenibilidad):** 4 archivos JS (`data.js`, `i18n.js`, `app.js`, `chat.js`, sumando 2,425 líneas) y 1 archivo CSS (`styles.css`, 818 líneas) concentran múltiples responsabilidades, exponen 8 constantes globales implícitas en el ámbito de scripts y duplican utilidades (`$`, `esc`, `t`, `tf`, `track`, `projectName`, `WA`).
5. **Duplicación de lógica DOM y listeners redundantes (`HAL-08`, `HAL-09`, Media — Mantenibilidad/Rendimiento):** `replyRaw` y `renderMessage` en `chat.js` duplican la creación del botón `.msg__cta`; `initDelegates` en `app.js` registra dos listeners globales `click` separados en `document`; y `chat.js` escucha tanto `submit` en `#chatPanel` como `keydown(Enter)` en `#chatText`.
6. **Recursos y selectores huérfanos (`HAL-12`, `HAL-13`, `HAL-14`, Baja — Rendimiento/Mantenibilidad):** La imagen `assets/img/hero-900.webp` (134.6 KB) no es referenciada por ningún archivo; existen 3 clases CSS sin uso en `styles.css`, 3 símbolos `<symbol>` SVG sin uso en `index.html` y 11 claves i18n huérfanas en `i18n.js`.

---

## 2. Metodología y Comandos Usados

1. **Inventario estático y conteo de líneas/bytes:**
   - Recorrido recursivo del árbol de archivos excluyendo `.git` mediante script de inspección en Node.js (`v24.22.1`).
   - Comandos ejecutados:
     ```powershell
     Get-ChildItem -Force | Select-Object Mode, Name, Length
     git status
     ```
2. **Análisis estático de código (JS, CSS, HTML, i18n, Assets):**
   - Cruce AST/regex de selectores CSS en `assets/css/styles.css` contra clases referenciadas en `index.html`, `assets/js/app.js` y `assets/js/chat.js`.
   - Cruce de las 239 claves de `TEXT.es` y `TEXT.en` (`assets/js/i18n.js` evaluado en `vm.runInNewContext`) contra `data-i18n`, `data-i18n-attr` e invocaciones `t()` / `tf()`.
   - Verificación de unicidad de atributos `id="..."` en `index.html` y referencias `<use href="#...">` de iconos SVG.
   - Búsqueda de apariciones del teléfono `324` (`324\s*428|573244286166`), `innerHTML` y `addEventListener`.
3. **Pruebas unitarias de contrato sobre funciones Serverless (`api/chat.js` y `api/whatsapp.js`):**
   - Invocación directa de los handlers CommonJS en Node.js simulando objetos `req`/`res` para verificar códigos HTTP `200`, `204`, `400`, `403`, `405` y `503`.
4. **Pruebas dinámicas End-to-End (E2E) con Google Chrome Headless vía CDP (Chrome DevTools Protocol):**
   - Servidor HTTP local en Node.js sirviendo los activos estáticos y los endpoints `/api/chat` y `/api/whatsapp`.
   - Ejecución de `chrome.exe --headless=new --remote-debugging-port=9229` inspeccionando `Runtime.consoleAPICalled`, `Runtime.exceptionThrown`, `Network.responseReceived`, viewports `390x844`, `768x1024` y `1440x900`, cambio de idioma ES/EN, filtros de portafolio, calculadora, formularios, chat Salma con fallback y las 5 rutas del Concierge.

---

## 3. Métricas de Línea Base (Antes del Refactor)

### 3.1 Resumen cuantitativo global

| Métrica | Valor verificado |
|---|---|
| **Total de archivos en el proyecto** | 37 archivos |
| **Tamaño total del proyecto** | 1,752,302 bytes (~1.67 MiB) |
| **Total de líneas de código/texto (18 archivos de texto)** | 4,557 líneas (según `git commit` base) |
| **Archivos JavaScript de cliente (`assets/js/*.js`)** | 4 archivos · 2,425 líneas · 121,797 bytes (~118.9 KB) |
| **Archivos JavaScript de backend (`api/*.js`, `lib/*.js`)** | 3 archivos · 344 líneas · 12,681 bytes (~12.4 KB) |
| **Hojas de estilo (`assets/css/styles.css`)** | 1 archivo · 818 líneas · 54,274 bytes (~53.0 KB) |
| **Documento HTML (`index.html`)** | 1 archivo · 833 líneas · 51,668 bytes (~50.5 KB) |
| **Imágenes (`assets/img/*`)** | 19 archivos (17 `.webp`, 1 `.jpg`, 1 `.svg`) · 1,508,046 bytes (~1.44 MiB) |
| **IDs HTML en `index.html`** | 98 IDs totales · 98 únicos · **0 duplicados** |
| **Claves i18n (`TEXT.es` / `TEXT.en`)** | 239 claves ES / 239 claves EN (100% paridad; 11 sin referenciar) |
| **Respuestas HTTP 404 en carga inicial** | **0** (25 recursos estáticos con `200 OK`) |
| **Errores de consola / Excepciones JS en carga y flujos** | **0** excepciones |

### 3.2 Archivos de código más grandes (Top 10 por líneas)

| # | Archivo | Líneas | Tamaño (Bytes) | Responsabilidad actual |
|---|---|---|---|---|
| 1 | `index.html` | 833 | 51,668 | Estructura HTML, JSON-LD, sprite SVG (20 iconos), 8 secciones, 2 modales, chat y Concierge |
| 2 | `assets/css/styles.css` | 818 | 54,274 | Tokens, reset, layout, componentes, secciones, chat, voz, Concierge, modales y media queries |
| 3 | `assets/js/chat.js` | 802 | 31,146 | Estado del chat, render de mensajes/cards/chips, cliente `/api/chat`, motor KB local, lead en chat, handoff, voz (STT/TTS) y Concierge |
| 4 | `assets/js/app.js` | 638 | 26,194 | Estado de página, render de proyectos/servicios/FAQ, filtros, galería, calculadora, modales, validación de formularios, i18n DOM, header/menú, reveal y delegación de eventos |
| 5 | `assets/js/i18n.js` | 536 | 28,861 | Diccionarios `TEXT.es`, `TEXT.en` y `LANG_META` |
| 6 | `assets/js/data.js` | 449 | 35,596 | `CONFIG`, `PROJECTS` (4), `SERVICES` (2 grupos), `CONCIERGE` (5 rutas), `FAQ` (8) y `KB` (22 entradas) |
| 7 | `lib/salman.js` | 156 | 6,559 | `SYSTEM_PROMPT`, normalización de mensajes y cliente REST Gemini (`generateReply`) |
| 8 | `api/whatsapp.js` | 133 | 4,399 | Webhook `GET`/`POST` de Meta WhatsApp Cloud API y deduplicación en memoria |
| 9 | `api/chat.js` | 55 | 1,723 | Endpoint `POST /api/chat` y rate-limit por IP en memoria |
| 10 | `LEEME-PRIMERO.md` | 43 | 1,672 | Instrucciones iniciales de entrega |

### 3.3 Peso de imágenes (`assets/img/`) y detección de huérfanos

| Archivo | Tamaño (Bytes) | Tamaño (KB) | Referenciado en | Estado |
|---|---|---|---|---|
| `og-salman.jpg` | 259,630 | 253.5 KB | `index.html:14, 22` (`og:image`, `twitter:image`) | En uso |
| `hero-1280.webp` | 228,446 | 223.1 KB | `index.html:27, 157, 158` (Hero principal + preload) | En uso |
| `hero-900.webp` | 134,626 | 131.5 KB | *Ninguna referencia estática ni dinámica* | **Huérfano (`HAL-12`)** |
| `torres-900.webp` | 92,028 | 89.9 KB | `app.js:45, 196` (`p.img = 'torres'`) | En uso |
| `playa-sq.webp` | 90,302 | 88.2 KB | `index.html:278` (miniatura 3 galería insignia) | En uso |
| `playa-900.webp` | 82,176 | 80.3 KB | `app.js:45, 135, 196` (`p.img = 'playa'`, galería) | En uso |
| `casa-club-900.webp` | 75,036 | 73.3 KB | `app.js:45, 196` (`p.img = 'casa-club'`) | En uso |
| `hero-640.webp` | 71,552 | 69.9 KB | `index.html:27, 157` (`srcset` Hero móvil) | En uso |
| `lobby-900.webp` | 69,182 | 67.6 KB | `app.js:135` (`setGallery('lobby', 2)`) | En uso |
| `marina-900.webp` | 66,788 | 65.2 KB | `index.html:264`, `app.js:45, 135, 196` | En uso |
| `hero-560.webp` | 61,800 | 60.4 KB | `app.js:224` (galería modal de `torres` y `mar-abierto`) | En uso |
| `torres-560.webp` | 50,378 | 49.2 KB | `app.js:45, 224` (`srcset` card y galería modal) | En uso |
| `lobby-sq.webp` | 44,736 | 43.7 KB | `index.html:275` (miniatura 2 galería insignia) | En uso |
| `playa-560.webp` | 42,366 | 41.4 KB | `app.js:45, 136, 224`, `chat.js:119` | En uso |
| `casa-club-560.webp` | 39,844 | 38.9 KB | `app.js:45, 224`, `chat.js:119` | En uso |
| `marina-560.webp` | 38,726 | 37.8 KB | `index.html:264`, `app.js:45, 136, 224`, `chat.js:119` | En uso |
| `lobby-560.webp` | 33,596 | 32.8 KB | `app.js:136, 224` (`srcset` galería y modal) | En uso |
| `marina-sq.webp` | 26,366 | 25.7 KB | `index.html:272` (miniatura 1 galería insignia) | En uso |
| `favicon.svg` | 466 | 0.5 KB | `index.html:29`, `site.webmanifest:12` | En uso |

---

## 4. Verificación de los 10 Puntos Solicitados en la Auditoría

1. **`data.js` tiene precios ilustrativos y `lib/salman.js` prohíbe citarlos:**
   - **Verificado con evidencia:** `assets/js/data.js:4-7` declara explícitamente que los nombres, precios (`priceFrom: 1180`, `690`, `2450`, `820`), áreas y fechas son contenido ilustrativo. Además, las entradas `KB` en `assets/js/data.js:300-325` citan estos precios en texto cuando actúa el fallback local del navegador. Por el contrario, `lib/salman.js:9-10` y `39-41` establecen como Regla Dura #1: *"NO inventes precios, áreas, fechas de entrega, disponibilidad, descuentos, rentabilidades ni condiciones de crédito. Si preguntan por un dato exacto, di que la lista vigente la confirma un asesor"*. Esto genera una divergencia de comportamiento entre respuestas con Gemini activo (no cita precios) y respuestas en modo fallback local (sí cita los precios ilustrativos de `KB`).
2. **Rate limit de `/api/chat` en memoria:**
   - **Verificado con evidencia:** `api/chat.js:11-27` implementa `const hits = new Map()` con `WINDOW_MS = 60 * 1000` y `MAX_HITS = 25`, tomando la IP de `req.headers['x-forwarded-for']`. Al ejecutarse en Vercel Serverless Functions, el estado en memoria es efímero por instancia (se pierde en *cold starts* y no se comparte entre contenedores paralelos). Además, `api/whatsapp.js:20-31` usa el mismo patrón en memoria (`const seen = new Map()`) para deduplicar `message.id`.
3. **Verificación de firma de Meta en `/api/whatsapp`:**
   - **Verificado con evidencia:** `api/whatsapp.js:82-93` verifica correctamente el `hub.verify_token` en peticiones `GET` de suscripción del webhook, pero en peticiones `POST` (`api/whatsapp.js:95-132`) **no valida la cabecera criptográfica `X-Hub-Signature-256`** con el `APP_SECRET` de Meta. Cualquier actor externo que conozca la URL `/api/whatsapp` y envíe un JSON con estructura de mensaje de WhatsApp podría disparar llamadas a Gemini y envíos de mensajes vía `sendWhatsApp`.
4. **`chat.js` monolítico:**
   - **Verificado con evidencia:** `assets/js/chat.js` tiene **802 líneas (31.1 KB)** y combina en una sola IIFE al menos 5 dominios distintos: (a) gestión de estado y persistencia en `sessionStorage`, (b) renderizado de burbujas, tarjetas y chips, (c) cliente HTTP `/api/chat` + motor de coincidencia léxica sobre `KB`, (d) captura de leads y traspaso (*handoff*) a WhatsApp, (e) reconocimiento y síntesis de voz (`SpeechRecognition` / `speechSynthesis`), y (f) pestaña y lógica del Concierge + VIP (`renderConcierge`, `setChatTab`, `openArea`, `openVIP`).
5. **Configuración y estado global:**
   - **Verificado con evidencia:**
     - `assets/js/data.js` declara 6 constantes en el ámbito global del script (`CONFIG`, `PROJECTS`, `SERVICES`, `CONCIERGE`, `FAQ`, `KB`).
     - `assets/js/i18n.js` declara 2 constantes globales (`TEXT`, `LANG_META`).
     - `assets/js/app.js:628` expone `window.SALMAN` y `window.dataLayer`.
     - `assets/js/chat.js:801` expone `window.Salma`.
     - Esto crea un acoplamiento estricto al orden de las etiquetas `<script>` en `index.html:828-831` (`data.js` → `i18n.js` → `app.js` → `chat.js`). Si `chat.js` se carga antes de `app.js` o `data.js`, `CONFIG` y `KB` lanzan `ReferenceError` inmediato al evaluarse la línea 12 y 15 de `chat.js`.
6. **Listeners duplicados / redundantes:**
   - **Verificado con evidencia:**
     - En `assets/js/app.js:492` y `assets/js/app.js:578`, la función `initDelegates()` registra **dos** `document.addEventListener('click', ...)` separados que se ejecutan en cada clic del documento, cuando pueden unificarse en un único delegador.
     - En `assets/js/chat.js:658-668`, se registra `el.panel.addEventListener('submit', ...)` y además `el.text.addEventListener('keydown', ...)` para la tecla `Enter`. Dado que `#chatText` es un `<input type="text">` dentro de `<form id="chatForm">`, pulsar `Enter` ya dispara nativamente el evento `submit` del formulario.
     - Ambos módulos (`app.js:432, 435` y `chat.js:737, 762`) registran sus propios listeners globales en `document` (`keydown` para `Escape`) y `window` (`resize`).
7. **Uso de `innerHTML`:**
   - **Verificado con evidencia:** Se contabilizaron **14 asignaciones a `.innerHTML`** (5 en `app.js` y 9 en `chat.js`).
   - En `app.js:40, 73, 96, 194` y `chat.js:96, 107, 118, 132, 206, 304, 329, 520`, los valores dinámicos pasan por `esc(str)` (que escapa `& < > " '`), mitigando XSS.
   - En `app.js:382` (`el.innerHTML = value` para nodos `[data-i18n]`), se usa `innerHTML` deliberadamente porque varios textos en `i18n.js` contienen `<br>` y `<em>` (ej. `hero.title`, `portfolio.title`). Aunque `TEXT` es una fuente estática confiable, para el resto de claves de texto plano o atributos es importante mantener `TEXT` libre de entradas de usuario.
   - En `chat.js:92-113` (`renderMessage`) y `chat.js:195-215` (`replyRaw`), además de usar `innerHTML`, **se duplica exactamente el bloque de creación del botón `.msg__cta`** (`chat.js:102-109` y `chat.js:201-208`).
8. **Falta de pruebas automatizadas:**
   - **Verificado con evidencia:** El proyecto original no incluye ningún script de prueba automatizada ni validador de contratos API/integridad de datos/i18n.
9. **`noindex` en `vercel.json`:**
   - **Verificado con evidencia:** `vercel.json:2-9` aplica `X-Robots-Tag: noindex, nofollow` a `/(.*)`. Es intencional para proteger el entorno de demostración y **se conservará intacto** por restricción expresa del proyecto. (Existe una contradicción documental menor con `robots.txt` que tiene `Allow: /` y `sitemap.xml`, lo cual es inocuo mientras `X-Robots-Tag: noindex` esté activo, pero debe tenerse presente al pasar a producción).
10. **CSS/JS sin uso y activos huérfanos:**
    - **Verificado con evidencia:**
      - **Imagen huérfana:** `assets/img/hero-900.webp` (134,626 bytes) no se usa en ningún lugar del sitio.
      - **Clases CSS sin uso en `assets/css/styles.css`:** `.msg__list` (líneas 591-592), `.msg--bot.is-typing` (líneas 595-598; el indicador real usa `.chat-typing` en líneas 625-629) y `.msg__note` (línea 603).
      - **Símbolos SVG sin uso en `index.html`:** `#i-play` (línea 87), `#i-check` (línea 88) e `#i-globe` (línea 91).
      - **Claves i18n sin uso en `assets/js/i18n.js`:** 11 claves en ambos idiomas (`ui.modal.about`, `ui.calc.note`, `chat.langNotice`, `chat.handoffMsg`, `chat.voiceHint`, `chat.errorGeneric`, `chat.escalate`, `chat.reset`, `chat.langSwitch`, `whatsapp.general`, `whatsapp.project`).
      - **Propiedad de estado sin uso en `app.js:127`:** `galleryState.images` (`['marina', 'lobby', 'playa']`) se declara pero nunca se lee.

---

## 5. Tabla Completa de Hallazgos

| ID | Severidad | Categoría | Archivo:línea | Evidencia | Impacto | Recomendación | Esfuerzo | Estado |
|---|---|---|---|---|---|---|---|---|
| **HAL-01** | **Alta** | Consistencia de datos | `assets/js/data.js:13-14, 415-416`<br>`index.html:41, 146, 503, 505, 510, 512, 617, 619, 634, 658`<br>`lib/salman.js:34, 48`<br>`vercel.json:11, 14` | 18 apariciones del teléfono `+57 324 428 6166` / `573244286166` en lugar de `+57 315 775 7794` (`wa.me/573157757794`). | Los enlaces de WhatsApp, llamadas, redirects `/wa` y `/asesor`, JSON-LD y el prompt de Salma derivan leads al número equivocado (`324`). | Centralizar `573157757794` / `+57 315 775 7794` en `core/config.js` y actualizar las 18 referencias en `index.html`, `data/kb.js`, `lib/salman.js` y `vercel.json`. | Bajo | **Abierto** (se corrige en Fase 3 tras aprobación) |
| **HAL-02** | **Alta** | Seguridad / API | `api/whatsapp.js:95-132` | `POST /api/whatsapp` parsea `req.body` y llama a `generateReply` + `sendWhatsApp` sin verificar `X-Hub-Signature-256`. | Un tercero podría falsificar eventos POST al webhook, consumiendo cuota de Gemini y enviando mensajes de WhatsApp no autorizados. | Soportar verificación opcional/condicional de firma HMAC-SHA256 (`WHATSAPP_APP_SECRET` + `x-hub-signature-256`) o documentar como requisito antes de conectar el número real en producción. | Bajo | **Abierto** |
| **HAL-03** | **Media** | API / Arquitectura | `api/chat.js:11-27`<br>`api/whatsapp.js:20-31` | `const hits = new Map()` y `const seen = new Map()` viven en la memoria del proceso Node serverless. | En Vercel, el rate-limit y la deduplicación se reinician en cada *cold start* y no se sincronizan entre instancias concurrentes. | Mantener el `Map` en memoria como protección básica sin dependencias (conforme a restricción de 0 dependencias) y documentar migración a Upstash Redis / Vercel KV para producción. | Bajo | **Documentado** (restricción: sin dependencias nuevas) |
| **HAL-04** | **Media** | Consistencia de datos | `assets/js/data.js:4-7, 300-325`<br>`lib/salman.js:39-41` | `lib/salman.js` prohíbe citar precios/disponibilidad; `KB` en `data.js` cita precios ilustrativos (`$1.180 M`, `$690 M`, etc.) cuando el chat cae en modo fallback local. | El usuario recibe precios ilustrativos si falla `/api/chat`, mientras que Gemini en vivo se niega a dar precios exactos. | Conservar ambos textos intactos por restricción del proyecto (no cambiar textos comerciales ni lógica de negocio) y dejarlo documentado en `DOCUMENTACION.md`. | N/A | **Documentado** (por restricción de negocio) |
| **HAL-05** | **Media** | Accesibilidad / UI | `assets/js/app.js:129-150`<br>`index.html:271-279` | En `index.html`, los botones `.gallery__thumb` tienen `data-index="1"`, `"2"` y `"3"`. En `setGallery(img, index)`, `app.js:137` evalúa `index === 0 ? 'Marina...' : index === 1 ? 'Lobby...' : 'Club...'`. | Al hacer clic en la miniatura 1 (*Marina*), el `alt` de `#flagshipImage` cambia erróneamente a `"Lobby y área social..."`. Además, el `alt` está fijo en español aunque el sitio esté en inglés. | Ajustar la correspondencia del índice (`index === 1`, `index === 2`) en el módulo de galería durante la refactorización de `app.js`. | Bajo | **Abierto** (se corrige en Fase 3) |
| **HAL-06** | **Media** | Arquitectura / Mantenibilidad | `assets/js/app.js` (638 l.)<br>`assets/js/chat.js` (802 l.)<br>`assets/js/data.js` (449 l.)<br>`assets/js/i18n.js` (536 l.)<br>`assets/css/styles.css` (818 l.) | Archivos monolíticos con múltiples responsabilidades mezcladas (datos, i18n, DOM, eventos, formularios, calculadora, voz, chat y Concierge). | Dificulta el mantenimiento, las pruebas aisladas y la lectura del código por parte del equipo. | Modularizar en `assets/css/{tokens,base,layout,components,chat}.css` y `assets/js/{core,data,i18n,ui,chat}/` + `main.js`. | Medio | **Abierto** (objetivo central de Fases 2 y 3) |
| **HAL-07** | **Media** | Arquitectura / Mantenibilidad | `assets/js/data.js:10, 22, 165, 200, 249, 289`<br>`assets/js/i18n.js:6, 533`<br>`index.html:828-831` | 8 constantes globales implícitas (`CONFIG`, `PROJECTS`, `SERVICES`, `CONCIERGE`, `FAQ`, `KB`, `TEXT`, `LANG_META`) y utilidades duplicadas (`$`, `esc`, `t`, `tf`, `track`, `projectName`, `WA`) entre `app.js` y `chat.js`. | Contaminación del espacio global, duplicación de funciones utilitarias y fragilidad ante cambios en el orden de `<script>`. | Centralizar utilidades y estado compartido en `core/` (`config.js`, `dom.js`, `events.js`, `storage.js`) bajo el namespace `window.SALMAN`, manteniendo compatibilidad con `window.Salma`. | Medio | **Abierto** (se corrige en Fase 3) |
| **HAL-08** | **Media** | Mantenibilidad | `assets/js/chat.js:102-109, 201-208` | `renderMessage` y `replyRaw` contienen exactamente el mismo bloque de 8 líneas para crear e insertar `<button class="msg__cta">`. | Si en algún momento `addBot` recibiera `opts.cta` y `replyRaw` también lo ejecutara, se insertarían dos botones CTA duplicados; viola el principio DRY. | Delegar la creación del botón `.msg__cta` exclusivamente a `renderMessage` pasando `opts` a través de `addBot(text, opts)`. | Bajo | **Abierto** (se corrige en Fase 3) |
| **HAL-09** | **Media** | Rendimiento / Mantenibilidad | `assets/js/app.js:492, 578`<br>`assets/js/chat.js:658-668` | `initDelegates()` registra dos `document.addEventListener('click', ...)` consecutivos; `chat.js` escucha tanto `submit` en `el.panel` como `keydown(Enter)` en `el.text`. | Ejecución redundante de handlers en cada clic del documento y doble vía de disparo para el envío del formulario de chat. | Unificar el delegador de clics en `app.js` y escuchar `submit` directamente en `el.form` (`#chatForm`) en `chat.js`. | Bajo | **Abierto** (se corrige en Fase 3) |
| **HAL-10** | **Baja** | Seguridad / DOM | `assets/js/app.js:40, 73, 96, 194, 382`<br>`assets/js/chat.js:96, 107, 118, 132, 206, 304, 329, 412, 520` | 14 usos de `innerHTML`. Aunque las variables dinámicas usan `esc()`, `app.js:382` asigna `el.innerHTML = value` a todos los `[data-i18n]`, y `chat.js:349` inyecta texto hardcoded en vez de clave i18n al pedir lista de precios (`app.js:351-353`). | Superficie de mantenimiento mayor si en el futuro `TEXT` o `PROJECTS` se alimentan desde un CMS externo sin sanitizar. | Mantener `esc()` centralizado en `core/dom.js` y documentar qué claves `data-i18n` requieren marcado HTML permitido (`<br>`, `<em>`). | Bajo | **Abierto** (se mejora en Fase 3) |
| **HAL-11** | **Baja** | Accesibilidad | `index.html:642-645`<br>`assets/js/chat.js:412, 698` | Los enlaces legales del footer (`Política de privacidad`, `Términos de uso`, `PQRS`, `Tratamiento de datos`) apuntan a `href="#"` sin abrir modal ni página; además, los `aria-label` de varios botones (`#chatMute`, `#chatClose`, `#menuBtn`) en `index.html` están fijos en español. | Usuarios de lector de pantalla en inglés escuchan etiquetas ARIA de botones de control en español, y los enlaces legales no tienen destino funcional en el prototipo. | Conservar diseño actual y documentar los enlaces legales como pendientes de contenido jurídico real del cliente. | Bajo | **Documentado** |
| **HAL-12** | **Baja** | Rendimiento | `assets/img/hero-900.webp` | Archivo de 134,626 bytes (131.5 KB) sin ninguna referencia estática ni dinámica en HTML, CSS o JS. | Incrementa innecesariamente el tamaño del repositorio en ~131.5 KB (aunque no se descarga en el navegador). | Conservar por precaución de no borrar activos gráficos sin autorización expresa (Regla 4) o eliminar solo si el cliente lo aprueba en el Plan. | Bajo | **Pendiente de decisión en Fase 1** |
| **HAL-13** | **Baja** | Mantenibilidad / Rendimiento | `assets/css/styles.css:591-598, 603`<br>`index.html:87, 88, 91` | 3 selectores CSS sin uso (`.msg__list`, `.msg--bot.is-typing`, `.msg__note`) y 3 `<symbol>` SVG sin uso (`#i-play`, `#i-check`, `#i-globe`). | Pequeño sobrepeso de ~600 bytes en CSS/HTML. | Documentado; se pueden limpiar o mantener por compatibilidad futura. | Bajo | **Documentado** |
| **HAL-14** | **Baja** | i18n / Mantenibilidad | `assets/js/i18n.js` | 11 claves definidas en `TEXT.es` y `TEXT.en` no se invocan en el código (`ui.modal.about`, `ui.calc.note`, `chat.langNotice`, `chat.handoffMsg`, `chat.voiceHint`, `chat.errorGeneric`, `chat.escalate`, `chat.reset`, `chat.langSwitch`, `whatsapp.general`, `whatsapp.project`), mientras que `app.js:323-325` y `351-353` tienen textos bilingües inline con ternarios `state.lang === 'es' ? ... : ...`. | Pequeña dispersión de textos fuera de `i18n.js`. | Mantener las claves existentes en `i18n/{es,en}.js` (no eliminar contenido) y documentarlas para uso futuro. | Bajo | **Documentado** |
| **HAL-15** | **Baja** | SEO | `vercel.json:6`<br>`robots.txt:1-5`<br>`sitemap.xml:1-9` | `vercel.json` envía `X-Robots-Tag: noindex, nofollow` (requerido para demo), mientras `robots.txt` declara `Allow: /` y enlaza a `https://salman.com.co/sitemap.xml`. | Ningún impacto negativo en la demo (la cabecera HTTP `X-Robots-Tag: noindex` prevalece), pero requiere retirar el `noindex` de `vercel.json` únicamente cuando se publique en el dominio definitivo con autorización. | Mantener `X-Robots-Tag: noindex, nofollow` intacto según las restricciones del proyecto. | N/A | **Conservado por restricción** |
| **HAL-16** | **Media** | Pruebas | Raíz del proyecto | No existía suite de verificación automatizada para contratos de API, integridad de referencias ni pruebas de humo DOM. | Riesgo de regresiones silenciosas al refactorizar y dividir archivos. | Incorporar verificación automatizada y reporte en `docs/TEST-REPORT.md`. | Bajo | **En progreso** (ejecutado en Fase 0 y se repetirá en Fase 3 y 4) |

---

## 6. Evidencia Real de Ejecución (Fase 0 — Línea Base)

### 6.1 Pruebas de contrato sobre `/api/chat` y `/api/whatsapp`
Ejecutadas en Node.js (`v24.22.1`) contra `api/chat.js` y `api/whatsapp.js`:

```text
=== API CONTRACT TESTS ===
GET /api/chat -> 405 { error: 'method_not_allowed' } { Allow: 'POST, OPTIONS' }
OPTIONS /api/chat -> 204 { Allow: 'POST, OPTIONS' }
POST /api/chat {} -> 400 { error: 'messages_required' }
[api/chat] missing_api_key
POST /api/chat (no key) -> 503 { error: 'ai_unavailable' }
GET /api/whatsapp (valid token) -> 200 12345
GET /api/whatsapp (invalid token) -> 403 forbidden
PUT /api/whatsapp -> 405 method_not_allowed
```

### 6.2 Pruebas End-to-End en Google Chrome Headless (CDP)
Ejecutadas levantando servidor local + `chrome.exe --headless=new` en los tres viewports requeridos (`390x844`, `768x1024`, `1440x900`):

```json
{
  "responsive": {
    "390x844": { "innerWidth": 390, "scrollWidth": 390, "hasHorizontalOverflow": false, "navVisible": false, "menuBtnVisible": true, "mobileBarVisible": true },
    "768x1024": { "innerWidth": 768, "scrollWidth": 753, "hasHorizontalOverflow": false, "navVisible": false, "menuBtnVisible": true, "mobileBarVisible": false },
    "1440x900": { "innerWidth": 1440, "scrollWidth": 1425, "hasHorizontalOverflow": false, "navVisible": true, "menuBtnVisible": false, "mobileBarVisible": false }
  },
  "functional": {
    "initialLang": "es-CO",
    "projectsRendered": 4,
    "servicesRendered": 2,
    "faqRendered": 8,
    "enLang": { "htmlLang": "en", "navPortfolio": "Portfolio" },
    "filterTest": { "residencialVisible": 2, "allVisible": 4 },
    "galleryTest": {
      "clickedIndex": 1,
      "imgSrc": "assets/img/marina-900.webp",
      "altAfterClick1": "Lobby y área social de Marina Cangrejo Azul"
    },
    "calculatorTest": { "valueOut": "$2.000 M", "monthly": "$16 M", "financed": "$1.600 M" },
    "bookingFormTest": {
      "emptyValidationError": "Completa este campo.",
      "submittedStatus": "Listo. Se abrió WhatsApp con tu solicitud; un asesor confirmará el horario."
    },
    "chatTest": {
      "isOpen": true,
      "messageCount": 3,
      "sessionStored": true
    },
    "conciergeTest": {
      "gridAreas": ["comercial", "diseno", "gerencia", "vip"],
      "helpButtonExists": true,
      "vipUppercased": "LC-2026",
      "backToSalmaWorks": true
    }
  },
  "exceptions": [],
  "consoleErrors": [],
  "static404s": []
}
```
> **Nota sobre pruebas no verificables automáticamente:**
> - **Captura real de micrófono (`SpeechRecognition`) y salida de audio (`speechSynthesis`):** En un entorno headless sin hardware de entrada de voz humano, la transcripción acústica real de micrófono se marca como **no verificado automáticamente** (se verificó la existencia de los handlers, el estado de la UI de voz y se incluye en el checklist manual de `DOCUMENTACION.md`).
> - **Respuesta real de Gemini (`200 OK` en `/api/chat`) y envío real a Meta Graph API (`/api/whatsapp`):** Dado que el proyecto no incluye `.env` ni claves reales por restricción de seguridad (`missing_api_key`), la llamada saliente con credenciales reales a Google AI Studio y Meta Graph API se marca como **no verificado en local sin credenciales** (se verificó el manejo de error `503` y el fallback automático del cliente).

---

## 7. Comparativa Antes / Después (Pendiente de ejecución de Fases 2 y 3)

| Aspecto | Antes (Línea Base `6394c59`) | Después (Objetivo tras Fase 3) |
|---|---|---|
| **Estructura CSS** | 1 archivo monolítico (`assets/css/styles.css`, 818 líneas) | 5 archivos por capas (`tokens.css`, `base.css`, `layout.css`, `components.css`, `chat.css`) |
| **Estructura JS cliente** | 4 archivos monolíticos (`data.js`, `i18n.js`, `app.js`, `chat.js`) | 18 módulos organizados en `core/`, `data/`, `i18n/`, `ui/`, `chat/` + `main.js` |
| **Teléfono / WhatsApp** | 18 referencias al `324 428 6166` | 100% unificado en `+57 315 775 7794` (`wa.me/573157757794`) |
| **Bug `alt` en galería (`HAL-05`)** | Desfasado (`index === 0` para `data-index="1"`) | Corregido (`index === 1`, `index === 2`, `index === 3`) |
| **Duplicación `.msg__cta` (`HAL-08`)** | Duplicado en `renderMessage` y `replyRaw` | Centralizado únicamente en `renderMessage` |
| **Listeners de documento (`HAL-09`)** | 2 `click` listeners separados en `initDelegates()` | 1 único delegador de clics limpio |

---

## 8. Riesgos Residuales

1. **Rate-limit y deduplicación en memoria (`HAL-03`):** Al no permitirse agregar dependencias externas ni bases de datos (KISS / cero dependencias), los `Map` en memoria de `api/chat.js` y `api/whatsapp.js` siguen siendo por instancia serverless.
2. **Precios ilustrativos en `data/projects.js` y `data/kb.js` (`HAL-04`):** Permanecen como datos de demostración hasta que el cliente entregue las fichas técnicas definitivas para producción.
3. **Múltiples peticiones HTTP en HTTP/1.1 local sin bundler:** Al dividir 1 CSS en 5 y 4 JS en 18 archivos sin usar un bundler (por restricción expresa de *no build step*), el navegador realiza más peticiones en local; en Vercel sobre HTTP/2 y HTTP/3 las peticiones se multiplexan en una sola conexión TCP/QUIC con impacto despreciable (~1-3 ms).
