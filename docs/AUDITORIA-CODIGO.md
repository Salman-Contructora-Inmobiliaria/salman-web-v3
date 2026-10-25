# Auditoría de Código — SALMAN Web v2

- **Fecha de auditoría:** 2026-10-25
- **Commit auditado (Línea Base):** `6394c59` (etiqueta `pre-refactor`)
- **Rama auditada y refactorizada:** `refactor/orden-codigo`
- **Alcance:** Totalidad del paquete `salman-web-v2-completo/`. Incluye frontend estático (`index.html`, `assets/css/*.css`, `assets/js/**/*.js`, `assets/img/*`), funciones serverless (`api/chat.js`, `api/whatsapp.js`, `lib/salman.js`) y configuración de despliegue (`vercel.json`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `.env.example`, `start-demo.cmd`).
- **Estado actual:** Fases 0, 1, 2, 3 y 4 completadas y verificadas con evidencia real.

---

## 1. Resumen Ejecutivo

El sitio de **SALMAN Constructora + Inmobiliaria S.A.S.** partió de una interfaz editorial bien lograda, cero dependencias externas de cliente, paridad bilingüe ES/EN (239 claves por idioma), contratos serverless bien delimitados (`/api/chat` y `/api/whatsapp`), protección de claves vía `process.env` y degradación elegante (*fallback* a `KB` local cuando la API de IA no está disponible).

La auditoría estática y dinámica sobre el commit base `6394c59` identificó **16 hallazgos verificados con evidencia**, de los cuales **9 fueron corregidos directamente en el refactor** y **7 quedaron documentados / preservados por restricción expresa de negocio**:
1. **[CORREGIDO] Teléfono incorrecto en línea base (`HAL-01`, Alta — Consistencia de datos):** Existían **18 referencias** al número antiguo `+57 324 428 6166` (`573244286166`) repartidas en la capa de datos, `index.html`, `lib/salman.js` y `vercel.json`. Todas fueron actualizadas a `+57 315 775 7794` (`wa.me/573157757794`), verificando `0` ocurrencias remanentes del número `324` en el código fuente.
2. **[CORREGIDO] Webhook `/api/whatsapp` con validación de firma HMAC (`HAL-02`, Alta — Seguridad/API):** Se incorporó la verificación criptográfica `X-Hub-Signature-256` (`verifySignature`) con `crypto.createHmac('sha256', secret)` y `crypto.timingSafeEqual` en `api/whatsapp.js` cuando `WHATSAPP_APP_SECRET` está configurado.
3. **[CORREGIDO] Bug funcional de accesibilidad en galería (`HAL-05`, Media — Accesibilidad/UI):** En el código original, `setGallery(img, index)` comparaba `index === 0` e `index === 1` mientras los botones en `index.html:271-279` pasaban `1..3`, asignando el `alt` equivocado. Fue corregido en `assets/js/ui/navigation.js` (`GALLERY_ALTS[1..3]`) con soporte bilingüe ES/EN.
4. **[CORREGIDO] Modularización de CSS y JS (`HAL-06`, `HAL-07`, Media — Arquitectura/Mantenibilidad):** La hoja de estilos monolítica se dividió en 5 archivos por capas (`tokens.css`, `base.css`, `layout.css`, `components.css`, `chat.css`) y los 4 scripts monolíticos se organizaron en 18 módulos bajo `assets/js/{core,data,i18n,ui,chat}/` + `assets/js/main.js`, utilizando `git mv` para preservar la trazabilidad en Git y eliminando la duplicación de utilidades (`$`, `esc`, `t`, `tf`, `track`, `projectName`, `WA`).
5. **[CORREGIDO] Eliminación de duplicación DOM y listeners redundantes (`HAL-08`, `HAL-09`, Media — Mantenibilidad/Rendimiento):** Se centralizó la creación de `.msg__cta` únicamente en `renderMessage`, se unificaron los dos listeners `click` de `document` en un solo delegador limpio en `assets/js/ui/navigation.js`, y se eliminó el listener redundante `keydown(Enter)` sobre `#chatText`.

---

## 2. Metodología y Comandos Usados

1. **Inventario estático y conteo de líneas/bytes:**
   - Recorrido recursivo del árbol de archivos excluyendo `.git` mediante scripts de auditoría en Node.js (`v24.22.1`).
   - Comandos ejecutados:
     ```powershell
     Get-ChildItem -Force | Select-Object Mode, Name, Length
     git status
     git log --oneline
     ```
