# Reporte de Pruebas — SALMAN Web v2

- **Fecha:** 2026-10-25
- **Fase:** Fase 0 (Pruebas de Línea Base sobre commit `6394c59`)

---

## 1. Pruebas de Contratos de API Serverless (`api/chat.js` y `api/whatsapp.js`)

| ID | Caso de Prueba | Entrada | Resultado Esperado | Resultado Obtenido | Estado |
|---|---|---|---|---|---|
| **API-01** | `GET /api/chat` rechaza método no permitido | `method: 'GET'` | `405` `{"error":"method_not_allowed"}` + `Allow: POST, OPTIONS` | `405` `{"error":"method_not_allowed"}` + `Allow: POST, OPTIONS` | **PASS** |
| **API-02** | `OPTIONS /api/chat` responde preflight | `method: 'OPTIONS'` | `204` + `Allow: POST, OPTIONS` | `204` + `Allow: POST, OPTIONS` | **PASS** |
| **API-03** | `POST /api/chat` sin arreglo `messages` | `method: 'POST', body: {}` | `400` `{"error":"messages_required"}` | `400` `{"error":"messages_required"}` | **PASS** |
| **API-04** | `POST /api/chat` sin `GEMINI_API_KEY` | `messages: [{role:'user', content:'Hola'}]` | `503` `{"error":"ai_unavailable"}` (sin exponer stack trace) | `503` `{"error":"ai_unavailable"}` | **PASS** |
| **API-05** | `GET /api/whatsapp` con `verify_token` válido | `hub.mode=subscribe&hub.verify_token=salman-demo-2026&hub.challenge=12345` | `200` `12345` (`text/plain`) | `200` `12345` | **PASS** |
| **API-06** | `GET /api/whatsapp` con `verify_token` inválido | `hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=12345` | `403` `forbidden` | `403` `forbidden` | **PASS** |
| **API-07** | `PUT /api/whatsapp` rechaza método | `method: 'PUT'` | `405` `method_not_allowed` + `Allow: GET, POST` | `405` `method_not_allowed` | **PASS** |

---

## 2. Pruebas End-to-End en Navegador Real (`chrome.exe --headless=new` vía CDP)

| ID | Flujo / Componente | Verificación Ejecutada | Resultado en Línea Base (`6394c59`) | Estado |
|---|---|---|---|---|
| **E2E-01** | Carga inicial y red | Petición a `/` y carga de CSS, JS, fuentes, manifest e imágenes | 25 recursos con `200 OK`, `0` errores 404, `0` excepciones de consola | **PASS** |
| **E2E-02** | Responsive `390x844` (Móvil) | `scrollWidth <= innerWidth`, `.nav` oculto, `#menuBtn` visible, `.mobile-bar` visible | `scrollWidth: 390`, sin overflow horizontal, barra móvil activa | **PASS** |
| **E2E-03** | Responsive `768x1024` (Tablet) | `scrollWidth <= innerWidth`, `.nav` oculto, `#menuBtn` visible | `scrollWidth: 753`, sin overflow horizontal | **PASS** |
| **E2E-04** | Responsive `1440x900` (Desktop) | `scrollWidth <= innerWidth`, `.nav` visible, `.hero-card` visible | `scrollWidth: 1425`, sin overflow horizontal | **PASS** |
| **E2E-05** | Internacionalización ES ↔ EN | `window.SALMAN.setLang('en')` y retorno a `'es'` | `html[lang]` cambia `es-CO` ↔ `en`, textos DOM y chat traducidos | **PASS** |
| **E2E-06** | Filtros de portafolio | Clic en `data-filter="residencial"` y `data-filter="all"` | Muestra 2 proyectos residenciales y luego los 4 proyectos | **PASS** |
| **E2E-07** | Galería proyecto insignia | Clic en miniatura 1 (`data-index="1"`) | Cambia `src` a `marina-900.webp`, pero asigna `alt` de Lobby (bug `HAL-05` detectado) | **OBS (`HAL-05`)** |
| **E2E-08** | Calculadora financiera | Cambio de `#calcValue` a `2000` (`input` event) | Actualiza `#calcValueOut` (`$2.000 M`), `#calcMonthly` (`$16 M`), `#calcFinanced` (`$1.600 M`) | **PASS** |
| **E2E-09** | Formulario de agendamiento | Submit vacío (valida error) y submit completo con consentimiento | Muestra `"Completa este campo."` vacío y abre URL de WhatsApp al completar | **PASS** |
| **E2E-10** | Chat Salma + Fallback local | `Salma.open()`, `Salma.send('¿Cuánto cuesta Marina Cangrejo Azul?')` | Ante `503` local de `/api/chat`, cae a `KB` local, responde y guarda en `sessionStorage` | **PASS** |
| **E2E-11** | Concierge y 5 rutas | Cambio a pestaña Concierge, clic en `comercial`, `diseno`, `gerencia`, `#conciergeHelp` (`orientacion`) y `#vipBtn` (`vip`) | Genera las 5 URLs de WhatsApp con los mensajes esperados | **PASS** |
| **E2E-12** | Código VIP y "Volver a Salma" | Ingreso de `lc-2026` en `#vipCode` y clic en `.concierge__back` | Convierte a `LC-2026` sin validar en cliente, lo inserta en el mensaje VIP y regresa a la pestaña Salma | **PASS** |
| **E2E-13** | Micrófono físico / Audio TTS | Dictado acústico real con micrófono humano | **No verificado automáticamente** (entorno headless sin micrófono físico; incluido en checklist manual) | **NO VERIFICADO (Manual)** |

*(Este reporte se actualizará en la Fase 4 con los resultados posteriores al refactor).*
