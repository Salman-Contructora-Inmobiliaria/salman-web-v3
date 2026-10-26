# SALMAN web v3

Sitio bilingüe de SALMAN Constructora + Inmobiliaria, con:

- landing comercial;
- chat **Salma** con Gemini Flash;
- pestaña **Concierge** a WhatsApp;
- voz web con Web Speech API;
- `voz.html`: Voice Lab de diagnóstico;
- API serverless `/api/chat`, `/api/health` y `/api/whatsapp`.

## Despliegue

Vercel → Import Project → Framework **Other** → Root `./` → Deploy.

Variables:

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=salman-demo-2026
WHATSAPP_API_VERSION=v21.0
```

Sin `GEMINI_API_KEY`, Salma responde con la base local; la voz sigue funcionando.

## Prueba local

```powershell
node scripts/dev-server.js
```

- Sitio: http://localhost:8080/
- Voice Lab: http://localhost:8080/voz.html
- Health: http://localhost:8080/api/health

Crea `.env.local` (no se sube a Git) para la clave.

## Documentación

- `LEEME-PRIMERO.md`
- `PLAN-VOZ-SALMA.md`
- `docs/VOICE-FREE-GEMINI.md`
- `docs/TEST-REPORT-VOICE.md`
- `docs/AUDITORIA-VOZ.md`

## Nota

El proyecto usa `X-Robots-Tag: noindex, nofollow` mientras sea demostración. Retirar cuando el cliente autorice indexación.

No se incluyen claves ni documentos personales/financieros de terceros.