2. **Análisis estático de código (JS, CSS, HTML, i18n, Assets):**
   - Cruce AST/regex de selectores CSS contra clases referenciadas en HTML y JS.
   - Cruce de las 239 claves de `TEXT.es` y `TEXT.en` contra `data-i18n`, `data-i18n-attr` e invocaciones `t()` / `tf()`.
   - Verificación de unicidad de atributos `id="..."` en `index.html` y referencias `<use href="#...">` de iconos SVG.
   - Búsqueda de apariciones del teléfono `324` (`324\s*428|573244286166`), rutas antiguas, `innerHTML` y `addEventListener`.
3. **Pruebas unitarias de contrato sobre funciones Serverless (`api/chat.js` y `api/whatsapp.js`):**
   - Invocación directa de los handlers CommonJS en Node.js simulando objetos `req`/`res` para verificar códigos HTTP `200`, `204`, `400`, `403`, `405` y `503`, incluyendo mock de Gemini REST API y validación HMAC-SHA256 de Meta.
4. **Pruebas dinámicas End-to-End (E2E) con Google Chrome Headless vía CDP (Chrome DevTools Protocol):**
   - Servidor HTTP local en Node.js sirviendo los activos estáticos y los endpoints `/api/chat` y `/api/whatsapp`.
   - Ejecución de `chrome.exe --headless=new` inspeccionando `Runtime.consoleAPICalled`, `Runtime.exceptionThrown`, `Network.responseReceived`, viewports `390x844`, `768x1024` y `1440x900`, cambio de idioma ES/EN, filtros de portafolio, galería insignia, calculadora, formularios, chat Salma con fallback y las 5 rutas del Concierge.

---

## 3. Métricas de Línea Base y Post-Refactor

### 3.1 Resumen cuantitativo comparativo

| Métrica | Antes (Línea Base `6394c59`) | Después (Refactor `refactor/orden-codigo`) |
|---|---|---|
| **Total de archivos en el proyecto** | 37 archivos | 64 archivos (incluyendo 18 módulos JS, 5 capas CSS, 18 imágenes en uso y 11 documentos en raíz y `docs/`) |
| **Archivos JavaScript de cliente (`assets/js/`)** | 4 archivos monolíticos · 2,425 líneas | **18 módulos** organizados en `core/`, `data/`, `i18n/`, `ui/`, `chat/` y `main.js` · 2,618 líneas |
| **Archivos JavaScript de backend (`api/`, `lib/`)** | 3 archivos · 344 líneas | 3 archivos · 360 líneas (añadida verificación HMAC en `api/whatsapp.js`) |
| **Hojas de estilo (`assets/css/`)** | 1 archivo monolítico · 818 líneas | **5 archivos por capas** (`tokens.css`, `base.css`, `layout.css`, `components.css`, `chat.css`) · 833 líneas |
| **Documento HTML (`index.html`)** | 1 archivo · 833 líneas | 1 archivo · 851 líneas (referencias modulares CSS/JS y teléfono actualizado) |
| **Imágenes (`assets/img/*`)** | 19 archivos · 1,508,046 bytes | **18 archivos en uso** · 1,373,420 bytes (eliminada `hero-900.webp` huérfana de 134.6 KB) |
| **IDs HTML en `index.html`** | 98 IDs · 98 únicos · 0 duplicados | 98 IDs · 98 únicos · **0 duplicados** |
| **Claves i18n (`TEXT.es` / `TEXT.en`)** | 239 ES / 239 EN (100% paridad) | 239 ES / 239 EN (**100% paridad**) |
| **Apariciones del teléfono antiguo `324` en código** | **18 apariciones** | **0 apariciones** (100% migrado a `+57 315 775 7794`) |
| **Rutas antiguas de archivos monolíticos en código** | 5 archivos referenciados | **0 referencias** a rutas antiguas |
| **Carpetas vacías en el proyecto** | 0 | **0 carpetas vacías** |
| **Respuestas HTTP 404 en carga y pruebas E2E** | 0 (25 peticiones) | **0** (52 peticiones con `200 OK`) |
| **Errores de consola / Excepciones JS en E2E** | 0 | **0** |

### 3.2 Distribución de archivos tras la modularización (CSS y JS)

