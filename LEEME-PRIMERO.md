# SALMAN web v2 · paquete completo

Esta carpeta es el sitio listo para reemplazar el contenido del repo `salman-web-v2` o subirlo a un repo nuevo.

## Incluye

- `index.html` con la landing bilingüe y el Concierge.
- `assets/` con CSS, JS e imágenes.
- `api/chat.js`: chat web con Gemini.
- `api/health.js`: diagnóstico sin exponer claves.
- `api/whatsapp.js`: webhook de WhatsApp Cloud API.
- `lib/salman.js`: prompt, reglas y datos verificados.
- `voz.html`: Voice Lab para probar micrófono, TTS, API y fallback.
- `scripts/dev-server.js`: servidor local con API y carga de `.env.local`.
- `vercel.json`: redirects `/wa` y `/asesor`, y `noindex` para el dominio de prueba.
- `.env.example`: variables de entorno de referencia.
- `PLAN-VOZ-SALMA.md` y `docs/VOICE-FREE-GEMINI.md`: plan y runbook.
- `start-demo.cmd`: servidor local para probar la voz.

## Modo voz gratis

La voz web usa **Web Speech API** del navegador para reconocimiento y síntesis. Gemini Flash se usa en la cuota gratuita de Google AI Studio. No hay telefonía, Twilio, ElevenLabs ni Dapta; por tanto, no hay cobro por minuto en la demo web.

Si no hay `GEMINI_API_KEY`, Salma sigue respondiendo con la base local y la voz funciona. Esto permite la demo incluso antes de configurar la clave.

## Configurar en Vercel

Settings → Environment Variables:

| Variable | Valor |
|---|---|
| `GEMINI_API_KEY` | tu clave de Google AI Studio (`AIza...`) |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `WHATSAPP_TOKEN` | token de Meta (cuando conectes WhatsApp) |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número de prueba |
| `WHATSAPP_VERIFY_TOKEN` | palabra secreta que tú defines |

## Orden recomendado

1. Sube esta carpeta al repo (reemplazando el contenido actual).
2. Configura `GEMINI_API_KEY` y `GEMINI_MODEL`.
3. Redeploy y prueba `https://TU-DOMINIO/api/chat`.
4. Abre `https://TU-DOMINIO/voz.html` y revisa los 5 checks.
5. Prueba el chat web, la voz y el fallback.
6. Luego configura el número de prueba de Meta y el webhook `https://TU-DOMINIO/api/whatsapp`.

## Prueba local con API

```powershell
cd C:\Users\dan\Documents\deepseek-harness\default-workspace\salman-web-v2-completo
# Crea .env.local con GEMINI_API_KEY y GEMINI_MODEL
node scripts/dev-server.js
```

Abre `http://localhost:8080/` y `http://localhost:8080/voz.html`.

## Límites

- No es una línea telefónica ni voz por WhatsApp; eso requiere telefonía y tiene costo.
- La cuota gratuita de Gemini es limitada y puede cambiar.
- Chrome/Edge tienen mejor soporte de voz que Firefox.
- La calidad de TTS depende de las voces del sistema.
- No se deben pedir datos sensibles por voz.

## Nota importante

Los nombres de proyecto y precios del prototipo son ilustrativos. El bot está programado para **no citar precios ni disponibilidad**; deriva a un asesor. Antes de publicar, reemplaza los datos por las fichas reales.
