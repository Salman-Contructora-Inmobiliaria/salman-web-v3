# Documentación Técnica y Funcional — SALMAN Web v2

- **Proyecto:** SALMAN Constructora + Inmobiliaria S.A.S. (Cartagena de Indias, Colombia)
- **Dueño del proyecto:** Gerencia SALMAN Constructora + Inmobiliaria S.A.S. (`SalmanSAS.gerencia@gmail.com`)
- **Estado del documento:** Fase 0 (Línea base pre-refactor — se actualizará al completar Fase 3 y Fase 4)
- **Última actualización:** 2026-10-25
- **Commit base auditado:** `6394c59` (tag `pre-refactor`)

---

## 1. Resumen del negocio y del sitio

**SALMAN Constructora + Inmobiliaria S.A.S.** estructura, diseña, construye y comercializa proyectos residenciales y turísticos en Cartagena de Indias, Colombia, integrando bajo un mismo equipo:
1. **Constructora:** gestión integral de proyectos, diseño arquitectónico, diseño urbano, interventoría y auditorías, visualización 3D y consultoría 360°.
2. **Inmobiliaria:** búsqueda y acompañamiento, evaluación y diagnóstico técnico, análisis normativo, evaluación jurídica, evaluación financiera y estructuración de compra.

El sitio web (`salman-web-v2-completo`) es una **landing comercial bilingüe (ES/EN)** de alto perfil editorial que incluye:
- Presentación del proyecto insignia (*Marina Cangrejo Azul*) y portafolio filtrable de 4 proyectos (*Marina Cangrejo Azul*, *Torres Bocagrande*, *Casa Club Punta Arena*, *Residencias Mar Abierto*).
- Acceso a preventa privada **Lista Cero (VIP)**.
- **Calculadora financiera** interactiva con amortización francesa.
- **Formularios de captura de leads y agendamiento de visitas** conectados a WhatsApp con consentimiento de Habeas Data (Ley 1581 de 2012).
- **Salma (Asesora Digital con IA):** chat flotante bilingüe con soporte de voz (Web Speech API: `SpeechRecognition` + `speechSynthesis`), conectado a Google Gemini (`gemini-2.5-flash`) mediante `/api/chat` y con motor local de respaldo (*fallback* por coincidencia de palabras clave sobre `KB`).
- **Pestaña Concierge:** derivación directa a WhatsApp por área de atención (5 rutas humanas) y validación humana de código VIP.
- **Webhook de WhatsApp Cloud API (`/api/whatsapp`):** integración serverless con Meta Graph API que comparte el cerebro `lib/salman.js`.

> **Advertencia sobre datos del prototipo:** Los nombres de proyectos, precios, áreas, fechas de entrega y porcentajes vendidos en la capa de datos del cliente (`data.js`) son **contenido ilustrativo de demostración**. En el backend (`lib/salman.js`), el modelo tiene prohibido citar precios, áreas, disponibilidad o condiciones crediticias no verificadas.

---

## 2. Stack y arquitectura

| Capa | Tecnología | Detalles |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript Vanilla (ES2020+) | Sin frameworks (React/Vue), sin bundlers (Webpack/Vite) ni pasos de compilación (*zero build step*). |
| **Voz en navegador** | Web Speech API | `SpeechRecognition` / `webkitSpeechRecognition` (STT) y `window.speechSynthesis` (TTS) en `es-CO` y `en-US`. |
| **Persistencia cliente** | Web Storage API | `localStorage` (`salman.lang`) y `sessionStorage` (`salman.chat.v1`, `salman.lead`). |
| **Analítica** | `window.dataLayer` | Eventos estándar listos para Google Tag Manager / GA4. |
| **Backend Serverless** | Vercel Functions (Node.js CommonJS) | `api/chat.js` y `api/whatsapp.js` consumiendo `lib/salman.js`. |
| **IA Generativa** | Google Gemini REST API (`v1beta`) | Modelo por defecto: `gemini-2.5-flash` vía `fetch` nativo con `AbortController` (timeout 20 s). |
| **Mensajería** | WhatsApp Links (`wa.me`) + WhatsApp Cloud API | Enlaces directos desde UI/Concierge y webhook Graph API (`v21.0` por defecto) en `/api/whatsapp`. |

