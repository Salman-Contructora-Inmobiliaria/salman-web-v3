# Salma voz + Gemini Flash gratis

## Arquitectura

```text
Usuario
  │ micrófono
  ▼
Web Speech API · SpeechRecognition (navegador)
  │ texto
  ▼
POST /api/chat
  │
  ├─ GEMINI_API_KEY configurada → Gemini 2.5 Flash → reply
  └─ sin clave / error / 429 → fallback local de Salma
  │
  ▼
Web Speech API · speechSynthesis (navegador)
  │
  ▼
Voz de Salma
```

No hay telefonía, Twilio, ElevenLabs ni Dapta. La voz de entrada y salida la pone el navegador. Gemini Flash se usa en la capa gratuita de Google AI Studio.

## Requisitos

- Chrome o Edge actualizado.
- Micrófono y permiso del navegador.
- `localhost` o HTTPS.
- Cuenta de Google AI Studio para la clave gratuita (opcional para modo local).
- Node 20+ para el servidor local con API.
- Vercel para producción serverless.

## Configurar la clave gratuita

1. Entra a [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Crea una API key.
3. En local, crea `.env.local` en la raíz de `salman-web-v2-completo`:

```env
GEMINI_API_KEY=tu_clave
GEMINI_MODEL=gemini-2.5-flash
```

4. No subas `.env.local` a Git.
5. Reinicia el servidor.

En Vercel:

- Project → Settings → Environment Variables.
- `GEMINI_API_KEY` = clave.
- `GEMINI_MODEL` = `gemini-2.5-flash`.
- Redeploy.

## Ejecutar

### Opción A · servidor local con API

```powershell
cd C:\Users\dan\Documents\deepseek-harness\default-workspace\salman-web-v2-completo
node scripts/dev-server.js
```

Abre:

- Sitio: `http://localhost:8080/`
- Voice Lab: `http://localhost:8080/voz.html`
- Health: `http://localhost:8080/api/health`

### Opción B · `start-demo.cmd`

Hace lo mismo si Node está en el PATH. Si no, cae a Python y solo sirve el frontend (sin API).

## Diagnóstico

`GET /api/health`:

```json
{
  "ok": true,
  "geminiConfigured": true,
  "model": "gemini-2.5-flash",
  "voice": "browser-webspeech"
}
```

No devuelve la clave. Si `geminiConfigured` es `false`, el chat usa el fallback local.

## Prueba manual

1. Abre `/voz.html`.
2. Revisa los checks:
   - Micrófono / permisos.
   - Reconocimiento de voz.
   - Síntesis de voz.
   - Contexto seguro.
   - Gemini API.
3. Pulsa **Probar voz**: debe leerse una frase.
4. Pulsa **Hablar con Salma**, permite el micrófono y di: “Busco apartamento en Cartagena”.
5. Salma debe transcribir, responder y leer la respuesta.
6. Pulsa **Probar Gemini** para verificar la API.
7. Si no hay clave, el laboratorio mostrará “FALTA KEY” y usará el fallback local.

## Límites reales

- **No es una línea telefónica.** Para llamadas o voz por WhatsApp se necesita telefonía (Twilio, Meta, etc.) y eso sí tiene costo.
- **La capa gratuita de Gemini tiene cuotas.** No es ilimitada ni tiene SLA; si se agota, el fallback local sigue.
- **Web Speech API depende del navegador.** Chrome/Edge tienen mejor soporte; Firefox no tiene SpeechRecognition; Safari es parcial.
- **TTS depende de las voces del sistema.** La calidad varía por dispositivo.
- **La transcripción puede fallar** con ruido, acento o micrófono deficiente.
- **Privacidad:** el micrófono se activa solo tras permiso; no se piden datos sensibles.
- **No hay garantía de latencia <1 s.** Depende de red, modelo y dispositivo.

## Seguridad

- La clave vive en el servidor, nunca en `voz.html` ni en `chat.js`.
- `.env.local` y `.env` están en `.gitignore`.
- `api/health` solo informa un booleano.
- No se piden tarjetas, cédulas ni documentos.
- El rate limit de `/api/chat` es básico y en memoria; para producción se necesita un límite distribuido.

## Costos

| Componente | Costo en demo |
|---|---|
| Web Speech API (STT/TTS) | $0 |
| Gemini Flash dentro de cuota gratuita | $0 |
| Vercel plan gratuito | $0 dentro de límites |
| Dapta / Twilio / ElevenLabs | No se usan |
| Telefonía real | No incluida; tendría costo |

## Comparación con Dapta

Dapta y plataformas similares ofrecen agentes de voz gestionados, telefonía y cobro por uso. Esta propuesta es distinta:

- **Autocontenida:** el navegador hace STT/TTS.
- **Sin costo por minuto:** no hay proveedor de voz por minuto.
- **Gemini Flash free:** LLM en capa gratuita.
- **Menos alcance:** no hay llamadas telefónicas ni voz en WhatsApp.
- **Más control:** el cliente es dueño del código y de la clave.

Para una demo de contrato, esta arquitectura es suficiente. Para un contact center, no.
