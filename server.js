const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 1. Root URL: Sirf "Backend is running" display hoga
    if (req.url === '/' || req.url === '') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Backend is running');
        return;
    }

    // 2. On-the-fly Library Download stream (Zero disk archives)
    if (req.url.startsWith('/download/')) {
        const lang = req.url.replace('/download/', '').split('?')[0].replace(/[^a-zA-Z0-9_-]/g, '');
        const targetDir = path.join(__dirname, lang);

        if (fs.existsSync(targetDir) && fs.statSync(targetDir).isDirectory()) {
            res.writeHead(200, {
                'Content-Type': 'application/gzip',
                'Content-Disposition': `attachment; filename="${lang}.tar.gz"`
            });
            const tarCmd = process.platform === 'win32' ? 'tar.exe' : 'tar';
            const tarProc = spawn(tarCmd, ['-cz', '-C', targetDir, '.']);
            tarProc.stdout.pipe(res);
            tarProc.on('error', (err) => {
                if (!res.headersSent) res.writeHead(500);
                res.end('Error streaming library: ' + err.message);
            });
            return;
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`Language library '${lang}' not found`);
            return;
        }
    }

    // 3. 1-Command Terminal Installer Script (/install/<lang>)
    if (req.url.startsWith('/install/')) {
        const lang = req.url.replace('/install/', '').split('?')[0].replace(/[^a-zA-Z0-9_-]/g, '');
        const host = req.headers.host || `localhost:${PORT}`;
        const script = `#!/bin/sh
set -e
echo "==> Connecting to TermCode Backend (http://${host})..."
echo "==> Downloading and installing ${lang}..."
DEST="/data/data/com.termux/files/usr"
if [ -d "/data/user/0/com.termux/files/usr" ]; then
    DEST="/data/user/0/com.termux/files/usr"
fi
mkdir -p "$DEST"
curl -sL "http://${host}/download/${lang}" | tar -xz -C "$DEST"
for gz in $(find "$DEST" -name "*.gz" 2>/dev/null); do
    gunzip -f "$gz" 2>/dev/null || true
done
if [ -d "$DEST/bin" ]; then
    chmod -R 755 "$DEST/bin" 2>/dev/null || true
fi
echo "==> SUCCESS: ${lang} installed and ready to run!"
`;
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(script);
        return;
    }

    // 4. Static file serving for individual library files
    const cleanUrl = req.url.split('?')[0];
    const safePath = path.normalize(decodeURIComponent(cleanUrl)).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Backend is running');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});
