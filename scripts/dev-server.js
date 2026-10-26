/**
 * Servidor local SALMAN · sin dependencias.
 * Sirve el sitio y las rutas /api/chat y /api/health.
 *
 * Uso:
 *   $env:GEMINI_API_KEY="..."   (PowerShell)
 *   node scripts/dev-server.js
 *
 * También carga .env.local o .env si existen.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { generateReply } = require('../lib/salman');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8080);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function loadEnv(file) {
  try {
    const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const value = match[2].replace(/^["']|["']$/g, '');
        if (!process.env[match[1]]) process.env[match[1]] = value;
      }
    }
  } catch (_) { /* archivo opcional */ }
}
loadEnv('.env.local');
loadEnv('.env');

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { reject(new Error('body_too_large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch (_) { reject(new Error('invalid_json')); }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = pathname === '/' ? '/index.html' : pathname;
  file = path.normalize(file).replace(/^(\.\.[/\\])+/, '');
  const abs = path.join(ROOT, file);
  if (!abs.startsWith(ROOT)) return json(res, 403, { error: 'forbidden' });
  fs.stat(abs, (err, stat) => {
    if (err || !stat.isFile()) return json(res, 404, { error: 'not_found' });
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(abs).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/api/health' && req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      service: 'salman-chat',
      geminiConfigured: Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim()),
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      voice: 'browser-webspeech',
      runtime: 'local-node'
    });
  }
  if (pathname === '/api/chat') {
    if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
    try {
      const body = await readBody(req);
      const messages = Array.isArray(body.messages) ? body.messages : [];
      if (!messages.length) return json(res, 400, { error: 'messages_required' });
      const result = await generateReply({
        messages,
        lang: body.lang === 'en' ? 'en' : 'es',
        channel: 'web'
      });
      return json(res, 200, { ...result, source: 'gemini', runtime: 'local-node' });
    } catch (error) {
      const code = error.code || error.message;
      console.error('[dev-server]', code, error.detail || '');
      return json(res, code === 'missing_api_key' ? 503 : 502, {
        error: code === 'missing_api_key' ? 'missing_api_key' : 'ai_unavailable',
        hint: 'Crea .env.local con GEMINI_API_KEY y reinicia el servidor.'
      });
    }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'method_not_allowed' });
  serveStatic(req, res);
});

server.listen(PORT, () => {
  const configured = Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim());
  console.log(`SALMAN local: http://localhost:${PORT}/`);
  console.log(`Voice Lab:   http://localhost:${PORT}/voz.html`);
  console.log(`Gemini:      ${configured ? 'configurado' : 'sin clave (fallback local)'}`);
});
