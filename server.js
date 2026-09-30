/**
 * TermCode Runtime & Library Distribution Server
 * 
 * Official, zero-dependency, architecture-aware distribution server
 * for TermCode Android IDE (aarch64 / Termux).
 * 
 * Uses Node.js native standard library (http, fs, path, crypto, child_process)
 * - Zero external npm dependencies required (0 KB data download)
 * - Full REST API specification compatibility
 * - High-throughput streaming for large package archives
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT_DIR = __dirname;
const MANIFESTS_DIR = path.join(ROOT_DIR, 'manifests');
const DOWNLOADS_DIR = path.join(ROOT_DIR, 'downloads');
const CHECKSUMS_DIR = path.join(ROOT_DIR, 'checksums');

const SERVER_START_TIME = Date.now();

// Helper to set standard response headers
function setStandardHeaders(res, contentType = 'application/json') {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Server', 'TermCode-Distribution-Server/1.0.0 (Node.js)');
}

// Helper to send JSON responses
function sendJson(res, statusCode, data) {
  setStandardHeaders(res, 'application/json; charset=utf-8');
  res.writeHead(statusCode);
  res.end(JSON.stringify(data, null, 2));
}

// Helper to send plain text responses
function sendText(res, statusCode, text) {
  setStandardHeaders(res, 'text/plain; charset=utf-8');
  res.writeHead(statusCode);
  res.end(text);
}

// Helper to load manifest
function loadManifest(target) {
  const safeTarget = path.basename(target).toLowerCase();
  const filePath = path.join(MANIFESTS_DIR, `${safeTarget}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

// Request Handler
const server = http.createServer((req, res) => {
  // Handle CORS Pre-flight
  if (req.method === 'OPTIONS') {
    setStandardHeaders(res);
    res.writeHead(200);
    return res.end();
  }

  // Only allow GET and HEAD methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. Root / Discovery: GET /
  if (pathname === '/' || pathname === '') {
    const indexPath = path.join(MANIFESTS_DIR, 'index.json');
    let indexData = {};
    if (fs.existsSync(indexPath)) {
      try {
        indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      } catch (e) {}
    }

    return sendJson(res, 200, {
      name: 'TermCode Runtime Distribution Server',
      version: '1.0.0',
      description: 'Official runtime distribution & package manifest server for TermCode Android IDE',
      architecture: 'aarch64',
      minAndroidApi: 24,
      status: 'online',
      uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
      endpoints: {
        health: '/health',
        runtimes: '/api/runtimes',
        runtimeDetail: '/api/runtime/:language?arch=aarch64',
        downloads: '/downloads/:arch/:package',
        checksums: '/checksums/:arch.sha256',
        installScript: '/install.sh'
      },
      supportedLanguages: [
        'c', 'cpp', 'java', 'python', 'nodejs', 'typescript',
        'go', 'rust', 'kotlin', 'csharp', 'php', 'ruby', 'lua', 'web'
      ],
      totalRuntimes: Object.keys(indexData.runtimes || {}).length,
      documentation: 'https://github.com/raj40870-pixel/library'
    });
  }

  // 2. Health & Status: GET /health
  if (pathname === '/health') {
    const mem = process.memoryUsage();
    return sendJson(res, 200, {
      status: 'healthy',
      uptime: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        rssMB: (mem.rss / (1024 * 1024)).toFixed(2),
        heapTotalMB: (mem.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMB: (mem.heapUsed / (1024 * 1024)).toFixed(2)
      }
    });
  }

  // 3. List All Runtimes: GET /api/runtimes
  if (pathname === '/api/runtimes') {
    const indexPath = path.join(MANIFESTS_DIR, 'index.json');
    if (!fs.existsSync(indexPath)) {
      return sendJson(res, 503, { error: 'Manifest index not yet generated' });
    }
    try {
      const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      return sendJson(res, 200, data);
    } catch (e) {
      return sendJson(res, 500, { error: 'Failed to read runtime index', message: e.message });
    }
  }

  // 4. Runtime Detail Manifest: GET /api/runtime/:language
  if (pathname.startsWith('/api/runtime/')) {
    const lang = pathname.replace('/api/runtime/', '').split('/')[0].toLowerCase();
    const arch = parsedUrl.searchParams.get('arch') || 'aarch64';

    if (arch !== 'aarch64') {
      return sendJson(res, 400, {
        error: `Unsupported architecture: '${arch}'. Currently only 'aarch64' (ARM64 Android) is supported.`
      });
    }

    const manifest = loadManifest(lang);
    if (!manifest) {
      return sendJson(res, 404, {
        error: `Runtime '${lang}' not found. Supported runtimes: c, cpp, java, python, nodejs, typescript, go, rust, kotlin, csharp, php, ruby, lua, web.`
      });
    }

    return sendJson(res, 200, manifest);
  }

  // 5. Direct Package Download: GET /downloads/:arch/:package
  if (pathname.startsWith('/downloads/')) {
    const parts = pathname.replace('/downloads/', '').split('/');
    if (parts.length < 2) {
      return sendJson(res, 400, { error: 'Invalid download path format. Use: /downloads/:arch/:package' });
    }

    const arch = parts[0];
    const pkg = path.basename(parts[1]);
    const pkgPath = path.join(DOWNLOADS_DIR, arch, pkg);

    // If pre-packaged archive exists on disk, stream file with range support
    if (fs.existsSync(pkgPath) && fs.statSync(pkgPath).isFile()) {
      const stat = fs.statSync(pkgPath);
      const range = req.headers.range;

      setStandardHeaders(res, 'application/gzip');
      res.setHeader('Content-Disposition', `attachment; filename="${pkg}"`);
      res.setHeader('Accept-Ranges', 'bytes');

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Content-Length': chunksize
        });
        return fs.createReadStream(pkgPath, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Length': stat.size });
        return fs.createReadStream(pkgPath).pipe(res);
      }
    }

    // Dynamic streaming fallback from runtime folder (e.g. lua.tar.gz -> lua, python-3.14.tar.gz -> python)
    const folderMatch = pkg.replace(/\.tar\..*$/, '').replace(/\.zip$/, '').split('-')[0];
    const srcFolder = path.join(ROOT_DIR, folderMatch);

    if (fs.existsSync(srcFolder) && fs.statSync(srcFolder).isDirectory()) {
      setStandardHeaders(res, 'application/gzip');
      res.setHeader('Content-Disposition', `attachment; filename="${pkg}"`);
      res.writeHead(200);

      const tar = spawn('tar', ['-czf', '-', '-C', srcFolder, '.']);
      tar.stdout.pipe(res);
      tar.stderr.on('data', (d) => console.error(`tar stream error: ${d}`));
      return;
    }

    return sendJson(res, 404, { error: `Package '${pkg}' for architecture '${arch}' not found` });
  }

  // 6. Checksums: GET /checksums/:arch.sha256
  if (pathname.startsWith('/checksums/')) {
    const arch = path.basename(pathname.replace('/checksums/', '')).replace('.sha256', '');
    const shaFile = path.join(CHECKSUMS_DIR, `${arch}.sha256`);

    if (!fs.existsSync(shaFile)) {
      return sendText(res, 404, `# Checksums for ${arch} not found\n`);
    }

    setStandardHeaders(res, 'text/plain; charset=utf-8');
    res.writeHead(200);
    return fs.createReadStream(shaFile).pipe(res);
  }

  // 7. Universal Install Script: GET /install.sh
  if (pathname === '/install.sh') {
    const scriptPath = path.join(ROOT_DIR, 'install.sh');
    if (!fs.existsSync(scriptPath)) {
      return sendText(res, 404, '#!/bin/sh\necho "install.sh not found"\nexit 1\n');
    }

    setStandardHeaders(res, 'text/plain; charset=utf-8');
    res.writeHead(200);
    return fs.createReadStream(scriptPath).pipe(res);
  }

  // Default 404
  return sendJson(res, 404, { error: `Endpoint not found: ${req.method} ${pathname}` });
});

// Start server if executed directly
if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`===============================================================`);
    console.log(`  TermCode Runtime Distribution Server`);
    console.log(`  Listening on: http://${HOST}:${PORT}`);
    console.log(`  Health:       http://${HOST}:${PORT}/health`);
    console.log(`  Runtimes:     http://${HOST}:${PORT}/api/runtimes`);
    console.log(`===============================================================`);
  });
}

module.exports = server;