### Diagrama de arquitectura

```mermaid
flowchart TD
  subgraph Browser["Navegador (Cliente Estático)"]
    HTML["index.html"]
    CSS["CSS (Estilos y Tokens)"]
    AppJS["Lógica UI / Formularios / Calculadora / i18n"]
    ChatJS["Salma Chat + Voz + Concierge"]
    LocalKB["Base de Conocimiento Local (KB Fallback)"]
  end

  subgraph Vercel["Vercel Serverless (Node.js CommonJS)"]
    ApiChat["POST /api/chat"]
    ApiWA["GET & POST /api/whatsapp"]
    LibSalman["lib/salman.js (SYSTEM_PROMPT + generateReply)"]
  end

  subgraph External["Servicios Externos"]
    Gemini["Google Gemini REST API (gemini-2.5-flash)"]
    MetaWA["Meta WhatsApp Cloud API (Graph v21.0)"]
    WaMe["WhatsApp Humano (wa.me/573157757794)"]
  end

  HTML --> CSS
  HTML --> AppJS
  HTML --> ChatJS
  ChatJS -->|POST JSON| ApiChat
  ChatJS -->|Fallback si API 503/offline| LocalKB
  ChatJS -->|Concierge / Handoff| WaMe
  AppJS -->|Agendar / Lead| WaMe
  ApiChat --> LibSalman
  ApiWA --> LibSalman
  LibSalman -->|HTTPS POST| Gemini
  MetaWA <-->|Webhook / Mensajes| ApiWA
```

---

## 3. Árbol de archivos y responsabilidad de cada carpeta

### Estado actual (Línea Base — Fase 0)

```text
salman-web-v2-completo/
├─ index.html                  # Documento principal (landing + modales + chat + sprite SVG)
├─ vercel.json                 # Cabeceras HTTP (X-Robots-Tag: noindex, nofollow) y redirecciones (/wa, /asesor)
├─ site.webmanifest            # Manifiesto PWA básico
├─ robots.txt                  # Reglas para crawlers y referencia a sitemap
├─ sitemap.xml                 # Mapa XML del sitio
├─ .env.example                # Plantilla de variables de entorno (sin secretos)
├─ .gitignore                  # Exclusiones de Git (.env*, node_modules, .vercel)
├─ .vercelignore               # Exclusiones de despliegue en Vercel (*.md, start-demo.cmd, .env*)
├─ start-demo.cmd              # Script Windows para levantar servidor HTTP local con Python (puerto 8080)
├─ LEEME-PRIMERO.md            # Guía rápida original de entrega
├─ DOCUMENTACION.md            # Documentación técnica y funcional completa (este archivo)
├─ README.md                   # Resumen ejecutivo y guía rápida de inicio
├─ api/                        # Funciones Serverless en Vercel (CommonJS)
│  ├─ chat.js                  # Endpoint POST /api/chat con rate-limit en memoria
│  └─ whatsapp.js              # Endpoint GET/POST /api/whatsapp (webhook de Meta Cloud API)
├─ lib/                        # Lógica compartida de backend
│  └─ salman.js                # Prompt de sistema, reglas duras, sanitización de historial y cliente Gemini REST
├─ assets/                     # Recursos estáticos públicos
│  ├─ css/
│  │  └─ styles.css            # Hoja de estilos única en línea base (se modularizará en Fase 3)
│  ├─ js/
│  │  ├─ data.js               # Configuración, PROJECTS, SERVICES, CONCIERGE, FAQ y KB local
│  │  ├─ i18n.js               # Diccionario bilingüe TEXT (es/en) y metadatos de idioma LANG_META
│  │  ├─ app.js                # Renderizado de secciones, filtros, galería, calculadora, formularios y modales
│  │  └─ chat.js               # Asesora Salma, voz (STT/TTS), persistencia sessionStorage y Concierge
│  └─ img/                     # 19 activos gráficos (.webp, .svg, .jpg)
└─ docs/                       # Entregables de auditoría, línea base y arquitectura
   ├─ AUDITORIA-CODIGO.md      # Auditoría detallada antes y después del refactor
   └─ BASELINE.md              # Evidencia técnica y funcional de la línea base (Fase 0)
```

