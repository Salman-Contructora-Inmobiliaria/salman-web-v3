/**
 * Webhook de WhatsApp Cloud API (Meta).
 *
 * GET  /api/whatsapp  → verificación del webhook
 * POST /api/whatsapp  → mensajes entrantes
 *
 * Variables de entorno en Vercel:
 *   WHATSAPP_TOKEN              token permanente (System User) o temporal
 *   WHATSAPP_PHONE_NUMBER_ID    ID del número (no el número)
 *   WHATSAPP_VERIFY_TOKEN       palabra secreta que tú defines
 *   WHATSAPP_APP_SECRET         opcional, App Secret de Meta para validar X-Hub-Signature-256
 *   WHATSAPP_API_VERSION        opcional, por defecto v21.0
 *
 * Importante: para la demo usa el número de prueba de Meta y registra como
 * destinatarios los teléfonos del asesor y del equipo (máx. 5). No migres el
 * +57 315 775 7794 real a la API sin plan de coexistencia.
 */

const crypto = require('crypto');
const { generateReply } = require('../lib/salman');

const seen = new Map();
const SEEN_TTL = 10 * 60 * 1000;

function alreadySeen(id) {
  const now = Date.now();
  if (seen.has(id)) return true;
  seen.set(id, now);
  if (seen.size > 500) {
    for (const [key, ts] of seen) if (now - ts > SEEN_TTL) seen.delete(key);
  }
  return false;
}

function parseBody(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return null; }
  }
  return raw;
}

function verifySignature(req) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true;
  const sigHeader = req.headers?.['x-hub-signature-256'];
  if (!sigHeader || typeof sigHeader !== 'string' || !sigHeader.startsWith('sha256=')) return false;
  const rawPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawPayload).digest('hex')}`;
  const a = Buffer.from(sigHeader);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function extractText(message) {
  if (!message) return '';
  if (message.text?.body) return message.text.body;
  if (message.button?.text) return message.button.text;
  if (message.interactive?.button_reply?.title) return message.interactive.button_reply.title;
  if (message.interactive?.list_reply?.title) return message.interactive.list_reply.title;
  return '';
}

function detectLang(text) {
  return /\b(hello|hi|hey|price|project|invest|buy|visit|english|apartment|house)\b/i.test(text) ? 'en' : 'es';
}

async function sendWhatsApp(to, text) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION || 'v21.0';
  if (!token || !phoneId) throw new Error('whatsapp_env_missing');

  const response = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: String(text).slice(0, 4000), preview_url: false }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`whatsapp_send_${response.status}: ${detail.slice(0, 300)}`);
  }
}

module.exports = async (req, res) => {
  // 1) Verificación del webhook (Meta lo llama una vez al configurar).
  if (req.method === 'GET') {
    const url = new URL(req.url, 'https://salman.local');
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(challenge || 'ok');
    }
    return res.status(403).send('forbidden');
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send('method_not_allowed');
  }

  if (!verifySignature(req)) {
    return res.status(403).send('invalid_signature');
  }

  const body = parseBody(req.body);
  if (!body) return res.status(200).send('EVENT_RECEIVED');

  try {
    const value = body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];
    if (!message) return res.status(200).send('EVENT_RECEIVED');
    if (alreadySeen(message.id)) return res.status(200).send('EVENT_RECEIVED');

    const from = message.from;
    const text = extractText(message);
    const lang = detectLang(text);

    if (!text) {
      if (message.type === 'audio') {
        await sendWhatsApp(from, 'Por ahora puedo leerte en texto. Pronto podré escuchar notas de voz. ¿Me escribes tu pregunta?');
      }
      return res.status(200).send('EVENT_RECEIVED');
    }

    const { reply } = await generateReply({
      messages: [{ role: 'user', content: text }],
      lang,
      channel: 'whatsapp'
    });

    await sendWhatsApp(from, reply);
  } catch (error) {
    console.error('[api/whatsapp]', error.code || error.message, error.detail || '');
  }

  // Meta reintenta si no recibe 200; devolvemos 200 incluso ante error para no duplicar.
  return res.status(200).send('EVENT_RECEIVED');
};
