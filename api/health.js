/**
 * GET /api/health
 * Diagnóstico sin exponer claves.
 */
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  res.status(200).json({
    ok: true,
    service: 'salman-chat',
    geminiConfigured: Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim()),
    model,
    voice: 'browser-webspeech',
    timestamp: new Date().toISOString()
  });
};
