# SALMAN web v3 · paquete completo

Esta carpeta es el sitio organizado por Giselle Ulloa, con el Voice Lab y la API de SALMAN, listo para el repo `salman-web-v3`.

## Incluye

- `index.html` con la landing bilingüe y el Concierge.
- `assets/` con CSS, JS e imágenes.
- `api/chat.js`: chat web con Gemini.
- `api/whatsapp.js`: webhook de WhatsApp Cloud API.
- `lib/salman.js`: prompt, reglas y datos verificados.
- `vercel.json`: redirects `/wa` y `/asesor`, y `noindex` para el dominio de prueba.
- `.env.example`: variables de entorno de referencia.
- `voz.html`: laboratorio de voz.
- `api/health.js`: diagnóstico de Gemini.
- `scripts/dev-server.js`: servidor local con API.
- `start-demo.cmd`: servidor local para probar la voz.

## No incluye

- La propuesta comercial, el deck, el PDF ni documentos internos.
- Claves o secretos. La API key se configura en Vercel.

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
4. Prueba el chat web y la voz.
5. Luego configura el número de prueba de Meta y el webhook `https://TU-DOMINIO/api/whatsapp`.

## Nota importante

Los nombres de proyecto y precios del prototipo son ilustrativos. El bot está programado para **no citar precios ni disponibilidad**; deriva a un asesor. Antes de publicar, reemplaza los datos por las fichas reales.
