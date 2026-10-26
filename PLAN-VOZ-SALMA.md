# Plan de proyecto · Salma voz + Gemini Flash

**Proyecto:** SALMAN Constructora + Inmobiliaria  
**Módulo:** Salma · chat web con voz  
**Objetivo:** validar una experiencia de voz 100% web, sin telefonía ni cobro por minuto, usando Gemini Flash en capa gratuita y Web Speech API del navegador.  
**Fecha:** 26 de octubre de 2026  
**Rol:** project manager + desarrollador de software.

## 1. Resumen ejecutivo

La voz de Salma se puede demostrar sin Dapta, Twilio, ElevenLabs ni un proveedor de telefonía:

```text
Micrófono del navegador
   ↓ Web Speech API (STT, gratis)
Transcripción
   ↓ POST /api/chat
Gemini 2.5 Flash (cuota gratuita de AI Studio)
   ↓
Respuesta de Salma
   ↓ Web Speech API (TTS, gratis)
Voz del navegador
```

Si Gemini no está configurado o falla, Salma responde con la base local y la voz sigue funcionando. Esto permite una demo sólida incluso antes de cargar la clave.

## 2. Alcance

### Incluido

- Configuración de Gemini Flash como proveedor principal.
- API serverless `/api/chat` y diagnóstico `/api/health`.
- Laboratorio `voz.html` para probar micrófono, TTS, API y fallback.
- Servidor local `scripts/dev-server.js` para probar sin Vercel.
- Fallback local de Salma si Gemini falla.
- Documentación de costos, límites y puesta en marcha.

### No incluido

- Telefonía (número PSTN, SIP, Twilio).
- Voz dentro de WhatsApp.
- Clonación de voz o TTS premium.
- Garantía de disponibilidad o SLA de la capa gratuita.
- Sustitución del contrato de producción.

## 3. Supuestos

- La demo se hace en **Chrome o Edge** de escritorio.
- El micrófono se usa en `localhost` o HTTPS.
- La cuenta de Google AI Studio tiene acceso a `gemini-2.5-flash` o al modelo que se configure.
- El cliente acepta que la capa gratuita tiene límites y puede cambiar.
- Para la demo de contrato se usa el sitio local/Vercel, no una línea telefónica.

## 4. Work breakdown

| # | Entregable | Responsable | Estado |
|---|---|---|---|
| 1 | Auditoría del chat/voz actual | Dev | Hecho |
| 2 | API `/api/health` sin exponer claves | Dev | Hecho |
| 3 | Servidor local con `/api/chat` | Dev | Hecho |
| 4 | Voice Lab de diagnóstico | Dev | Hecho |
| 5 | Fallback local probado | Dev | Hecho |
| 6 | Prueba con clave Gemini real | Cliente/Dev | Pendiente de clave |
| 7 | Prueba de micrófono real en Chrome/Edge | Cliente/Dev | Pendiente manual |
| 8 | Demo para contrato | PM/Dev | Listo para ejecutar |
| 9 | Documentación y paquete | PM | Hecho |

## 5. Cronograma de prueba

| Día | Actividad | Salida |
|---|---|---|
| Día 0 | Configurar clave gratuita en `.env.local` o Vercel. | `/api/health` con `geminiConfigured: true`. |
| Día 0 | Abrir `/voz.html`; revisar 5 checks. | Captura de diagnóstico. |
| Día 0 | Probar texto → Gemini → voz. | Respuesta hablada. |
| Día 0 | Probar micrófono → Salma → voz. | Conversación de voz. |
| Día 1 | Probar fallback quitando la clave. | Voz local sin error. |
| Día 1 | Demo de 5 minutos con el cliente. | Acta y decisión. |

## 6. Criterios de aceptación

- [ ] `/api/health` responde 200 y no expone la clave.
- [ ] Con clave, `/api/chat` responde 200 con `{ reply, model }`.
- [ ] Sin clave, `/api/chat` responde 503 y el frontend cae al fallback.
- [ ] `/voz.html` muestra micrófono, STT, TTS y contexto seguro.
- [ ] El texto de prueba se convierte en voz.
- [ ] El micrófono produce una transcripción y una respuesta hablada.
- [ ] La respuesta se lee en ES y EN.
- [ ] No se usan servicios de pago por minuto.
- [ ] La demo se ejecuta en Chrome/Edge con micrófono permitido.
- [ ] El usuario entiende que no es telefonía.

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| No hay clave Gemini para la prueba | Alta | No se prueba el modelo real | Crear clave gratuita en AI Studio; mientras tanto, fallback local. |
| Cuota gratuita agotada/429 | Media | Respuesta no disponible | Fallback local; reintento; modelo alternativo. |
| Navegador sin SpeechRecognition | Media | No hay dictado | Chrome/Edge; campo de texto; TTS igual. |
| Micrófono bloqueado | Alta | No hay voz de entrada | Permisos, localhost/HTTPS, instrucciones. |
| TTS sin voces instaladas | Media | Voz robótica o silencio | Usar voces del sistema; probar en Chrome/Edge. |
| Expectativa de telefonía | Alta | Mala interpretación comercial | Aclarar: voz web, no llamadas. |
| Datos sensibles en el micrófono | Media | Privacidad | No pedir datos sensibles; aviso y consentimiento. |

## 8. Presupuesto de la prueba

- Gemini Flash: **$0** dentro de la cuota gratuita; fuera de cuota, se corta o se cobra según cuenta.
- Web Speech API: **$0**.
- Vercel: plan gratuito para demo; límites de funciones.
- Dapta/Twilio/ElevenLabs: **no se usan**.
- Costo de la demo: **$0** en servicios, sujeto a cuotas y al plan de Vercel.

## 9. Guion de demo para el contrato

1. Abrir `/` y mostrar el chat de Salma.
2. Abrir `/voz.html`.
3. Mostrar los 5 checks: micrófono, STT, TTS, HTTPS y API.
4. Explicar: “La voz corre en el navegador; Gemini Flash responde; no hay cobro por minuto.”
5. Probar texto → respuesta hablada.
6. Probar micrófono → “Busco apartamento en Cartagena” → respuesta hablada.
7. Mostrar `/api/health` con `geminiConfigured: true`.
8. Quitar la clave (o simular fallo) y repetir: Salma sigue respondiendo en local.
9. Cerrar con alcance: demo web; telefonía/WhatsApp voz es otra fase.

## 10. Decisión pendiente

Para completar la prueba real de Gemini falta una **clave gratuita de Google AI Studio**. No se incluyó ninguna clave en el proyecto ni se usó una clave expuesta. La clave debe ir en `.env.local` o en Vercel, nunca en Git ni en el chat.
