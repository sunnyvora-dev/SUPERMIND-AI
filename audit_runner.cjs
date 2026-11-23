const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';

async function runComprehensiveAudit() {
  console.log('=== STARTING PRODUCTION AUDIT & EVIDENCE-BASED SCAN ===\n');

  const findings = [];
  const testResults = { total: 0, passed: 0, failed: 0, blocked: 0 };

  function record(category, testName, passed, details, severity = 'LOW', evidence = {}) {
    testResults.total++;
    if (passed) {
      testResults.passed++;
      console.log(`[PASS] [${category}] ${testName}`);
    } else {
      testResults.failed++;
      console.log(`[FAIL] [${category}] ${testName} (Severity: ${severity})`);
      findings.push({ category, testName, severity, details, evidence });
    }
  }

  // Phase 1: Setup 2 distinct isolated test users for IDOR & isolation tests
  const ts = Date.now();
  const userA_Email = `audit_user_a_${ts}@supermind.ai`;
  const userB_Email = `audit_user_b_${ts}@supermind.ai`;

  console.log('Creating User A and User B for Multi-Tenant Isolation & IDOR Verification...');
  const regARes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userA_Email, password: 'PasswordA123!', name: 'User Alpha' })
  });
  const regA = await regARes.json();
  const tokenA = regA.accessToken;
  const userAId = regA.user?.id;

  const regBRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userB_Email, password: 'PasswordB123!', name: 'User Beta' })
  });
  const regB = await regBRes.json();
  const tokenB = regB.accessToken;
  const userBId = regB.user?.id;

  record('AUTH', 'User registration generates valid JWT', !!tokenA && !!tokenB, 'Users registered successfully');

  // --- Test 2: OTP Security & Information Leakage ---
  console.log('\n--- Auditing OTP Generation & Password Reset Flow ---');
  const otpRes = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userA_Email, purpose: 'forgot_password' })
  });
  const otpBody = await otpRes.json();
  const otpLeaksCode = typeof otpBody.code !== 'undefined';
  record(
    'SECURITY_AUTH',
    'OTP code must NOT be returned in API response body',
    !otpLeaksCode,
    `API returned OTP code directly in JSON response: ${otpBody.code}`,
    'CRITICAL',
    { endpoint: '/api/auth/send-otp', response: otpBody }
  );

  // --- Test 3: OTP Rate Limiting ---
  let rateLimitEnforced = false;
  for (let i = 0; i < 6; i++) {
    const r = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA_Email, purpose: 'forgot_password' })
    });
    if (r.status === 429) {
      rateLimitEnforced = true;
      break;
    }
  }
  record('SECURITY_AUTH', 'OTP send endpoint enforces rate limiting (HTTP 429)', rateLimitEnforced, 'Checked 6 consecutive send-otp attempts', 'MEDIUM');

  // --- Test 4: Multi-Tenant Isolation & IDOR Verification ---
  console.log('\n--- Auditing Multi-Tenant Isolation & IDOR Defense ---');
  // User A creates a conversation
  const convRes = await fetch(`${BASE_URL}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ title: 'Confidential Strategy of User A', category: 'Chat' })
  });
  const convA = await convRes.json();
  const convAId = convA.id;

  // User B attempts to read User A's conversation
  const idorReadRes = await fetch(`${BASE_URL}/conversations/${convAId}`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  record(
    'SECURITY_IDOR',
    'Conversation read endpoint denies unauthorized access (User B cannot read User A)',
    idorReadRes.status === 403 || idorReadRes.status === 404,
    `Status received: ${idorReadRes.status}`,
    'CRITICAL',
    { targetConversationId: convAId, attemptingUserId: userBId, status: idorReadRes.status }
  );

  // User B attempts to delete User A's conversation
  const idorDeleteRes = await fetch(`${BASE_URL}/conversations/${convAId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  record(
    'SECURITY_IDOR',
    'Conversation delete endpoint denies unauthorized deletion (User B cannot delete User A)',
    idorDeleteRes.status === 403 || idorDeleteRes.status === 404,
    `Status received: ${idorDeleteRes.status}`,
    'CRITICAL'
  );

  // User B attempts to read User A's messages
  const idorMsgRes = await fetch(`${BASE_URL}/messages/conversation/${convAId}`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  record(
    'SECURITY_IDOR',
    'Messages endpoint denies unauthorized access to foreign conversation messages',
    idorMsgRes.status === 403 || idorMsgRes.status === 404,
    `Status received: ${idorMsgRes.status}`,
    'CRITICAL'
  );

  // User A creates a document
  const boundary = '----AuditDocBoundary';
  const docUploadRes = await fetch(`${BASE_URL}/files/upload`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, Authorization: `Bearer ${tokenA}` },
    body: Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="confidential_a.txt"\r\nContent-Type: text/plain\r\n\r\n`),
      Buffer.from('User A strictly confidential quarterly earnings and keys.'),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ])
  });
  const docA = await docUploadRes.json();
  const docAId = docA.id;

  // User B attempts to delete User A's document
  const idorDocDelete = await fetch(`${BASE_URL}/documents/${docAId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  record(
    'SECURITY_IDOR',
    'Document delete endpoint denies cross-user deletion',
    idorDocDelete.status === 403 || idorDocDelete.status === 404,
    `Status received: ${idorDocDelete.status}`,
    'CRITICAL'
  );

  // --- Test 5: Privilege Escalation Audit ---
  console.log('\n--- Auditing Privilege Escalation Resistance ---');
  // Attempt to patch role to ADMIN via /api/users/me
  const patchRoleRes = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ role: 'ADMIN', tier: 'ENTERPRISE', tokensUsed: 0 })
  });
  const patchRoleBody = await patchRoleRes.json();
  const roleEscalated = patchRoleBody.role === 'ADMIN';
  record(
    'SECURITY_AUTH',
    'Users cannot escalate role to ADMIN via profile PATCH',
    !roleEscalated,
    `Response returned role: ${patchRoleBody.role}`,
    'CRITICAL'
  );

  // --- Test 6: SQL Injection Resilience ---
  console.log('\n--- Auditing SQL Injection Resilience ---');
  const sqliPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "admin' --",
    "' UNION SELECT id, email, passwordHash FROM users --"
  ];
  let sqliVulnerable = false;
  for (const p of sqliPayloads) {
    const sqliLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: p, password: 'Password123!' })
    });
    if (sqliLogin.status === 200) {
      sqliVulnerable = true;
      break;
    }
  }
  record('SECURITY_SQLI', 'Prisma ORM parameterized queries prevent SQL injection on auth login', !sqliVulnerable, 'Tested 4 SQLi auth bypass payloads', 'CRITICAL');

  // --- Test 7: Concurrency & Performance Benchmarking ---
  console.log('\n--- Benchmarking API Latencies & Concurrency (25 Concurrent Requests) ---');
  const latencies = [];
  const startBatch = Date.now();
  const promises = [];
  for (let i = 0; i < 25; i++) {
    promises.push((async () => {
      const t0 = Date.now();
      const r = await fetch(`${BASE_URL}/analytics/overview`, {
        headers: { Authorization: `Bearer ${tokenA}` }
      });
      const t1 = Date.now();
      latencies.push(t1 - t0);
      return r.status;
    })());
  }
  const statuses = await Promise.all(promises);
  const totalBatchDuration = Date.now() - startBatch;
  latencies.sort((a, b) => a - b);
  const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  const p95Latency = latencies[Math.floor(latencies.length * 0.95)];
  const p99Latency = latencies[Math.floor(latencies.length * 0.99)];
  const allSucceeded = statuses.every(s => s === 200);

  record('PERFORMANCE', 'API handles 25 concurrent requests without errors', allSucceeded, `Success rate: ${statuses.filter(s => s === 200).length}/25`, 'HIGH');
  console.log(`  -> Concurrency Metrics: Avg: ${avgLatency}ms | P95: ${p95Latency}ms | P99: ${p99Latency}ms | Total Batch: ${totalBatchDuration}ms`);

  // --- Test 8: Session Invalidation (Logout Blacklist) ---
  console.log('\n--- Auditing JWT Session Invalidation (Logout Token Blacklist) ---');
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  record('AUTH', 'Logout endpoint responds with 200 OK', logoutRes.status === 200, 'Logout called');

  const afterLogoutRes = await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  record(
    'SECURITY_AUTH',
    'Revoked JWT cannot access protected endpoints after logout (Blacklist Check)',
    afterLogoutRes.status === 401,
    `Status received after logout: ${afterLogoutRes.status}`,
    'HIGH'
  );

  console.log('\n====================================================');
  console.log(`AUDIT RUN SUMMARY: Total: ${testResults.total} | Passed: ${testResults.passed} | Failed: ${testResults.failed}`);
  console.log('====================================================');

  fs.writeFileSync('audit_evidence.json', JSON.stringify({
    testResults,
    metrics: { avgLatency, p95Latency, p99Latency, totalBatchDuration },
    findings
  }, null, 2));

  console.log('Audit evidence saved to audit_evidence.json');
}

runComprehensiveAudit().catch(console.error);