*(Nota: En la Fase 3, `assets/css/` y `assets/js/` se organizarán en submódulos `core/`, `data/`, `i18n/`, `ui/` y `chat/` según el plan aprobado).*

---

## 4. Cómo ejecutar en local

### Opción A: Script incluido (Python 3)
1. Ejecutar `start-demo.cmd` (doble clic o desde terminal en Windows):
   ```powershell
   .\start-demo.cmd
   ```
2. Abre automáticamente `http://localhost:8080/`.
   - **Nota:** Con un servidor estático simple (`python -m http.server`), la ruta `/api/chat` no existe localmente y devuelve `404`/`501`, por lo que `chat.js` activa de forma transparente el **modo fallback local (`KB`)** sin romper la experiencia. El modo voz (`SpeechRecognition`) funciona porque `localhost` es un contexto seguro.

### Opción B: Vercel CLI (para probar funciones `/api/chat` y `/api/whatsapp`)
1. Copiar `.env.example` a `.env.local` y completar `GEMINI_API_KEY`.
2. Ejecutar:
   ```powershell
   npx vercel dev
   ```

---

## 5. Variables de entorno

Definidas en `.env.example` y configurables en **Vercel → Settings → Environment Variables**:

| Variable | Obligatoria | Valor por defecto | Descripción |
|---|---|---|---|
| `GEMINI_API_KEY` | Sí (para IA en vivo) | — | Clave de API de Google AI Studio (`AIza...`). También acepta `GOOGLE_API_KEY` como alias en `lib/salman.js`. |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Modelo de Gemini utilizado para generar respuestas. No cambiar sin justificación técnica/comercial. |
| `WHATSAPP_TOKEN` | Sí (para webhook WA) | — | Token Bearer de Meta WhatsApp Cloud API (System User o temporal). |
| `WHATSAPP_PHONE_NUMBER_ID` | Sí (para webhook WA) | — | Identificador numérico del teléfono en Meta Cloud API (no es el número telefónico). |
| `WHATSAPP_VERIFY_TOKEN` | Sí (para webhook WA) | `salman-demo-2026` (ejemplo) | Cadena secreta definida por el administrador para validar el reto `GET /api/whatsapp`. |
| `WHATSAPP_API_VERSION` | No | `v21.0` | Versión del Graph API de Meta. |

> **Seguridad:** Ninguna clave vive en el código fuente ni en el repositorio Git. `.gitignore` y `.vercelignore` bloquean cualquier archivo `.env*`.

---

## 6. Cómo desplegar en Vercel

1. Subir el repositorio a GitHub/GitLab/Bitbucket y conectarlo como proyecto en Vercel (Root Directory: `./`).
2. Framework Preset: **Other** (sin comando de build, Output Directory por defecto).
3. En **Settings → Environment Variables**, registrar `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash` y las variables `WHATSAPP_*`.
4. Desplegar a producción y verificar:
   - `GET https://<dominio>/` carga la landing.
   - `GET https://<dominio>/api/chat` responde `405 {"error":"method_not_allowed"}`.
   - `POST https://<dominio>/api/chat` con `{"messages":[{"role":"user","content":"Hola"}],"lang":"es"}` responde `200 {"reply":"...","model":"gemini-2.5-flash"}`.

---

## 7. Rutas públicas y endpoints

| Ruta | Método | Tipo | Destino / Comportamiento |
|---|---|---|---|
| `/` (`index.html`) | `GET` | Estático | Landing principal bilingüe con Salma, Concierge, calculadora y formularios. |
| `/wa` | `GET` | Redirect 307 (`vercel.json`) | Redirige a `https://wa.me/573157757794`. *(Nota: en baseline apuntaba al 324; ver `docs/AUDITORIA-CODIGO.md` HAL-01)*. |
| `/asesor` | `GET` | Redirect 307 (`vercel.json`) | Redirige a `https://wa.me/573157757794?text=Hola%20SALMAN%2C%20vengo%20de%20la%20web.%20Quiero%20hablar%20con%20un%20asesor.` |
| `/api/chat` | `POST`, `OPTIONS` | Serverless Function | Genera respuesta conversacional con Salma (`lib/salman.js`). |
| `/api/whatsapp` | `GET`, `POST` | Serverless Function | Verificación de webhook de Meta (`GET`) y recepción/respuesta de mensajes de WhatsApp (`POST`). |

