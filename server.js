// Local development server: serves index.html and runs api/analyze.js. No extra packages needed.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from './api/analyze.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

// Load variables from a ".env" file (KEY=value per line) without any package.
try {
  for (const line of fs.readFileSync(path.join(dir, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith('#') && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
} catch { console.warn('No .env file found. Copy .env.example to .env and add your Gemini key.'); }
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_gemini')) {
  delete process.env.GEMINI_API_KEY;
  console.warn('GEMINI_API_KEY is not set. The page will open, but analysis will show a clear error.');
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/analyze') {
    let raw = '';
    for await (const chunk of req) { raw += chunk; if (raw.length > 300000) break; }
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    res.status = (s) => { res.statusCode = s; return res; };
    res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return res; };
    try { await handler(req, res); } catch (e) { console.error(e); res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong on the server.' } }); }
    return;
  }
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(fs.readFileSync(path.join(dir, 'index.html')));
  }
  res.statusCode = 404; res.end('Not found');
}).listen(process.env.PORT || 3000, () => console.log(`Open http://localhost:${process.env.PORT || 3000}`));
