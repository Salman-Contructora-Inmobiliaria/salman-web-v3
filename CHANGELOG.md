# Changelog — SALMAN Web v2

Todos los cambios relevantes de este repositorio se documentan en este archivo por fase.

## [2.1.0] — 2026-10-25 (Rama `refactor/orden-codigo`)

### Fase 4 · Verificación Integral y Documentación Final
- Eliminado el activo gráfico huérfano `assets/img/hero-900.webp` (134.6 KB, `HAL-12`) tras autorización explícita y fusionada la rama `refactor/orden-codigo` en `main`.
- Ejecutadas pruebas de contrato Serverless (`api/chat.js`, `api/whatsapp.js`) y pruebas End-to-End en Google Chrome Headless (CDP) sobre los viewports `390x844`, `768x1024` y `1440x900` (`0` errores 404 en 52 peticiones, `0` errores de consola, `0` referencias a rutas antiguas o al teléfono `324`).
- Actualizados `DOCUMENTACION.md`, `docs/AUDITORIA-CODIGO.md`, `docs/MIGRATION-MAP.md`, `docs/TEST-REPORT.md` y `CHANGELOG.md` con los resultados finales.

### Fase 3 · Refactorización Incremental y Corrección de Hallazgos
- **Backend y Configuración (`1ab4457`):** Actualizado el teléfono a `+57 315 775 7794` (`wa.me/573157757794`) en `lib/salman.js` y `vercel.json` (`HAL-01`). Añadida verificación opcional de firma HMAC-SHA256 (`X-Hub-Signature-256` con `WHATSAPP_APP_SECRET`) en `api/whatsapp.js` (`HAL-02`).
- **Referencias HTML (`b698c00`):** Actualizadas las etiquetas `<link>` y `<script>` y todos los enlaces telefónicos y de WhatsApp a `+57 315 775 7794` en `index.html` (`HAL-01`).
- **Modularización CSS (`f3076fe`):** Dividida la hoja de estilos en 5 capas bajo `assets/css/` (`tokens.css`, `base.css`, `layout.css`, `components.css`, `chat.css`) usando `git mv` (`HAL-06`).
- **Modularización de Chat, Voz y Concierge (`5fbfd58`):** Dividido el módulo de chat con `git mv` en `assets/js/chat/voice.js`, `assets/js/chat/concierge.js` y `assets/js/chat/chat.js`. Eliminada la duplicación de `.msg__cta` (`HAL-08`) y el listener `keydown(Enter)` redundante (`HAL-09`).
- **Modularización de UI (`25ec95b`):** Dividida la lógica de interfaz con `git mv` en `assets/js/ui/navigation.js`, `assets/js/ui/forms.js`, `assets/js/ui/calculator.js`, `assets/js/ui/reveal.js` y `assets/js/main.js`. Corregido el desfase de índice `alt` en la galería insignia (`HAL-05`) y unificados los dos listeners `click` de `document` (`HAL-09`).
- **Núcleo transversal (`41895de`):** Creados `assets/js/core/dom.js`, `assets/js/core/events.js` y `assets/js/core/storage.js` (`HAL-07`, `HAL-10`).
- **Internacionalización (`2cc49d2`):** Dividido el diccionario bilingüe con `git mv` en `assets/js/i18n/es.js`, `assets/js/i18n/en.js` y `assets/js/i18n/index.js` (`HAL-06`).
- **Capa de Datos (`f6e4bd7`):** Dividida la capa de datos con `git mv` en `assets/js/data/projects.js`, `assets/js/data/concierge.js` y `assets/js/data/kb.js`, actualizando el teléfono en `kb.js` (`HAL-01`, `HAL-06`).

### Fase 2 · Creación de Estructura y Configuración Base (`2684dce`)
- Creadas las carpetas objetivo (`assets/css`, `assets/js/{core,data,i18n,ui,chat}`, `docs`) y el módulo `assets/js/core/config.js` con el teléfono oficial `+57 315 775 7794`.

### Fase 0 y Fase 1 · Auditoría, Línea Base y Plan (`6394c59`, `4946ed2`)
- Inicializado commit base `6394c59` y etiqueta `pre-refactor` con los 37 archivos originales intactos.
- Creada la rama de trabajo `refactor/orden-codigo`.
- Ejecutada auditoría inicial y creados los entregables `DOCUMENTACION.md`, `README.md` y `docs/*.md`.