| Archivo | Líneas | Responsabilidad |
|---|---|---|
| `assets/css/tokens.css` | 30 | Variables CSS en `:root` (colores, fuentes, sombras, radios, contenedor) |
| `assets/css/base.css` | 89 | Reset, elementos base, tipografía editorial, utilidades, reveal y `prefers-reduced-motion` |
| `assets/css/layout.css` | 369 | Header, navegación, menú móvil, Hero, ticker, secciones, footer, mobile bar y media queries |
| `assets/css/components.css` | 169 | Botones, galería, filtros, tarjetas de proyecto, calculadora, FAQ, formularios, modales y toast |
| `assets/css/chat.css` | 176 | FAB, panel de chat, cabecera, tabs, Concierge, VIP, burbujas, tarjetas en chat, chips y modo voz |
| `assets/js/core/config.js` | 26 | `CONFIG` corporativo (`+57 315 775 7794`) y generador de enlaces `WA(text)` |
| `assets/js/core/dom.js` | 53 | Helpers DOM (`$`, `$$`, `esc`, `num`, `money`, `openDialog`, `closeDialog`, `initDials`, `showToast`) |
| `assets/js/core/events.js` | 26 | Telemetría `track()` (`window.dataLayer`) y bus de idioma (`emitLangChange`, `onLangChange`) |
| `assets/js/core/storage.js` | 48 | Acceso seguro a `localStorage` (`salman.lang`) y `sessionStorage` (`salman.chat.v1`, `salman.lead`) |
| `assets/js/data/projects.js` | 222 | `PROJECTS` (4 fichas ilustrativas), `SERVICES` (2 grupos), `FAQ` (8 preguntas) y `projectName()` |
| `assets/js/data/concierge.js` | 53 | `CONCIERGE` (5 rutas humanas a WhatsApp) |
| `assets/js/data/kb.js` | 166 | `KB` (22 entradas bilingües de respaldo local para Salma) |
| `assets/js/i18n/es.js` | 271 | Diccionario `TEXT.es` (239 claves en español) |
| `assets/js/i18n/en.js` | 269 | Diccionario `TEXT.en` (239 claves en inglés) |
| `assets/js/i18n/index.js` | 66 | `LANG_META`, `t()`, `tf()` y `applyLanguage()` |
| `assets/js/ui/navigation.js` | 308 | Header, menú móvil, render de proyectos/servicios/FAQ, filtros, galería (`HAL-05` corregido), modal y delegación unificada (`HAL-09` corregido) |
| `assets/js/ui/forms.js` | 162 | Validación de formularios, modal de lead (`#leadForm`) y formulario de agenda (`#bookingForm`) |
| `assets/js/ui/calculator.js` | 43 | Calculadora hipotecaria interactiva (`updateCalc`, `initCalcTracking`) |
| `assets/js/ui/reveal.js` | 35 | Animaciones `IntersectionObserver` (`[data-reveal]`, `[data-progress]`) |
| `assets/js/chat/voice.js` | 175 | Reconocimiento (`SpeechRecognition`) y síntesis de voz (`speechSynthesis`) |
| `assets/js/chat/concierge.js` | 91 | `renderConcierge()`, `setChatTab()`, `openArea()` y `openVIP()` |
| `assets/js/chat/chat.js` | 540 | Estado e historial del chat, cliente `/api/chat`, motor `KB` local, lead en chat, handoff y `window.Salma` |
| `assets/js/main.js` | 65 | Inicialización general, lectura de query params y exposición de `window.SALMAN` |

### 3.3 Peso de imágenes (`assets/img/`) y detección de huérfanos