---

## 8. Flujo del chat Salma

1. **Inicialización (`init`):**
   - Vincula nodos DOM (`#chatPanel`, `#chatMessages`, `#chatChips`, `#chatText`, `#voiceMode`, `#chatConcierge`, etc.).
   - Intenta restaurar la sesión desde `sessionStorage.getItem('salman.chat.v1')` (hasta 24 mensajes recientes, chips activos, idioma y lead capturado).
   - Si no hay sesión previa, muestra el mensaje de bienvenida (`t('chat.welcome')`) y los 4 chips iniciales: `['projects', 'price', 'visit', 'brochure']`.
2. **Enrutamiento de mensajes (`route(text, opts)`):**
   - Si es el primer turno (`chat.history.length <= 1`) y el texto es un saludo básico (`hola|hello|hi|buenas`), responde inmediatamente con `KB_BY_ID.greet`.
   - Si `chat.apiEnabled === true` y no se forzó `opts.local`, envía los últimos 9 mensajes a `POST /api/chat`.
   - Si `/api/chat` responde `200`, muestra la respuesta de Gemini, actualiza chips sugeridos (`['visit', 'brochure', 'advisor', 'projects']`) y registra el evento `chat_ai_reply`.
   - **Mecanismo de Fallback:** Si `/api/chat` falla (error de red, `429`, `503` por falta de `GEMINI_API_KEY`, etc.), desactiva `chat.apiEnabled = false` para el resto de la sesión, registra `chat_api_fallback` y resuelve la consulta localmente mediante `findEntry(norm)` puntuando coincidencias en `KB`.
3. **Voz (`SpeechRecognition` + `speechSynthesis`):**
   - Al abrir el modo voz (`openVoice()`), verifica soporte de `SpeechRecognition || webkitSpeechRecognition`.
   - Transcribe en tiempo real (`interimResults = true`) en el idioma activo (`es-CO` o `en-US`).
   - Al finalizar la locución del usuario (`onend`), envía el texto a `route(text, { speak: true, fast: true })` y sintetiza la respuesta con `speechSynthesis` usando una voz acorde al idioma (`pickVoice()`), respetando el botón de silencio (`#chatMute`).
4. **Captura de Lead y Handoff en el chat (`showLeadForm`, `openHandoff`):**
   - Solicita nombre, WhatsApp y casilla de consentimiento Ley 1581 de 2012.
   - Guarda el lead en `sessionStorage.setItem('salman.lead', ...)` y ofrece un botón de traspaso (*handoff*) a WhatsApp que arma un resumen automático de los últimos 6 mensajes de la conversación (`chat.handoffSummary`).

---

## 9. Flujo del Concierge y las 5 rutas

El panel del chat cuenta con dos pestañas controladas por `setChatTab(tab)`:
- **Salma · IA (`data-chat-tab="salma"`):** conversación asistida por IA / KB local.
- **Concierge (`data-chat-tab="concierge"`):** derivación directa a atención humana por WhatsApp (`https://wa.me/573157757794?text=...`).

Las **5 rutas del arreglo `CONCIERGE`** son:

| # | `id` | Etiqueta (ES / EN) | Propósito | Función invocada |
|---|---|---|---|---|
| 1 | `comercial` | Quiero comprar o visitar / *I want to buy or visit* | Disponibilidad, precios y agendar visita con el **1. ÁREA COMERCIAL Y VENTAS**. | `openArea('comercial')` |
| 2 | `diseno` | Planos y diseño / *Plans & design* | Planos, especificaciones técnicas y acabados con **2. DISEÑO Y ARQUITECTURA**. | `openArea('diseno')` |
| 3 | `gerencia` | Invertir o aliarme / *Invest or partner* | Inversión patrimonial, alianzas o lotes con **3. GERENCIA / B2B**. | `openArea('gerencia')` |
| 4 | `vip` | Lista Cero VIP / *Lista Cero VIP* | Preventa privada frente al mar (**PROYECTO VIP CARTAGENA — Lista Cero**). Al tocar la tarjeta en la cuadrícula enfoca `#vipCode`; el botón `#vipBtn` abre WhatsApp. | `openVIP()` |
| 5 | `orientacion` (`help: true`) | No sé, oriéntenme / *Not sure, guide me* | Botón inferior punteado (`#conciergeHelp`) para usuarios que requieren ser direccionados al área correcta. | `openArea('orientacion')` |

