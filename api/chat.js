/**
 * POST /api/chat
 * Body: { messages: [{role:'user'|'assistant', content:string}], lang:'es'|'en' }
 * Respuesta: { reply, model }
 *
 * Nunca expone la API key: vive en process.env.GEMINI_API_KEY (Vercel).
 */

const { generateReply } = require('../lib/salman');

const hits = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_HITS = 25;

function rateLimited(ip) {
  const now = Date.now();
  const bucket = hits.get(ip) || [];
  const recent = bucket.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, value] of hits) {
      if (!value.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_HITS;
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'rate_limited' });

  const body = req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) return res.status(400).json({ error: 'messages_required' });

  const lang = body.lang === 'en' ? 'en' : 'es';

  try {
    const result = await generateReply({ messages, lang, channel: 'web' });
    return res.status(200).json(result);
  } catch (error) {
    console.error('[api/chat]', error.code || error.message, error.detail || '');
    return res.status(503).json({
      error: 'ai_unavailable',
      message: error.message,
      detail: error.detail || null
    });
  }
};