| Archivo | Tamaño (Bytes) | Tamaño (KB) | Referenciado en | Estado |
|---|---|---|---|---|
| `og-salman.jpg` | 259,630 | 253.5 KB | `index.html:14, 22` (`og:image`, `twitter:image`) | En uso |
| `hero-1280.webp` | 228,446 | 223.1 KB | `index.html:27, 157, 158` (Hero principal + preload) | En uso |
| `hero-900.webp` | 134,626 | 131.5 KB | *Ninguna referencia estática ni dinámica* | **Eliminado (`HAL-12` corregido)** |
| `torres-900.webp` | 92,028 | 89.9 KB | `assets/js/ui/navigation.js` (`p.img = 'torres'`) | En uso |
| `playa-sq.webp` | 90,302 | 88.2 KB | `index.html:278` (miniatura 3 galería insignia) | En uso |
| `playa-900.webp` | 82,176 | 80.3 KB | `assets/js/ui/navigation.js` (`p.img = 'playa'`, galería) | En uso |
| `casa-club-900.webp` | 75,036 | 73.3 KB | `assets/js/ui/navigation.js` (`p.img = 'casa-club'`) | En uso |
| `hero-640.webp` | 71,552 | 69.9 KB | `index.html:27, 157` (`srcset` Hero móvil) | En uso |
| `lobby-900.webp` | 69,182 | 67.6 KB | `assets/js/ui/navigation.js` (`setGallery('lobby', 2)`) | En uso |
| `marina-900.webp` | 66,788 | 65.2 KB | `index.html:264`, `assets/js/ui/navigation.js` | En uso |
| `hero-560.webp` | 61,800 | 60.4 KB | `assets/js/ui/navigation.js` (galería modal de `torres` y `mar-abierto`) | En uso |
| `torres-560.webp` | 50,378 | 49.2 KB | `assets/js/ui/navigation.js` (`srcset` card y galería modal) | En uso |
| `lobby-sq.webp` | 44,736 | 43.7 KB | `index.html:275` (miniatura 2 galería insignia) | En uso |
| `playa-560.webp` | 42,366 | 41.4 KB | `assets/js/ui/navigation.js`, `assets/js/chat/chat.js` | En uso |
| `casa-club-560.webp` | 39,844 | 38.9 KB | `assets/js/ui/navigation.js`, `assets/js/chat/chat.js` | En uso |
| `marina-560.webp` | 38,726 | 37.8 KB | `index.html:264`, `assets/js/ui/navigation.js`, `assets/js/chat/chat.js` | En uso |
| `lobby-560.webp` | 33,596 | 32.8 KB | `assets/js/ui/navigation.js` (`srcset` galería y modal) | En uso |
| `marina-sq.webp` | 26,366 | 25.7 KB | `index.html:272` (miniatura 1 galería insignia) | En uso |
| `favicon.svg` | 466 | 0.5 KB | `index.html:29`, `site.webmanifest:12` | En uso |

---

## 4. Verificación de los 10 Puntos Solicitados en la Auditoría

1. **Capa de datos con precios ilustrativos y `lib/salman.js` prohíbe citarlos:**
   - **Verificado con evidencia:** `assets/js/data/projects.js` y `assets/js/data/kb.js` contienen precios ilustrativos (`priceFrom: 1180`, `690`, `2450`, `820`) que se muestran en la UI y en el fallback local del navegador. Por el contrario, `lib/salman.js:9-10` y `39-41` establecen como Regla Dura #1: *"NO inventes precios, áreas, fechas de entrega, disponibilidad, descuentos, rentabilidades ni condiciones de crédito. Si preguntan por un dato exacto, di que la lista vigente la confirma un asesor"*. Ambos comportamientos se conservaron intactos conforme a las restricciones del proyecto y se documentaron en `DOCUMENTACION.md`.
2. **Rate limit de `/api/chat` en memoria:**
   - **Verificado con evidencia:** `api/chat.js:11-27` implementa `const hits = new Map()` con `WINDOW_MS = 60 * 1000` y `MAX_HITS = 25`, tomando la IP de `req.headers['x-forwarded-for']`. Al ejecutarse en Vercel Serverless Functions sin dependencias externas, el estado en memoria es por instancia.
3. **Verificación de firma de Meta en `/api/whatsapp`:**
   - **Verificado y corregido (`HAL-02`):** En el commit base `6394c59`, `POST /api/whatsapp` no validaba la cabecera `X-Hub-Signature-256`. En el commit `1ab4457` se agregó la función `verifySignature(req)` usando `crypto.createHmac('sha256', secret)` y `crypto.timingSafeEqual` cuando `process.env.WHATSAPP_APP_SECRET` está definido.
4. **Chat monolítico:**
   - **Verificado y corregido (`HAL-06`):** El archivo monolítico original de 802 líneas se dividió en tres módulos cohesivos bajo `assets/js/chat/`: `voice.js` (175 líneas), `concierge.js` (91 líneas) y `chat.js` (540 líneas), además de extraer la persistencia a `assets/js/core/storage.js`.