El botón **"Volver a Salma"** (`.concierge__back`) ejecuta `setChatTab('salma')`, ocultando el Concierge y restaurando la vista de mensajes e input de Salma.

---

## 10. Flujo VIP y validación humana

- **Regla de seguridad y negocio:** El código VIP de *Lista Cero* **nunca se valida en el navegador ni por la IA**. No existe lista de códigos VIP en el frontend ni en `lib/salman.js`.
- **Comportamiento en el Concierge (`openVIP()`):**
  1. El campo `#vipCode` convierte automáticamente la entrada a mayúsculas (`input.value.toUpperCase()`).
  2. Si el usuario ingresa un código (ej. `LC-2026`), se inserta en la plantilla:
     - ES: `Hola SALMAN. Deseo ingresar al *PROYECTO VIP CARTAGENA (Lista Cero)*. Mi código o solicitud de validación es: *LC-2026*.`
     - EN: `Hi SALMAN. I would like to join the *CARTAGENA VIP PROJECT (Lista Cero)*. My code or validation request is: *LC-2026*.`
  3. Si el usuario deja el campo vacío, se inserta el marcador `SOLICITAR-ACCESO-VIP` (ES) o `REQUEST-VIP-ACCESS` (EN) para que el equipo humano gestione su ingreso.

---

## 11. Contrato de `/api/chat`

- **Archivo:** `api/chat.js`
- **Métodos permitidos:** `POST`, `OPTIONS`
- **Rate limit:** 25 peticiones por minuto (`WINDOW_MS = 60000`, `MAX_HITS = 25`) por IP (`x-forwarded-for`), almacenado en un `Map` en memoria de la instancia serverless.
- **Request (`POST /api/chat`):**
  ```json
  {
    "messages": [
      { "role": "user", "content": "Hola, ¿qué servicios ofrecen?" }
    ],
    "lang": "es",
    "project": "marina"
  }
  ```
- **Respuestas:**
  - `204 No Content`: a peticiones `OPTIONS` (incluye cabecera `Allow: POST, OPTIONS`).
  - `200 OK`: `{ "reply": "Texto de respuesta...", "model": "gemini-2.5-flash" }`.
  - `400 Bad Request`: `{ "error": "messages_required" }` cuando `messages` no es un arreglo o está vacío.
  - `405 Method Not Allowed`: `{ "error": "method_not_allowed" }` para métodos distintos de `POST`/`OPTIONS` (incluye cabecera `Allow: POST, OPTIONS`).
  - `429 Too Many Requests`: `{ "error": "rate_limited" }` cuando la IP supera 25 peticiones en 60 s.
  - `503 Service Unavailable`: `{ "error": "ai_unavailable" }` cuando falta `GEMINI_API_KEY`, Gemini devuelve error HTTP, timeout (>20 s) o respuesta vacía. Nunca filtra stack traces al cliente.

---

## 12. Contrato de `/api/whatsapp`

- **Archivo:** `api/whatsapp.js`
- **Métodos permitidos:** `GET`, `POST`
- **Verificación de Webhook (`GET /api/whatsapp`):**
  - Query params esperados de Meta: `hub.mode=subscribe`, `hub.verify_token=<token>`, `hub.challenge=<string>`.
  - Si `hub.mode === 'subscribe'` y `hub.verify_token === process.env.WHATSAPP_VERIFY_TOKEN`: responde `200 OK` (`text/plain`) con el valor de `hub.challenge` (o `'ok'`).
  - En caso contrario: responde `403 Forbidden` (`forbidden`).
- **Recepción de Mensajes (`POST /api/whatsapp`):**
  - Deduplicación en memoria (`seen` `Map` con TTL de 10 minutos por `message.id`).
  - Extrae texto de mensajes simples (`text.body`), botones (`button.text`) e interactivos (`interactive.button_reply.title`, `interactive.list_reply.title`).
  - Si recibe un mensaje de tipo `audio`, responde con aviso cortés indicando que por ahora lee texto.
  - Detecta idioma por heurística léxica (`detectLang`), invoca `generateReply({ messages, lang, channel: 'whatsapp' })` y envía la respuesta mediante `POST https://graph.facebook.com/{version}/{phoneId}/messages`.
  - Siempre devuelve `200 OK` (`EVENT_RECEIVED`) a Meta para evitar reintentos infinitos.
