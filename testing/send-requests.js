const http = require('http');
const https = require('https');

// Replace this with the URL you want to test
const TARGET_URL = 'https://www.magnevents.in/'; 
const REQUEST_COUNT = 100;

const DELAY_BETWEEN_REQUESTS_MS = 6000; 

async function makeRequest(requestNumber) {
  return new Promise((resolve) => {
    const client = TARGET_URL.startsWith('https') ? https : http;
    
    const startTime = Date.now();
    const req = client.get(TARGET_URL, (res) => {
      const duration = Date.now() - startTime;
      console.log(`[Request ${requestNumber}] Status: ${res.statusCode} | Time: ${duration}ms`);
      
      // Consume response data to free up memory
      res.on('data', () => {});
      res.on('end', resolve);
    });

    req.on('error', (e) => {
      console.error(`[Request ${requestNumber}] Failed: ${e.message}`);
      resolve();
    });
    
    // Set a timeout of 5 seconds
    req.setTimeout(5000, () => {
        console.error(`[Request ${requestNumber}] Timeout`);
        req.destroy();
        resolve();
    });
  });
}

async function runTest() {
  console.log(`Starting test: Sending ${REQUEST_COUNT} requests to ${TARGET_URL}`);
  console.log(`Delay between requests: ${DELAY_BETWEEN_REQUESTS_MS}ms\n`);

  for (let i = 1; i <= REQUEST_COUNT; i++) {
    await makeRequest(i);
    
    if (i < REQUEST_COUNT) {
      console.log(`Waiting ${DELAY_BETWEEN_REQUESTS_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS_MS));
    }
  }
  
  console.log('\nTest completed.');
}

runTest();