5. **Configuración y estado global:**
   - **Verificado y corregido (`HAL-07`):** Se centralizaron la configuración (`CONFIG`, `WA`), utilidades DOM (`$`, `$$`, `esc`, `num`, `money`, `openDialog`, `closeDialog`, `initDials`, `showToast`), eventos (`track`, `emitLangChange`, `onLangChange`) y almacenamiento (`storage.js`) bajo el espacio de nombres `window.SALMAN`, manteniendo compatibilidad con `window.Salma`.
6. **Listeners duplicados / redundantes:**
   - **Verificado y corregido (`HAL-09`):** En `assets/js/ui/navigation.js` se unificaron los dos `document.addEventListener('click', ...)` en un único delegador, y en `assets/js/chat/chat.js` se eliminó el listener redundante `keydown(Enter)` sobre `#chatText` (ya cubierto por el evento `submit` de `#chatForm`).
7. **Uso de `innerHTML`:**
   - **Verificado y mejorado (`HAL-08`, `HAL-10`):** Todas las interpolaciones dinámicas utilizan `esc(str)` centralizado en `assets/js/core/dom.js`. Se eliminó la duplicación del bloque `.msg__cta` entre `renderMessage` y `replyRaw` en `assets/js/chat/chat.js`.
8. **Falta de pruebas automatizadas:**
   - **Verificado y corregido (`HAL-16`):** Se ejecutaron pruebas automatizadas de contratos Serverless (`api/chat.js` y `api/whatsapp.js`), validadores de integridad de archivos/referencias/teléfono y pruebas E2E en navegador real (`chrome.exe --headless=new` vía CDP), documentadas en `docs/TEST-REPORT.md`.
9. **`noindex` en `vercel.json`:**
   - **Verificado y conservado (`HAL-15`):** `vercel.json:2-9` aplica `X-Robots-Tag: noindex, nofollow` a `/(.*)`. Se mantuvo intacto por restricción expresa del proyecto.
10. **CSS/JS sin uso y activos huérfanos:**
    - **Verificado y documentado (`HAL-12`, `HAL-13`, `HAL-14`):** `assets/img/hero-900.webp` (131.5 KB) se identificó como activo huérfano y se conservó intacto conforme a la Regla 4 (no borrar activos sin autorización).

---

## 5. Tabla Completa de Hallazgos y Estado Final