- **Otros métodos (`PUT`, `DELETE`, etc.):**
  - Responde `405 Method Not Allowed` (`method_not_allowed`) con cabecera `Allow: GET, POST`.

---

## 13. Modelo de datos: `PROJECTS`, `KB`, `FAQ`, `CONCIERGE`

Definidos actualmente en `assets/js/data.js`:

1. **`CONFIG`:** Metadatos corporativos (`brand`, `legal`, `whatsapp`, `phoneDisplay`, `email`, `city`, `hours`, `trm`, `ivaNote`).
2. **`PROJECTS` (Array de 4 objetos):**
   - Campos: `id` (`marina`, `torres`, `punta-arena`, `mar-abierto`), `name`, `type` (`inversion`, `residencial`, `turistico`), `typeLabel` (`{es, en}`), `location` (`{es, en}`), `status` (`{es, en}`), `statusKey` (`presale`, `building`, `last`), `img`, `gallery` (array de slugs de imagen), `beds`, `area`, `delivery` (`{es, en}`), `priceFrom` (millones COP, ilustrativo), `available`, `total`, `soldPct`, `hook` (`{es, en}`), `desc` (`{es, en}`), `amenities` (`{es:[], en:[]}`), `payment` (`{es, en}`), `featured` (boolean).
3. **`SERVICES` (Array de 2 grupos):**
   - Grupos: *Constructora* (6 ítems) e *Inmobiliaria* (6 ítems), cada uno con `group` (`{es, en}`), `intro` (`{es, en}`) e `items` (`[{ t: {es, en}, d: {es, en} }]`).
4. **`CONCIERGE` (Array de 5 rutas):**
   - Campos: `id` (`comercial`, `diseno`, `gerencia`, `vip`, `orientacion`), `help` (boolean opcional), `label` (`{es, en}`), `desc` (`{es, en}`), `msg` (`{es, en}`).
5. **`FAQ` (Array de 8 preguntas frecuentes):**
   - Campos: `q` (`{es, en}`) y `a` (`{es, en}`).
6. **`KB` (Array de 22 entradas de conocimiento local para fallback del chat):**
   - IDs: `greet`, `projects`, `marina`, `marina_price`, `price`, `payment`, `listacero`, `visit`, `location`, `delivery`, `abroad`, `english`, `amenities`, `services`, `invest`, `process`, `trust`, `contact`, `advisor`, `brochure`, `thanks`, `fallback`.
   - Campos: `id`, `keys` (array de palabras/frases clave), `es`, `en`, `chips` (array de IDs de sugerencia) y `action` opcional (`portfolio`, `open_project:marina`, `scroll:#agenda`, `lead`).

---

## 14. Internacionalización (i18n ES/EN)

- **Diccionario:** `TEXT.es` (239 claves) y `TEXT.en` (239 claves), con paridad 100% entre ambos idiomas, más `LANG_META` (`html`, `speech`, `tts`, `label`).
- **Mecanismo declarativo en DOM:**
  - `[data-i18n="clave"]`: inyecta la cadena traducida en el elemento (soporta etiquetas inline editoriales como `<br>` y `<em>` en titulares).
  - `[data-i18n-attr="attr1:clave1;attr2:clave2"]`: traduce atributos como `placeholder` o `aria-label`.
- **Sincronización entre módulos:**
  - `applyLanguage(lang)` persiste la preferencia en `localStorage.setItem('salman.lang', lang)`, actualiza `document.documentElement.lang` (`es-CO` / `en`), vuelve a renderizar las secciones dinámicas (`renderProjects`, `renderServices`, `renderFAQ`, `updateCalc`) y emite el evento `CustomEvent('salman:lang', { detail: { lang } })` que escucha el módulo de chat para actualizar chips, estado, voz y tarjetas del Concierge.

---

## 15. Accesibilidad (a11y)

