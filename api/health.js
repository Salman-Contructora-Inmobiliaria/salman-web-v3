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

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
  const isConfigured = Boolean(apiKey);

  const data = {
    ok: true,
    service: 'salman-chat',
    geminiConfigured: isConfigured,
    model,
    voice: 'browser-webspeech',
    timestamp: new Date().toISOString()
  };

  // Listar modelos disponibles para esta clave
  if (req.query && req.query.models === '1' && isConfigured) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
      const body = await resp.json();
      data.availableModels = (body.models || []).map(m => m.name.replace('models/', ''));
      if (body.error) data.modelsError = body.error;
    } catch (e) {
      data.modelsFetchError = e.message;
    }
  }

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