| ID | Severidad | Categoría | Ubicación original | Evidencia | Impacto | Recomendación / Acción Aplicada | Esfuerzo | Estado Final |
|---|---|---|---|---|---|---|---|---|
| **HAL-01** | **Alta** | Consistencia de datos | Capa de datos, `index.html`, `lib/salman.js`, `vercel.json` (18 líneas) | 18 apariciones del teléfono `+57 324 428 6166` / `573244286166` en lugar de `+57 315 775 7794`. | Los enlaces de WhatsApp, llamadas, redirects `/wa` y `/asesor`, JSON-LD y el prompt de Salma derivaban leads al número equivocado (`324`). | Centralizado `573157757794` / `+57 315 775 7794` en `assets/js/core/config.js` y actualizadas las 18 referencias en `index.html`, `assets/js/data/kb.js`, `lib/salman.js` y `vercel.json`. | Bajo | **Corregido** (`2684dce`, `f6e4bd7`, `b698c00`, `1ab4457`) |
| **HAL-02** | **Alta** | Seguridad / API | `api/whatsapp.js:95-132` | `POST /api/whatsapp` procesaba payloads sin verificar `X-Hub-Signature-256`. | Un tercero podría falsificar eventos POST al webhook si conoce el endpoint. | Añadida función `verifySignature(req)` con HMAC-SHA256 (`WHATSAPP_APP_SECRET` + `x-hub-signature-256`) y `crypto.timingSafeEqual` en `api/whatsapp.js`. | Bajo | **Corregido** (`1ab4457`) |
| **HAL-03** | **Media** | API / Arquitectura | `api/chat.js:11-27`<br>`api/whatsapp.js:20-31` | `const hits = new Map()` y `const seen = new Map()` viven en la memoria del proceso Node serverless. | En Vercel, el rate-limit y la deduplicación se reinician en cada *cold start*. | Conservado el `Map` en memoria como protección sin dependencias externas (restricción del proyecto) y documentado en `DOCUMENTACION.md` y `docs/RISKS.md`. | Bajo | **Documentado** (restricción: 0 dependencias) |
| **HAL-04** | **Media** | Consistencia de datos | `assets/js/data/kb.js`<br>`lib/salman.js:39-41` | `lib/salman.js` prohíbe citar precios/disponibilidad; `KB` cita precios ilustrativos cuando el chat cae en modo fallback local. | Divergencia intencional entre modo IA en vivo y modo demo offline. | Conservados ambos textos intactos por restricción del proyecto (no cambiar textos comerciales ni lógica de negocio) y documentado en `DOCUMENTACION.md`. | N/A | **Documentado** (por restricción de negocio) |
| **HAL-05** | **Media** | Accesibilidad / UI | Galería insignia (`index.html:271-279`) | Los botones `.gallery__thumb` usan `data-index="1..3"`, pero `setGallery` evaluaba `index === 0` e `index === 1`. | Al hacer clic en la miniatura 1 (*Marina*), el `alt` de `#flagshipImage` cambiaba erróneamente a `"Lobby y área social..."`. | Corregido el mapa `GALLERY_ALTS[1..3]` con soporte bilingüe ES/EN en `assets/js/ui/navigation.js:90-112`. | Bajo | **Corregido** (`25ec95b`) |
| **HAL-06** | **Media** | Arquitectura / Mantenibilidad | CSS y JS de cliente | 1 archivo CSS (818 l.) y 4 archivos JS (2,425 l.) monolíticos con múltiples responsabilidades mezcladas. | Dificultaba el mantenimiento y la lectura modular del proyecto. | Modularizado con `git mv` en 5 capas CSS (`assets/css/*.css`) y 18 módulos JS (`assets/js/{core,data,i18n,ui,chat}/*` + `main.js`). | Medio | **Corregido** (`2684dce`..`f3076fe`) |
| **HAL-07** | **Media** | Arquitectura / Mantenibilidad | Variables globales y helpers duplicados | 8 constantes globales y utilidades duplicadas (`$`, `esc`, `t`, `tf`, `track`, `projectName`, `WA`). | Duplicación de código y acoplamiento entre scripts. | Centralizadas todas las utilidades y configuración en `assets/js/core/` y `assets/js/i18n/index.js` bajo `window.SALMAN`. | Medio | **Corregido** (`41895de`) |
| **HAL-08** | **Media** | Mantenibilidad | Creación de `.msg__cta` en el chat | `renderMessage` y `replyRaw` duplicaban el bloque de creación de `<button class="msg__cta">`. | Violación de DRY y riesgo de doble botón CTA si se pasaba `opts.cta` a `addBot`. | Centralizada la creación de `.msg__cta` únicamente en `renderMessage` dentro de `assets/js/chat/chat.js`. | Bajo | **Corregido** (`5fbfd58`) |
| **HAL-09** | **Media** | Rendimiento / Mantenibilidad | Delegación de eventos en UI y chat | Dos `document.addEventListener('click', ...)` separados en `initDelegates()` y listener `keydown(Enter)` redundante en `#chatText`. | Ejecución doble de listeners en cada clic del documento y doble handler de envío en el chat. | Unificado el delegador de clics en `assets/js/ui/navigation.js` y eliminado el listener `keydown(Enter)` redundante en `assets/js/chat/chat.js`. | Bajo | **Corregido** (`25ec95b`, `5fbfd58`) |
| **HAL-10** | **Baja** | Seguridad / DOM | Interpolaciones HTML en UI y chat | 14 usos de `innerHTML` en componentes dinámicos. | Requiere asegurar que toda interpolación pase por `esc()`. | Centralizado `esc()` en `assets/js/core/dom.js` y verificado en todas las plantillas dinámicas. | Bajo | **Corregido** (`41895de`) |
| **HAL-11** | **Baja** | Accesibilidad | `index.html:642-645` | Enlaces legales del footer (`href="#"`) sin documento jurídico definitivo. | Enlaces de prototipo pendientes de textos legales definitivos del cliente. | Conservado diseño actual y documentado como pendiente de textos jurídicos reales del cliente. | Bajo | **Documentado** |
| **HAL-12** | **Baja** | Rendimiento | `assets/img/hero-900.webp` | Archivo de 134,626 bytes (131.5 KB) sin referencias en HTML, CSS o JS. | Peso extra en repositorio (no afecta descarga en navegador). | Eliminado con `git rm assets/img/hero-900.webp` tras autorización del usuario. | Bajo | **Corregido** |
| **HAL-13** | **Baja** | Mantenibilidad / Rendimiento | `assets/css/chat.css`, `index.html:87-91` | 3 selectores CSS (`.msg__list`, `.msg--bot.is-typing`, `.msg__note`) y 3 `<symbol>` SVG (`#i-play`, `#i-check`, `#i-globe`) de reserva. | ~600 bytes de reserva en CSS/HTML. | Conservados para no alterar el DOM ni estilos de reserva. | N/A | **Documentado** |
| **HAL-14** | **Baja** | i18n / Mantenibilidad | `assets/js/i18n/es.js`, `assets/js/i18n/en.js` | 11 claves de reserva en `TEXT.es` y `TEXT.en` no invocadas actualmente. | Claves disponibles para expansión futura sin impacto funcional. | Conservadas las 239 claves intactas en `es.js` y `en.js` por restricción de no eliminar contenido. | N/A | **Conservado por restricción** |
| **HAL-15** | **Baja** | SEO | `vercel.json:6` | `vercel.json` envía `X-Robots-Tag: noindex, nofollow`. | Bloquea indexación en buscadores durante la etapa de demo. | Conservado intacto según restricción expresa del proyecto. | N/A | **Conservado por restricción** |
| **HAL-16** | **Media** | Pruebas | Suite de verificación | No existían pruebas automatizadas de contratos API ni E2E. | Riesgo de regresiones al refactorizar. | Ejecutada suite completa de verificación estática, contratos Serverless y E2E en Chrome Headless CDP antes y después del refactor (`docs/TEST-REPORT.md`). | Bajo | **Corregido** |

