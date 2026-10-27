/**
 * GET /api/health
 * Diagnóstico del servicio y estado de Gemini AI.
 */
const { generateReply } = require('../lib/salman');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const rawModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
  const model = /gemini-(3\.5|3\.0)/i.test(rawModel) || !rawModel ? 'gemini-2.5-flash' : rawModel;
  const isConfigured = Boolean(apiKey);

  const data = {
    ok: true,
    service: 'salman-chat',
    geminiConfigured: isConfigured,
    model,
    voice: 'browser-webspeech',
    timestamp: new Date().toISOString()
  };

  if (req.query && req.query.list === '1' && isConfigured) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
      const listData = await resp.json();
      data.availableModels = (listData.models || []).map(m => m.name.replace('models/', ''));
    } catch (e) {
      data.listError = e.message;
    }
  }

  if (req.query && req.query.test === '1' && isConfigured) {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Hola, di Salma lista' }] }]
          })
        }
      );
      const text = await resp.text();
      data.directStatus = resp.status;
      data.directResponse = text;
      data.geminiWorking = resp.ok;
    } catch (err) {
      data.geminiWorking = false;
      data.error = err.message;
    }
  }

  res.status(200).json(data);
};