- Enlace de salto al contenido principal (`.skip-link` → `#main`).
- Uso de `<dialog>` nativo para modales (`#projectModal`, `#leadModal`) con cierre por tecla `Escape` y clic en `::backdrop`.
- Atributos ARIA en componentes interactivos:
  - Acordeón FAQ: `aria-expanded`, `aria-controls`, `role="region"`.
  - Filtros y selectores de idioma: `aria-pressed`.
  - Pestañas de galería y pestañas del chat/Concierge: `role="tablist"`, `role="tab"`, `aria-selected`.
  - Regiones vivas: `aria-live="polite"` en `#projectsCount`, `#calc__result`, `#bookingStatus`, `#leadStatus`, `#chatMessages` (`role="log"`), `#voiceTranscript` y `#toast`.
- Soporte de `@media (prefers-reduced-motion: reduce)` en CSS que desactiva animaciones y transiciones.
- Estilos `:focus-visible` definidos con contorno dorado (`2px solid var(--gold)`).

---

## 16. Seguridad

- **Protección de credenciales:** `GEMINI_API_KEY` y `WHATSAPP_TOKEN` se leen exclusivamente en el entorno serverless (`process.env`). El navegador nunca tiene acceso a claves.
- **Guardarraíles de prompt (`lib/salman.js`):** Reglas estrictas contra alucinación de precios, prohibición de validar códigos VIP, prohibición de solicitar documentos sensibles (cédula/bancos) y defensa ante inyección de prompt.
- **Sanitización XSS en frontend:** Función `esc(str)` aplicada a interpolaciones de datos y entradas de usuario antes de insertar en plantillas HTML.
- **Limitación de tasa y tamaño:**
  - Rate limit por IP en `/api/chat` (25 req/min).
  - Truncado de historial a los últimos 10 mensajes y 1200 caracteres por mensaje en `normalizeMessages()` (`lib/salman.js`).
  - Límite de `maxlength="500"` en `#chatText` y `maxlength="24"` en `#vipCode`.
- **Indexación bloqueada en entorno demo:** `vercel.json` envía la cabecera `X-Robots-Tag: noindex, nofollow` en todas las rutas (`/(.*)`).

---

## 17. Rendimiento

- **Cero dependencias externas de JS:** Todo el JS de cliente pesa ~121 KB sin comprimir (~35 KB gzip).
- **Imágenes optimizadas en WebP:** Uso de `<picture>`, `srcset` (`560w`, `640w`, `900w`, `1280w`), `loading="lazy"` y `decoding="async"` en tarjetas y galerías, más `<link rel="preload" as="image">` con `fetchpriority="high"` para la imagen principal del Hero (`hero-1280.webp`).
- **Scroll pasivo e IntersectionObserver:** Listener de scroll con `{ passive: true }` y animaciones de entrada (`[data-reveal]`) desacopladas mediante `IntersectionObserver`.

---

## 18. Pruebas y checklist manual

### Pruebas automatizadas / de línea de comandos
1. **Contratos de API (`/api/chat` y `/api/whatsapp`):**
   - `GET /api/chat` → `405` (`method_not_allowed`).
   - `OPTIONS /api/chat` → `204`.
   - `POST /api/chat` sin `messages` → `400` (`messages_required`).
   - `GET /api/whatsapp` con `hub.verify_token` válido → `200` + `challenge`.
   - `GET /api/whatsapp` con `hub.verify_token` inválido → `403`.
2. **Verificación E2E en navegador headless (Chrome CDP):**
   - Carga sin errores de consola ni 404 en recursos estáticos.
   - Comprobación de viewports `390x844`, `768x1024` y `1440x900` sin desbordamiento horizontal (`scrollWidth <= innerWidth`).