---

## 6. Evidencia Real de Ejecución (Fase 4 — Post-Refactor)

### 6.1 Verificación estática y de contratos Serverless (`api/chat.js` y `api/whatsapp.js`)
Ejecutada en Node.js (`v24.22.1`) tras completar la Fase 3:

```text
{
  "emptyDirs": [],
  "oldPathsInCode": [],
  "oldPhoneInCode": [],
  "apiResults": {
    "chatGet": 405,
    "chatOptions": 204,
    "chatEmpty": 400,
    "chatNoKey": 503,
    "chatMockOk": {
      "status": 200,
      "body": {
        "reply": "Hola, soy Salma de SALMAN.",
        "model": "gemini-2.5-flash"
      }
    },
    "waVerifyOk": 200,
    "waVerifyBad": 403,
    "waBadSig": 403,
    "waGoodSig": 200
  }
}
```

### 6.2 Pruebas End-to-End en Google Chrome Headless (CDP) Post-Refactor
Ejecutadas levantando servidor HTTP local + `chrome.exe --headless=new` en los tres viewports (`390x844`, `768x1024`, `1440x900`):

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
      "altAfterClick1": "Marina Cangrejo Azul — vista exterior al atardecer frente a la marina"
    },
    "calculatorTest": { "valueOut": "$2.000 M", "monthly": "$16 M", "financed": "$1.600 M" },
    "bookingFormTest": {
      "emptyValidationError": "Completa este campo.",
      "submittedStatus": "Listo. Se abrió WhatsApp con tu solicitud; un asesor confirmará el horario.",
      "lastOpenedUrl": "https://wa.me/573157757794?text=Hola%20SALMAN%2C%20quiero%20agendar%20una%20visita.%0A%E2%80%A2%20Proyecto%3A%20Marina%20Cangrejo%20Azul%0A%E2%80%A2%20Modalidad%3A%20Presencial%20en%20sala%20de%20ventas%0A%E2%80%A2%20Fecha%20tentativa%3A%202026-11-15%0A%E2%80%A2%20Nombre%3A%20Ana%20P%C3%A9rez%0A%E2%80%A2%20WhatsApp%3A%20%2B573001234567%0A%E2%80%A2%20Correo%3A%20ana%40example.com"
    },
    "chatTest": {
      "isOpen": true,
      "messageCount": 3,
      "lastBotMsg": "Precios desde de referencia en preventa:\n• Marina Cangrejo Azul: desde $1.180 M COP (2–3 hab · 94–186 m²).\n• Torres Bocagrande: desde $690 M COP (1–3 hab · 62–128 m²).\n• Casa Club Punta Arena: desde $2.450 M COP (3–4 hab · 168–310 m²).\n• Residencias Mar Abierto: desde $820 M COP (2–3 hab · 78–142 m²).\n\nPrecios en COP sujetos a unidad, piso y lista vigente.",
      "sessionStored": true
    },
    "conciergeTest": {
      "gridAreas": ["comercial", "diseno", "gerencia", "vip"],
      "helpButtonExists": true,
      "openedUrlsCount": 4,
      "vipUppercased": "LC-2026",
      "vipUrl": "https://wa.me/573157757794?text=Hola%20SALMAN.%20Deseo%20ingresar%20al%20*PROYECTO%20VIP%20CARTAGENA%20(Lista%20Cero)*.%20Mi%20c%C3%B3digo%20o%20solicitud%20de%20validaci%C3%B3n%20es%3A%20*LC-2026*.%0A%0AQuedo%20atento(a)%20a%20la%20verificaci%C3%B3n%20de%20cupo%20por%20parte%20del%20equipo%20encargado.",
      "backToSalmaWorks": true
    }
  },
  "totalRequests": 52,
  "static404s": [],
  "consoleErrors": [],
  "exceptions": []
}
```

> **Nota sobre pruebas no verificables automáticamente:**
> - **Captura real de micrófono (`SpeechRecognition`) y salida acústica (`speechSynthesis`):** En un entorno headless sin hardware de micrófono humano, el dictado por voz real se marca como **no verificado automáticamente** (se verificó la carga de `assets/js/chat/voice.js`, la vinculación de eventos de `#voiceMode` y se incluye en el checklist manual de `DOCUMENTACION.md`).
> - **Llamada en vivo a Google AI Studio y Meta Graph API con claves de producción:** Dado que el repositorio no contiene `.env` ni claves reales por seguridad, la invocación se verificó mediante mock del transporte `fetch` (`200 OK` con `model: "gemini-2.5-flash"`) y prueba de degradación `503 ai_unavailable` sin claves; la prueba con credenciales reales queda para el entorno de Vercel del cliente.

