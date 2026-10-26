# Test report · Salma voz + Gemini Flash

**Fecha:** 26 de octubre de 2026  
**Entorno:** Windows, Node 24, Chrome headless 1440×1000, servidor local `http://127.0.0.1:8081/`.  
**Clave Gemini:** no configurada en este entorno.

## Resultados

| Prueba | Resultado | Evidencia |
|---|---|---|
| `GET /api/health` | 200 | `geminiConfigured:false`, `model:gemini-2.5-flash` |
| `POST /api/chat` sin clave | 503 | Fallback esperado |
| `voz.html` | 200 | Laboratorio carga |
| SpeechRecognition | Disponible | `typeof SpeechRecognition === 'function'` |
| speechSynthesis | Disponible | Objeto presente |
| Contexto seguro | Sí | `isSecureContext:true` |
| Micrófono / permisos | API disponible | `navigator.mediaDevices.getUserMedia` |
| TTS en headless | No permitido | `not-allowed`; limitación del entorno headless |
| Texto → fallback | OK | Respuesta local mostrada |
| Chat principal → fallback | OK | Salma responde localmente tras 503 |
| Errores de consola | 0 | Runtime exceptions vacías |
| Voz real por micrófono | No verificada | Requiere Chrome/Edge con micrófono y permiso |

## Interpretación

- La arquitectura de voz está implementada y el fallback funciona.
- La TTS no se pudo validar en headless porque Chrome bloquea la síntesis sin interacción/audio; no es un fallo del código.
- La prueba real de Gemini queda pendiente de una `GEMINI_API_KEY` gratuita.
- La prueba real de micrófono debe hacerse en Chrome/Edge con un humano hablando.

## Prueba pendiente con clave

1. Crear `.env.local` con `GEMINI_API_KEY` y `GEMINI_MODEL=gemini-2.5-flash`.
2. Reiniciar `node scripts/dev-server.js`.
3. Abrir `/api/health` y confirmar `geminiConfigured:true`.
4. Abrir `/voz.html`.
5. Probar texto y micrófono.
6. Medir latencia percibida y calidad de voz.
7. Repetir en Vercel.

## Conclusión

**Listo para demo de fallback y diagnóstico.** La prueba de Gemini real y la voz por micrófono requieren la clave y una sesión interactiva. No se debe afirmar que Gemini respondió si no se ejecutó con clave.