### Checklist manual de regresión
- [ ] **Idioma ES/EN:** Cambiar entre ES y EN desde el header y desde el chat; verificar que textos, calculadora, FAQ, tarjetas y Concierge cambien de idioma.
- [ ] **Portafolio y modal:** Filtrar por *Todos*, *Residencial*, *Turístico* e *Inversión*; abrir la ficha de un proyecto y cerrarla con `Escape` o el botón `×`.
- [ ] **Galería insignia:** Cambiar entre las 3 miniaturas de *Marina Cangrejo Azul* y verificar imagen, contador (`01 / 03`) y texto alternativo (`alt`).
- [ ] **Calculadora:** Mover los 4 controles deslizantes y verificar actualización de cuota mensual y monto financiado.
- [ ] **Formulario de agenda y modal de lead:** Intentar enviar vacío (debe mostrar validación), completar datos válidos + check Ley 1581 y confirmar apertura de `wa.me/573157757794`.
- [ ] **Chat Salma:** Abrir el FAB, enviar una consulta, verificar respuesta (IA o fallback local), recargar la página y comprobar que el historial persiste en `sessionStorage`.
- [ ] **Modo voz:** En Chrome/Edge sobre `localhost` o HTTPS, abrir el micrófono, hablar y verificar transcripción y síntesis de voz (y botón de silencio).
- [ ] **Concierge y VIP:** Cambiar a la pestaña *Concierge*, probar las 5 rutas (*Comercial*, *Diseño*, *Gerencia*, *Lista Cero VIP*, *Orientación*), escribir un código en `#vipCode` (verifica que pase a mayúsculas sin validarse en navegador) y pulsar *Volver a Salma*.

---

## 19. Problemas conocidos (detectados en Auditoría Fase 0)

1. **Teléfono antiguo (`324`) en línea base (HAL-01):** En el commit base `6394c59`, 18 referencias en `data.js`, `index.html`, `lib/salman.js` y `vercel.json` usan `+57 324 428 6166` en lugar del teléfono oficial autorizado `+57 315 775 7794` (`wa.me/573157757794`). Se corrige en el refactor.
2. **Inconsistencia entre `data.js` (precios ilustrativos) y `lib/salman.js` (HAL-02):** Mientras `lib/salman.js` prohíbe a Gemini citar precios o disponibilidad, el fallback local `KB` en `data.js` sí cita precios ilustrativos cuando `/api/chat` no está disponible. Es un comportamiento conocido del prototipo que debe mantenerse hasta conectar fichas reales.
3. **Desfase de índice en `alt` de galería (`app.js:137`, HAL-05):** Los botones `.gallery__thumb` usan `data-index="1..3"`, pero `setGallery` comparaba `index === 0` y `index === 1`, asignando el `alt` equivocado al cambiar de foto.
4. **Rate-limit y deduplicación en memoria (`api/chat.js`, `api/whatsapp.js`, HAL-03):** En funciones serverless de Vercel, los `Map` en memoria se reinician entre instancias frías (*cold starts*). Para tráfico alto en producción se recomienda Vercel KV / Upstash Redis.
5. **Ausencia de validación de firma HMAC (`X-Hub-Signature-256`) en `/api/whatsapp` (HAL-04):** El endpoint `POST /api/whatsapp` procesa el payload sin verificar la firma criptográfica de Meta (`APP_SECRET`).

*(Ver detalle completo y matriz de hallazgos en [`docs/AUDITORIA-CODIGO.md`](docs/AUDITORIA-CODIGO.md)).*

---

## 20. Rollback

El repositorio cuenta con la etiqueta inmutable `pre-refactor` apuntando al commit inicial `6394c59` en la rama `main`.

- **Revertir un commit específico de una fase:**
  ```powershell
  git revert <commit-sha>
  ```
- **Restaurar el proyecto completo al estado exacto previo al refactor:**
  ```powershell
  git checkout main
  # o desde la rama refactor/orden-codigo:
  git reset --hard pre-refactor
  ```

---

## 21. Convenciones de código

- **JavaScript:** `'use strict'`, funciones pequeñas con responsabilidad única, `const`/`let` (sin `var`), *early returns*, nombres descriptivos en `camelCase`, constantes en `UPPER_SNAKE_CASE`.
- **Estado y espacio de nombres:** Evitar contaminar `window` con variables sueltas; exponer únicamente las fachadas públicas documentadas (`window.SALMAN` y `window.Salma`) para compatibilidad entre módulos sin bundler.
- **CSS:** Arquitectura por capas (`tokens.css`, `base.css`, `layout.css`, `components.css`, `chat.css`), nomenclatura tipo BEM (`.bloque__elemento--modificador`) y variables CSS en `:root`.
- **Seguridad DOM:** Escapar siempre cadenas dinámicas con `esc()` antes de usar `innerHTML` o preferir `textContent` cuando no haya marcado controlado.
- **Commits:** Mensajes semánticos (`chore:`, `refactor:`, `docs:`, `fix:`, `test:`) con cambios atómicos por fase.