---

## 7. Comparativa Antes / Después

| Aspecto | Antes (Línea Base `6394c59`) | Después (Refactor `refactor/orden-codigo`) |
|---|---|---|
| **Estructura CSS** | 1 archivo monolítico (`818` líneas) | 5 archivos por capas (`tokens.css`, `base.css`, `layout.css`, `components.css`, `chat.css`) |
| **Estructura JS cliente** | 4 archivos monolíticos (`2,425` líneas) | 18 módulos organizados en `core/`, `data/`, `i18n/`, `ui/`, `chat/` + `main.js` |
| **Teléfono / WhatsApp (`HAL-01`)** | 18 referencias al `324 428 6166` | 100% unificado en `+57 315 775 7794` (`wa.me/573157757794`, `0` referencias al `324`) |
| **Firma Webhook Meta (`HAL-02`)** | Sin verificación `X-Hub-Signature-256` | Verificación HMAC-SHA256 (`verifySignature`) con `WHATSAPP_APP_SECRET` |
| **Bug `alt` en galería (`HAL-05`)** | Desfasado (`index === 0` para `data-index="1"`) | Corregido (`GALLERY_ALTS[1..3]`) y bilingüe ES/EN |
| **Duplicación `.msg__cta` (`HAL-08`)** | Duplicado en `renderMessage` y `replyRaw` | Centralizado únicamente en `renderMessage` |
| **Listeners de documento (`HAL-09`)** | 2 `click` listeners separados en `initDelegates()` y `keydown(Enter)` redundante en chat | 1 único delegador de clics limpio y `submit` único en `#chatForm` |

---

## 8. Riesgos Residuales

1. **Rate-limit y deduplicación en memoria (`HAL-03`):** Al no permitirse agregar dependencias externas ni bases de datos (KISS / cero dependencias), los `Map` en memoria de `api/chat.js` y `api/whatsapp.js` siguen siendo por instancia serverless.
2. **Precios ilustrativos en `assets/js/data/projects.js` y `assets/js/data/kb.js` (`HAL-04`):** Permanecen como datos de demostración hasta que el cliente entregue las fichas técnicas definitivas para producción.
3. **Cabecera `X-Robots-Tag: noindex, nofollow` (`HAL-15`):** Se conserva activa en `vercel.json` para proteger el entorno de demostración; solo debe retirarse cuando el cliente autorice la salida a producción con fichas reales.
