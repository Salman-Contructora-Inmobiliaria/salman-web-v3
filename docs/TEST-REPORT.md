# Reporte de Pruebas — SALMAN Web v2

- **Fecha:** 2026-10-25
- **Fases cubiertas:** Fase 0 (Línea Base `6394c59`) y Fase 4 (Post-Refactor en `refactor/orden-codigo`)

---

## 1. Pruebas de Contratos de API Serverless (`api/chat.js` y `api/whatsapp.js`)

| ID | Caso de Prueba | Entrada | Resultado Esperado | Resultado Línea Base | Resultado Post-Refactor | Estado |
|---|---|---|---|---|---|---|
| **API-01** | `GET /api/chat` rechaza método no permitido | `method: 'GET'` | `405` `{"error":"method_not_allowed"}` + `Allow: POST, OPTIONS` | `405` | `405` | **PASS** |
| **API-02** | `OPTIONS /api/chat` responde preflight | `method: 'OPTIONS'` | `204` + `Allow: POST, OPTIONS` | `204` | `204` | **PASS** |
| **API-03** | `POST /api/chat` sin arreglo `messages` | `method: 'POST', body: {}` | `400` `{"error":"messages_required"}` | `400` | `400` | **PASS** |
| **API-04** | `POST /api/chat` sin `GEMINI_API_KEY` | `messages: [{role:'user', content:'Hola'}]` | `503` `{"error":"ai_unavailable"}` (sin exponer stack trace) | `503` | `503` | **PASS** |
| **API-05** | `POST /api/chat` con mock Gemini `200 OK` | `messages: [{role:'user', content:'Hola'}], lang: 'es'` | `200` `{"reply":"...","model":"gemini-2.5-flash"}` | `200` | `200` | **PASS** |
| **API-06** | `GET /api/whatsapp` con `verify_token` válido | `hub.mode=subscribe&hub.verify_token=salman-demo-2026&hub.challenge=12345` | `200` `12345` (`text/plain`) | `200` `12345` | `200` `12345` | **PASS** |
| **API-07** | `GET /api/whatsapp` con `verify_token` inválido | `hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=12345` | `403` `forbidden` | `403` `forbidden` | `403` `forbidden` | **PASS** |
| **API-08** | `PUT /api/whatsapp` rechaza método | `method: 'PUT'` | `405` `method_not_allowed` + `Allow: GET, POST` | `405` | `405` | **PASS** |
| **API-09** | `POST /api/whatsapp` con `WHATSAPP_APP_SECRET` y firma HMAC inválida / válida (`HAL-02`) | `x-hub-signature-256` inválida vs firma HMAC-SHA256 válida | `403` `invalid_signature` / `200` `EVENT_RECEIVED` | N/A | `403` / `200` | **PASS** |

---

## 2. Pruebas End-to-End en Navegador Real (`chrome.exe --headless=new` vía CDP)

| ID | Flujo / Componente | Verificación Ejecutada | Resultado en Línea Base (`6394c59`) | Resultado Post-Refactor (`refactor/orden-codigo`) | Estado Final |
|---|---|---|---|---|---|
| **E2E-01** | Carga inicial y red | Petición a `/` y carga de hojas CSS, módulos JS, fuentes, manifest e imágenes | 25 recursos con `200 OK`, `0` 404 | 52 peticiones con `200 OK`, `0` 404, `0` errores de consola | **PASS** |
| **E2E-02** | Responsive `390x844` (Móvil) | `scrollWidth <= innerWidth`, `.nav` oculto, `#menuBtn` visible, `.mobile-bar` visible | `scrollWidth: 390`, sin overflow | `scrollWidth: 390`, sin overflow horizontal | **PASS** |
| **E2E-03** | Responsive `768x1024` (Tablet) | `scrollWidth <= innerWidth`, `.nav` oculto, `#menuBtn` visible | `scrollWidth: 753`, sin overflow | `scrollWidth: 753`, sin overflow horizontal | **PASS** |
| **E2E-04** | Responsive `1440x900` (Desktop) | `scrollWidth <= innerWidth`, `.nav` visible, `.hero-card` visible | `scrollWidth: 1425`, sin overflow | `scrollWidth: 1425`, sin overflow horizontal | **PASS** |
| **E2E-05** | Internacionalización ES ↔ EN | `window.SALMAN.setLang('en')` y retorno a `'es'` | `html[lang]` cambia `es-CO` ↔ `en`, textos traducidos | `html[lang]` cambia `es-CO` ↔ `en`, textos y chat traducidos | **PASS** |
| **E2E-06** | Filtros de portafolio | Clic en `data-filter="residencial"` y `data-filter="all"` | Muestra 2 residenciales y luego los 4 proyectos | Muestra 2 residenciales y luego los 4 proyectos | **PASS** |
| **E2E-07** | Galería proyecto insignia (`HAL-05`) | Clic en miniatura 1 (`data-index="1"`) | Asignaba `alt` de Lobby por off-by-one (`HAL-05`) | Asigna `alt` correcto: `"Marina Cangrejo Azul — vista exterior al atardecer frente a la marina"` | **PASS (Corregido)** |
| **E2E-08** | Calculadora financiera | Cambio de `#calcValue` a `2000` (`input` event) | `#calcValueOut`: `$2.000 M`, `#calcMonthly`: `$16 M`, `#calcFinanced`: `$1.600 M` | `#calcValueOut`: `$2.000 M`, `#calcMonthly`: `$16 M`, `#calcFinanced`: `$1.600 M` | **PASS** |
| **E2E-09** | Formulario de agendamiento (`HAL-01`) | Submit vacío (valida error) y submit completo con consentimiento | Abría `wa.me/573244286166` (teléfono antiguo) | Valida vacío y abre `https://wa.me/573157757794?text=...` | **PASS (Corregido)** |
| **E2E-10** | Chat Salma + Fallback local | `Salma.open()`, `Salma.send('¿Cuánto cuesta Marina Cangrejo Azul?')` | Cae a `KB` local, responde y guarda en `sessionStorage` | Cae a `KB` local, responde y guarda en `sessionStorage` | **PASS** |
| **E2E-11** | Concierge y 5 rutas (`HAL-01`) | Cambio a pestaña Concierge, clic en `comercial`, `diseno`, `gerencia`, `#conciergeHelp` (`orientacion`) y `#vipBtn` (`vip`) | Generaba URLs apuntando al `324` | Genera las 5 URLs apuntando a `https://wa.me/573157757794?text=...` | **PASS (Corregido)** |
| **E2E-12** | Código VIP y "Volver a Salma" | Ingreso de `lc-2026` en `#vipCode` y clic en `.concierge__back` | Convierte a `LC-2026` sin validar en cliente y regresa a Salma | Convierte a `LC-2026` sin validar en cliente, abre `wa.me/573157757794` y regresa a Salma | **PASS** |
| **E2E-13** | Micrófono físico / Audio TTS | Dictado acústico real con micrófono humano | **No verificado automáticamente** | **No verificado automáticamente** (incluido en checklist manual) | **NO VERIFICADO (Manual)** |
