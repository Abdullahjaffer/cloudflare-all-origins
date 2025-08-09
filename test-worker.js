// Simple test for the Cloudflare Worker
// Run this with: node test-worker.js

import worker from './worker.js';

// Mock Cloudflare Worker environment
const mockEnv = {};
const mockCtx = {
  waitUntil: (promise) => promise,
  passThroughOnException: () => {}
};

async function testWorker() {
  console.log('🧪 Testing AllOrigins Cloudflare Worker...\n');

  // Test cases
  const tests = [
    {
      name: 'OPTIONS request (CORS preflight)',
      request: new Request('https://allorigins.example.com/get', {
        method: 'OPTIONS'
      })
    },
    {
      name: 'GET request with invalid format',
      request: new Request('https://allorigins.example.com/invalid?url=https://httpbin.org/json')
    },
    {
      name: 'GET request without URL parameter',
      request: new Request('https://allorigins.example.com/get')
    },
    {
      name: 'Info request',
      request: new Request('https://allorigins.example.com/info?url=https://httpbin.org/json')
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await worker.fetch(test.request, mockEnv, mockCtx);
      console.log(`✅ Status: ${response.status}`);
      
      const headers = Object.fromEntries(response.headers.entries());
      console.log(`📋 Headers: CORS=${headers['access-control-allow-origin']}`);
      
      if (response.status !== 200 || test.name.includes('OPTIONS')) {
        console.log(`📄 Response: ${response.status} ${response.statusText}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }

  console.log('🎉 Worker tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Run: wrangler dev (for local testing)');
  console.log('2. Run: wrangler deploy (to deploy)');
  console.log('3. Test with a real URL in your browser');
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testWorker().catch(console.error);
}