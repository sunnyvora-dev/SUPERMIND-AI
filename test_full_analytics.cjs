const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';
const JWT_SECRET = 'supermind_local_dev_jwt_secret_key_2026_super_secure';

async function runFullAnalyticsTest() {
  console.log('====================================================');
  console.log('   🚀 SUPERMIND AI - USAGE & ANALYTICS TEST SUITE   ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - ${details}`);
    }
  }

  // ----------------------------------------------------
  // TEST 1: Authentication & Access Control
  // ----------------------------------------------------
  console.log('--- Phase 1: Authentication & Security Guard ---');
  {
    const resNoAuth = await fetch(`${BASE_URL}/analytics/overview`);
    assert(resNoAuth.status === 401, 'Endpoint rejects requests without Authorization header (401)');

    const resBadToken = await fetch(`${BASE_URL}/analytics/overview`, {
      headers: { Authorization: 'Bearer invalid_garbage_token_123' },
    });
    assert(resBadToken.status === 401, 'Endpoint rejects invalid JWT token (401)');
  }

  // ----------------------------------------------------
  // TEST 2: Isolated Test User Setup & Baseline Telemetry
  // ----------------------------------------------------
  console.log('\n--- Phase 2: Fresh User Setup & Baseline Audit ---');
  const timestamp = Date.now();
  const testEmail = `analytics_tester_${timestamp}@supermind.ai`;
  const registerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'SecurePassword123!',
      name: 'Analytics QA Tester',
    }),
  });

  const registerData = await registerRes.json();
  const token = registerData.accessToken;
  const userId = registerData.user?.id;
  assert(registerRes.status === 201 && !!token, 'Test user registered successfully with valid access token');

  // Baseline overview
  const baselineRes = await fetch(`${BASE_URL}/analytics/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const baselineData = await baselineRes.json();
  assert(baselineRes.status === 200, 'Baseline analytics returned 200 OK');
  assert(baselineData.overview.totalRequests === 0, 'Baseline totalRequests is 0');
  assert(baselineData.overview.totalMessages === 0, 'Baseline totalMessages is 0');
  assert(baselineData.overview.totalTokens === 0, 'Baseline totalTokens is 0');
  assert(baselineData.overview.documentsAnalyzed === 0, 'Baseline documentsAnalyzed is 0');
  assert(baselineData.overview.imagesGenerated === 0, 'Baseline imagesGenerated is 0');
  assert(Array.isArray(baselineData.taskDistribution), 'Baseline taskDistribution is an array');
  assert(Array.isArray(baselineData.providerStats), 'Baseline providerStats is an array');

  console.log('Baseline overview snapshot:', JSON.stringify(baselineData.overview));

  // ----------------------------------------------------
  // TEST 3: Chat Interaction & Live Token / Usage Metering
  // ----------------------------------------------------
  console.log('\n--- Phase 3: Live Chat Execution & Usage Logging ---');
  const chatPrompt = 'What is 15 * 8? Give only the number.';
  console.log(`Sending chat prompt: "${chatPrompt}"...`);
  const chatStart = Date.now();
  const chatRes = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: chatPrompt }),
  });
  const chatDuration = Date.now() - chatStart;
  const chatData = await chatRes.json();

  assert(chatRes.status === 200 || chatRes.status === 201, `Chat request succeeded in ${chatDuration}ms`);
  assert(!!chatData.message?.content || !!chatData.content || !!chatData.response, 'Chat returned non-empty response content');

  // Verify Analytics after Chat
  const afterChatRes = await fetch(`${BASE_URL}/analytics/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const afterChatData = await afterChatRes.json();

  assert(afterChatData.overview.totalRequests >= 1, `totalRequests incremented (expected >= 1, got ${afterChatData.overview.totalRequests})`);
  assert(afterChatData.overview.totalMessages >= 2, `totalMessages tracked prompt + response (expected >= 2, got ${afterChatData.overview.totalMessages})`);
  assert(afterChatData.overview.totalTokens > 0, `totalTokens recorded real consumption (got ${afterChatData.overview.totalTokens})`);
  assert(afterChatData.overview.avgLatencyMs > 0, `avgLatencyMs recorded real latency (got ${afterChatData.overview.avgLatencyMs}ms)`);
  assert(afterChatData.providerStats.length > 0, 'providerStats contains active foundation models');
  
  const loggedModel = afterChatData.providerStats.find(p => p.requests > 0);
  assert(!!loggedModel, `Model requests recorded in provider stats (Model: ${loggedModel?.model}, Requests: ${loggedModel?.requests}, Latency: ${loggedModel?.latencyMs}ms)`);

  // ----------------------------------------------------
  // TEST 4: Document Analysis Tracking
  // ----------------------------------------------------
  console.log('\n--- Phase 4: Document Ingestion & Analytics Tracking ---');
  // Upload a synthetic test file via multipart/form-data
  const boundary = '----WebKitFormBoundaryAnalyticsTest';
  const fileContent = 'SuperMind AI Architecture Specification: Scalable multi-agent supervisor orchestrator.';
  const bodyBuffer = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="spec-v1.txt"\r\nContent-Type: text/plain\r\n\r\n`),
    Buffer.from(fileContent),
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const uploadRes = await fetch(`${BASE_URL}/files/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      Authorization: `Bearer ${token}`,
    },
    body: bodyBuffer,
  });

  const uploadData = await uploadRes.json();
  assert(uploadRes.status === 200 || uploadRes.status === 201, 'Document uploaded successfully to files module');

  // Verify Analytics after Document upload
  const afterDocRes = await fetch(`${BASE_URL}/analytics/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const afterDocData = await afterDocRes.json();
  assert(afterDocData.overview.documentsAnalyzed === 1, `documentsAnalyzed incremented to 1 (got ${afterDocData.overview.documentsAnalyzed})`);

  // ----------------------------------------------------
  // TEST 5: Image Generation & Studio Tracking
  // ----------------------------------------------------
  console.log('\n--- Phase 5: Image Generation & Usage Tracking ---');
  const imgRes = await fetch(`${BASE_URL}/images/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt: 'A sleek minimal electric sports car on a mountain pass at sunset',
      style: 'Digital Art',
      aspectRatio: '1:1',
    }),
  });

  const imgData = await imgRes.json();
  assert(imgRes.status === 200 || imgRes.status === 201, 'Image generation completed successfully');
  assert(!!imgData.imageUrl, 'Image generation returned valid image URL');

  // Verify Analytics after Image generation
  const afterImgRes = await fetch(`${BASE_URL}/analytics/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const afterImgData = await afterImgRes.json();
  assert(afterImgData.overview.imagesGenerated >= 1, `imagesGenerated incremented to >= 1 (got ${afterImgData.overview.imagesGenerated})`);

  // ----------------------------------------------------
  // TEST 6: Task Category Distribution Integrity
  // ----------------------------------------------------
  console.log('\n--- Phase 6: Task Category Distribution Integrity ---');
  const distribution = afterImgData.taskDistribution || [];
  assert(distribution.length > 0, `Task distribution categories populated (${distribution.map(d => `${d.task}: ${d.percentage}%`).join(', ')})`);
  const totalPercentage = distribution.reduce((sum, d) => sum + d.percentage, 0);
  assert(totalPercentage >= 95 && totalPercentage <= 105, `Percentages sum reasonably to ~100% (actual: ${totalPercentage}%)`);

  // ----------------------------------------------------
  // TEST 7: Frontend Service Parsing & Formatting Check
  // ----------------------------------------------------
  console.log('\n--- Phase 7: Frontend Adapter & Formatting Compatibility ---');
  // Mimic frontend analyticsService mapping
  const frontendSummary = {
    totalRequests: afterImgData.overview?.totalRequests || 0,
    totalMessages: afterImgData.overview?.totalMessages || 0,
    imagesGenerated: afterImgData.overview?.imagesGenerated || 0,
    documentsAnalyzed: afterImgData.overview?.documentsAnalyzed || 0,
    tokensConsumed: afterImgData.overview?.totalTokens || 0,
    successRatePercentage: afterImgData.overview?.successRatePercentage || 99.8,
    averageLatencyMs: afterImgData.overview?.avgLatencyMs || 0,
    taskDistribution: afterImgData.taskDistribution || [],
    providerStats: afterImgData.providerStats || [],
  };

  assert(typeof frontendSummary.tokensConsumed.toLocaleString() === 'string', 'Frontend tokensConsumed formatting works without exception');
  assert(typeof frontendSummary.averageLatencyMs === 'number', 'Frontend averageLatencyMs is numeric');
  assert(frontendSummary.providerStats.every(p => typeof p.latencyMs === 'number' && typeof p.requests === 'number'), 'All provider stats contain valid latency and request counts');

  // Summary Report
  console.log('\n====================================================');
  console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} PASSED   `);
  console.log('====================================================');
  console.log('Final Verified Telemetry State for Test User:');
  console.log(JSON.stringify(afterImgData, null, 2));

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL USAGE & ANALYTICS TESTS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error(`\n⚠️  ${totalTests - passedTests} tests failed.`);
    process.exit(1);
  }
}

runFullAnalyticsTest().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
