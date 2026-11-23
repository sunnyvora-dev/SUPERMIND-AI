/**
 * Production Post-Deployment Automated Smoke Test & Verification Suite
 * Usage: node scripts/verify-production.cjs [TARGET_URL]
 * Example: node scripts/verify-production.cjs http://localhost:3000
 */

const http = require('http');
const https = require('https');

const targetUrl = process.argv[2] || 'http://localhost:3000';
console.log(`\n======================================================`);
console.log(` SuperMind AI Production Smoke Test & Verification`);
console.log(` Target Host: ${targetUrl}`);
console.log(` Timestamp:   ${new Date().toISOString()}`);
console.log(`======================================================\n`);

function request(urlStr, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === 'https:' ? https : http;
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000,
      ...options,
    };

    const req = lib.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = null;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json,
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [\x1b[32mPASS\x1b[0m] ${testName}`);
    passed++;
  } else {
    console.log(`  [\x1b[31mFAIL\x1b[0m] ${testName} - ${details}`);
    failed++;
  }
}

async function runSmokeTests() {
  try {
    // 1. Healthcheck & DB Connectivity
    console.log('[Test Suite 1: Healthcheck & Database Connectivity]');
    const health = await request(`${targetUrl}/api/health`);
    assert(health.statusCode === 200, 'Health endpoint responds with HTTP 200', `Got ${health.statusCode}`);
    assert(health.json && health.json.status === 'ok', 'Status is "ok"', `Got ${JSON.stringify(health.json)}`);
    assert(health.json && health.json.database === 'healthy', 'Database connectivity is "healthy"');

    // 2. Security Headers Audit
    console.log('\n[Test Suite 2: Production Security Headers]');
    const headers = health.headers;
    assert(
      headers['x-content-type-options'] === 'nosniff',
      'X-Content-Type-Options: nosniff header present',
      `Got: ${headers['x-content-type-options']}`
    );
    assert(
      headers['x-request-id'] !== undefined,
      'Distributed X-Request-Id header present for audit tracing',
      `Got: ${headers['x-request-id']}`
    );

    // 3. Authentication & Input Hardening
    console.log('\n[Test Suite 3: Auth Security & Error Handling]');
    const badLogin = await request(`${targetUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: 'nonexistent_attacker@test.com',
      password: 'wrong_password_123'
    });
    assert(badLogin.statusCode === 401, 'Invalid login rejected with HTTP 401', `Got ${badLogin.statusCode}`);
    assert(
      !badLogin.body.includes('Prisma') && !badLogin.body.includes('stack') && !badLogin.body.includes('node_modules'),
      'Zero stack trace or internal database leakage on authentication failure'
    );

    // 4. Guard & Authorization Verification
    console.log('\n[Test Suite 4: Protected Endpoints & RBAC]');
    const protectedChat = await request(`${targetUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { prompt: 'Test' });
    assert(protectedChat.statusCode === 401, 'Unauthenticated chat request blocked with HTTP 401', `Got ${protectedChat.statusCode}`);

    // 5. Leak Exposure Path Check
    console.log('\n[Test Suite 5: Sensitive Path Exposure Probe]');
    const envCheck = await request(`${targetUrl}/.env`);
    assert(envCheck.statusCode === 404, '/.env probe returns 404 Not Found', `Got ${envCheck.statusCode}`);
    const gitCheck = await request(`${targetUrl}/.git/config`);
    assert(gitCheck.statusCode === 404, '/.git/config probe returns 404 Not Found', `Got ${gitCheck.statusCode}`);

    console.log(`\n======================================================`);
    console.log(` Verification Completed: ${passed} Passed, ${failed} Failed`);
    console.log(` Status: ${failed === 0 ? '\x1b[32mREADY FOR PRODUCTION\x1b[0m' : '\x1b[31mISSUES DETECTED\x1b[0m'}`);
    console.log(`======================================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Smoke test suite encountered fatal network error:', err.message);
    process.exit(1);
  }
}

runSmokeTests();
