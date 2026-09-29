/**
 * Comprehensive Test Suite for TermCode Runtime Server
 * 
 * Programmatically tests all HTTP endpoints, error cases, headers,
 * and manifest data integrity, then gracefully terminates.
 */

const http = require('http');
const server = require('../server');

const TEST_PORT = 3199;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('  TermCode Runtime Server - Automated Test Suite');
  console.log('===============================================================');
  console.log(`Starting transient server on port ${TEST_PORT}...\n`);

  await new Promise((resolve) => server.listen(TEST_PORT, '127.0.0.1', resolve));

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ [FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  try {
    // Test 1: GET / (Root Discovery)
    await test('GET / returns discovery information with 200 OK', async () => {
      const res = await request('/');
      if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
      if (!res.json || res.json.status !== 'online') throw new Error('Response JSON invalid or status != online');
      if (res.json.architecture !== 'aarch64') throw new Error('Arch != aarch64');
    });

    // Test 2: GET /health (Health Check)
    await test('GET /health returns healthy system status', async () => {
      const res = await request('/health');
      if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
      if (res.json.status !== 'healthy') throw new Error('Expected status == healthy');
      if (!res.json.memory || res.json.uptime === undefined) throw new Error('Missing memory or uptime fields');
    });

    // Test 3: GET /api/runtimes (List all runtimes)
    await test('GET /api/runtimes lists registered targets', async () => {
      const res = await request('/api/runtimes');
      if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
      if (!res.json.runtimes || Object.keys(res.json.runtimes).length < 10) {
        throw new Error('Expected at least 10 registered runtimes');
      }
    });

    // Test 4: GET /api/runtime/python?arch=aarch64 (Valid runtime manifest)
    await test('GET /api/runtime/python?arch=aarch64 returns Python 3 manifest', async () => {
      const res = await request('/api/runtime/python?arch=aarch64');
      if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
      if (res.json.target !== 'python') throw new Error('Target != python');
      if (!res.json.version.startsWith('3.14')) throw new Error(`Unexpected python version: ${res.json.version}`);
      if (res.json.primaryExecutable !== 'bin/python3') throw new Error('Primary executable mismatch');
    });

    // Test 5: GET /api/runtime/c?arch=aarch64 (Valid C manifest)
    await test('GET /api/runtime/c?arch=aarch64 returns Clang C manifest', async () => {
      const res = await request('/api/runtime/c?arch=aarch64');
      if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
      if (res.json.target !== 'c') throw new Error('Target != c');
      if (res.json.primaryExecutable !== 'bin/clang') throw new Error('Primary executable mismatch');
    });

    // Test 6: GET /api/runtime/unknown (404 Non-existent runtime)
    await test('GET /api/runtime/unknown returns 404 Not Found', async () => {
      const res = await request('/api/runtime/nonexistent_runtime_xyz');
      if (res.statusCode !== 404) throw new Error(`Expected 404, got ${res.statusCode}`);
    });

    // Test 7: GET /api/runtime/python?arch=x86_64 (400 Unsupported architecture)
    await test('GET /api/runtime/python?arch=x86_64 returns 400 Bad Request', async () => {
      const res = await request('/api/runtime/python?arch=x86_64');
      if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
    });

    // Test 8: GET /install.sh (Universal install script)
    await test('GET /install.sh returns shell script with 200 OK', async () => {
      const res = await request('/install.sh');
      if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
      if (!res.body.includes('#!/bin/sh')) throw new Error('Missing #!/bin/sh shebang');
    });

    // Test 9: Security headers verification
    await test('Security headers (X-Content-Type-Options, CORS) are set', async () => {
      const res = await request('/');
      if (res.headers['x-content-type-options'] !== 'nosniff') throw new Error('Missing X-Content-Type-Options');
      if (res.headers['access-control-allow-origin'] !== '*') throw new Error('Missing CORS header');
    });

  } finally {
    await new Promise((resolve) => server.close(resolve));
    console.log('\nServer gracefully closed.');
  }

  console.log('---------------------------------------------------------------');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
