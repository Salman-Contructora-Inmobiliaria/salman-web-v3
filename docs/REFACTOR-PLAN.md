# Plan de Refactorización — SALMAN Web v2

## 1. Resumen del Plan por Fases

- **Fase 0 · Auditoría y Línea Base (Completada):**
  - Inicialización de commit base `6394c59` y etiqueta `pre-refactor`.
  - Creación de rama `refactor/orden-codigo`.
  - Ejecución de auditoría estática y dinámica (API + Chrome Headless CDP en `390x844`, `768x1024`, `1440x900`).
  - Creación de `DOCUMENTACION.md`, `README.md`, `docs/AUDITORIA-CODIGO.md` y `docs/BASELINE.md`.
- **Fase 1 · Presentación del Plan y Pausa para Aprobación (Actual):**
  - Revisión de hallazgos, propuesta de árbol objetivo, mapa de migración y comando de creación de carpetas.
- **Fase 2 · Creación de Carpetas:**
  - Creación de `assets/css`, `assets/js/core`, `assets/js/data`, `assets/js/i18n`, `assets/js/ui`, `assets/js/chat` junto con el primer archivo de cada carpeta en el mismo commit (sin carpetas vacías ni `.gitkeep`).
- **Fase 3 · Movimiento y Refactorización Incremental (10 pasos):**
  1. `assets/js/core/config.js` (unificando teléfono oficial `+57 315 775 7794` / `573157757794`).
  2. `assets/js/data/projects.js`, `concierge.js` y `kb.js` (usando `git mv` sobre `data.js` para conservar historial en el archivo principal y extrayendo los sub-módulos).
  3. `assets/js/i18n/es.js`, `en.js` e `index.js` (usando `git mv` desde `i18n.js`).
  4. `assets/js/core/dom.js`, `events.js` y `storage.js`.
  5. `assets/js/ui/navigation.js`, `forms.js`, `calculator.js` y `reveal.js` + `assets/js/main.js` (usando `git mv` desde `app.js`).
  6. `assets/js/chat/chat.js`, `voice.js` y `concierge.js` (usando `git mv` desde `chat.js`).
  7. División de `assets/css/styles.css` en `tokens.css`, `base.css`, `layout.css`, `components.css` y `chat.css` (usando `git mv`).
  8. Actualización de `index.html` (`<link>`, `<script>` y teléfono `+57 315 775 7794`).
  9. Revisión y actualización de teléfono en `lib/salman.js` y `vercel.json`, manteniendo intactos los contratos de `api/chat.js` y `api/whatsapp.js`.
  10. Limpieza final, verificación de cero referencias a rutas antiguas y actualización documental.
- **Fase 4 · Verificación Exhaustiva:**
  - Ejecución de pruebas automatizadas de contratos API, verificación E2E en Chrome Headless (`390`, `768`, `1440`), validación de las 5 rutas del Concierge, flujo VIP, voz, i18n, formularios, calculadora y actualización de `docs/TEST-REPORT.md` y `docs/AUDITORIA-CODIGO.md`.

---

## 2. Comando Exacto de Creación de Carpetas (PowerShell)

```powershell
New-Item -ItemType Directory -Force -Path `
  assets/css, `
  assets/js/core, `
  assets/js/data, `
  assets/js/i18n, `
  assets/js/ui, `
  assets/js/chat, `
  docs
```

---

## 3. Evaluación de Simplificación de Estructura

Todas las carpetas propuestas (`assets/css`, `assets/js/core`, `assets/js/data`, `assets/js/i18n`, `assets/js/ui`, `assets/js/chat`, `docs`) contienen **entre 3 y 8 archivos reales con responsabilidad clara** (ninguna carpeta queda con 1 solo archivo trivial). Por tanto, la estructura objetivo está plenamente justificada sin sobre-ingeniería.
