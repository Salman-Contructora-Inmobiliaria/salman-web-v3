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

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const testModel = req.query.test || null;
  const isConfigured = Boolean(apiKey);

  const data = {
    ok: true,
    service: 'salman-chat',
    geminiConfigured: isConfigured,
    voice: 'browser-webspeech',
    timestamp: new Date().toISOString()
  };

  if (testModel && isConfigured) {
    const target = testModel === '1' ? 'gemini-2.5-flash-lite' : testModel;
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(target)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Di Salma' }] }],
            generationConfig: { maxOutputTokens: 20 }
          })
        }
      );
      const body = await resp.json();
      data.testedModel = target;
      data.status = resp.status;
      if (resp.ok) {
        data.geminiWorking = true;
        data.reply = body.candidates?.[0]?.content?.parts?.[0]?.text || null;
      } else {
        data.geminiWorking = false;
        data.error = body.error;
      }
    } catch (e) {
      data.geminiWorking = false;
      data.fetchError = e.message;
    }
  }

  res.status(200).json(data);
};
