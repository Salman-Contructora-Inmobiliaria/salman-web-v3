/**
 * GET /api/health
 * Diagnóstico sin exponer claves.
 */
const { generateReply } = require('../lib/salman');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const rawModel = (process.env.GEMINI_MODEL || 'gemini-1.5-flash').trim();
  const model = /gemini-2\.5/i.test(rawModel) ? 'gemini-1.5-flash' : rawModel;
  const isConfigured = Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim());

  const data = {
    ok: true,
    service: 'salman-chat',
    geminiConfigured: isConfigured,
    model,
    voice: 'browser-webspeech',
    timestamp: new Date().toISOString()
  };

  // Si se solicita ?test=1, ejecutar una prueba de 1 llamada rápida a Gemini
  if (req.query && req.query.test === '1' && isConfigured) {
    try {
      const test = await generateReply({
        messages: [{ role: 'user', content: 'Di OK' }],
        lang: 'es',
        channel: 'web'
      });
      data.geminiWorking = true;
      data.testReply = test.reply;
    } catch (err) {
      data.geminiWorking = false;
      data.testError = err.detail || err.message;
    }
  }

  res.status(200).json(data);
};
