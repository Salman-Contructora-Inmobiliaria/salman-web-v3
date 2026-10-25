# Matriz de Riesgos y Plan de Rollback — SALMAN Web v2

| # | Cambio / Fase | Riesgo identificado | Probabilidad | Impacto | Mitigación y Prueba de Verificación | Comando de Rollback |
|---|---|---|---|---|---|---|
| 1 | **Unificación del teléfono a `+57 315 775 7794`** (`core/config.js`, `index.html`, `data/kb.js`, `lib/salman.js`, `vercel.json`) | Olvidar alguna referencia al `324` o romper el formato de URL `https://wa.me/573157757794`. | Baja | Alto | Búsqueda exhaustiva post-cambio (`grep` / script Node) verificando `0` apariciones de `3244286166` o `324 428 6166` y prueba E2E de todos los enlaces WhatsApp y las 5 rutas del Concierge. | `git revert <commit-sha>` |
| 2 | **División de `data.js` e `i18n.js` en submódulos** (`data/{projects,concierge,kb}.js`, `i18n/{es,en,index}.js`) | `ReferenceError` si un módulo intenta leer `PROJECTS`, `CONCIERGE`, `KB` o `TEXT` antes de que se cargue su archivo en `index.html`. | Media | Alto | Cargar `core/config.js`, `data/*` e `i18n/*` antes de `ui/*`, `chat/*` y `main.js` en `index.html`; exponer referencias tanto en `window.SALMAN` como en constantes globales compatibles. Verificar `0` excepciones en Chrome Headless. | `git revert <commit-sha>` |
| 3 | **División de `app.js` en `core/*`, `ui/*` y `main.js`** | Pérdida de estado compartido (`state.lang`, `state.filter`, `state.lead`) o rotura de `window.SALMAN` consumido por `chat.js`. | Media | Alto | Centralizar el estado de aplicación en `window.SALMAN` desde `core/` y conservar intacta la firma de `window.SALMAN` (`t`, `tf`, `track`, `money`, `num`, `projectById`, `projectName`, `lang`, `setLang`, `openProject`, `openLead`, `showToast`, `whatsapp`). | `git revert <commit-sha>` |
| 4 | **División de `chat.js` en `chat/{chat,voice,concierge}.js`** | Rotura de la comunicación entre pestañas (`Salma · IA` ↔ `Concierge`), del disparo de `speak(text)` en modo voz o de `window.Salma`. | Media | Alto | Mantener un objeto de estado compartido `SalmaState` / referencias DOM `el` entre `chat/voice.js`, `chat/concierge.js` y `chat/chat.js`, conservando `renderConcierge()`, `setChatTab()`, `openArea()`, `openVIP()` y `window.Salma`. | `git revert <commit-sha>` |
| 5 | **División de `styles.css` en 5 hojas por capas** (`tokens.css`, `base.css`, `layout.css`, `components.css`, `chat.css`) | Alteración de la cascada CSS (especialmente media queries `@media (max-width: ...)` que sobrescriben reglas de layout, componentes y chat). | Media | Medio | Conservar el orden exacto de especificidad y ubicar los bloques `@media` al final de cada capa correspondiente (o al final de la cascada) verificando en Chrome Headless (`390x844`, `768x1024`, `1440x900`) que los estilos computados (`getComputedStyle`) sean idénticos a la línea base. | `git revert <commit-sha>` |
| 6 | **Actualización de referencias en `index.html`** | Error 404 en algún `<link>` o `<script>` por ruta mal escrita. | Baja | Alto | Verificación automática en servidor HTTP local + Chrome CDP comprobando `status === 200` en el 100% de los recursos cargados y `0` referencias a rutas antiguas. | `git revert <commit-sha>` |

---

## Procedimiento de Rollback Total

Si en cualquier momento se requiere volver al estado exacto previo al inicio del trabajo:

```powershell
git checkout refactor/orden-codigo
git reset --hard pre-refactor
```
O cambiando directamente a la rama `main` intacta:
```powershell
git checkout main
```
