# Auditoría · Salma voz + Gemini Flash

**Fecha:** 26 de octubre de 2026  
**Alcance:** `salman-web-v2-completo` · chat web, voz, API, fallback.  
**Modo de prueba:** local, sin `GEMINI_API_KEY`.

## Resumen

La arquitectura de voz web está implementada y es viable para una demo sin cobro por minuto: el navegador hace STT/TTS y Gemini Flash responde en la capa gratuita. El fallback local funciona cuando no hay clave. La prueba real de Gemini y la voz por micrófono quedan pendientes de una sesión con clave y micrófono físico.

## Hallazgos

| ID | Severidad | Categoría | Ubicación | Evidencia | Impacto | Recomendación | Estado |
|---|---|---|---|---|---|---|---|
| V-01 | Alta | Dependencia | `api/chat.js`, `.env.local` | `geminiConfigured:false` en la prueba | No se validó Gemini real | Configurar clave gratuita y repetir | Bloqueado por clave |
| V-02 | Alta | Alcance | `PLAN-VOZ-SALMA.md` | La demo es web, no telefonía | El cliente podría esperar llamadas | Aclarar alcance; telefonía es fase aparte | Abierto |
| V-03 | Media | Compatibilidad | `chat.js`, `voz.html` | SpeechRecognition no existe en Firefox | La voz no funciona en todos los navegadores | Chrome/Edge; campo de texto y TTS | Aceptado |
| V-04 | Media | TTS | `chat.js`, `voz.html` | Headless devuelve `not-allowed` | No se pudo validar audio automático | Probar con gesto humano en Chrome/Edge | Pendiente manual |
| V-05 | Media | Cuota | `api/chat.js` | Gemini free tier | 429/agotamiento | Fallback local y modelo alternativo | Mitigado |
| V-06 | Media | Rate limit | `api/chat.js` | Map en memoria | No es distribuido | Límite durable en producción | Abierto |
| V-07 | Media | Privacidad | `chat.js`, `voz.html` | Micrófono sin aviso explícito de datos | Riesgo de percepción | Aviso de voz local + consentimiento | Abierto |
| V-08 | Baja | Pruebas | Repo | Sin suite automatizada | Regresiones | Playwright/Vitest en fase 2 | Abierto |
| V-09 | Baja | Telemetría | `chat.js` | `track` sin backend | No hay métricas reales | Conectar analítica | Abierto |
| V-10 | Baja | Documentación | `LEEME` | Requiere clave y Node | Fricción de demo | Guía paso a paso | Hecho |

## Pruebas ejecutadas

- `/api/health` 200, `geminiConfigured:false`.
- `/api/chat` 503 sin clave; frontend cae al fallback.
- `voz.html` 200; STT/TTS/secure/mic API detectados.
- Texto → fallback → respuesta visible.
- Chat principal → fallback local sin errores de consola.
- No se pudo validar TTS en headless (`not-allowed`).
- No se pudo validar micrófono real.

## Conclusión

Apto para demo de arquitectura y fallback. No afirmar que Gemini respondió hasta configurar la clave y ejecutar `/api/health` con `geminiConfigured:true`. No presentar como telefonía.
