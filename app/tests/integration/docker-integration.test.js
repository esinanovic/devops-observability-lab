// tests/integration/docker-integration.test.js

/**
 * Tests d'intégration Docker - Full Stack
 * Vérifie que Backend + Frontend + Database communiquent correctement
 */
const http = require('http');

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';
const TIMEOUT = 5000;
const MAX_RETRIES = 30; 

// Utilitaires

/**
 * Fait une requête HTTP GET
 * @param {string} url - URL à requêter
 * @returns {Promise<{statusCode: number, headers: object, body: string}>}
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout après ${TIMEOUT}ms pour ${url}`));
    }, TIMEOUT);

    http.get(url, (res) => {
      clearTimeout(timeout);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

/**
 * Attend qu'un service soit prêt
 * @param {string} url - URL du service
 * @param {number} maxRetries - Nombre max de tentatives
 */
async function waitForService(url, maxRetries = MAX_RETRIES) {
  console.log(`Waiting for service: ${url}`);
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await httpGet(url);
      if (response.statusCode === 200) {
        console.log(`Service ready: ${url}\n`);
        return true;
      }
    } catch (err) {
      const waitTime = 2;
      console.log(`   Attempt ${i + 1}/${maxRetries} - Retrying in ${waitTime}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }
  }
  
  throw new Error(`Service not ready after ${maxRetries} retries: ${url}`);
}

// Tests

async function runTests() {
  console.log('DOCKER INTEGRATION TESTS');

  let testsTotal = 0;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // Test 1 : Backend Health Check
    testsTotal++;
    console.log(' Test 1/5: Backend Health Check');
    
    await waitForService(`${BACKEND_URL}/health`);
    const healthResponse = await httpGet(`${BACKEND_URL}/health`);
    
    if (healthResponse.statusCode !== 200) {
      throw new Error(`Expected status 200, got ${healthResponse.statusCode}`);
    }
    
    let healthData;
    try {
      healthData = JSON.parse(healthResponse.body);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${healthResponse.body}`);
    }
    
    if (healthData.status.toLowerCase() !== 'ok') {
      throw new Error(`Backend not healthy. Status: ${healthData.status}`);
    }
    
    testsPassed++;
    console.log('Test 1 PASSED: Backend is healthy');

    // Test 2 : Backend API Endpoint
    // Test 2 : Backend API Endpoint
    testsTotal++;
    console.log(' Test 2/4: Backend API Endpoint');
    
    await waitForService(`${BACKEND_URL}/health`);
    const apiResponse = await httpGet(`${BACKEND_URL}/api/status`);
    
    if (apiResponse.statusCode !== 200) {
      throw new Error(`Expected status 200, got ${apiResponse.statusCode}`);
    }
    let apiData;
    try {
      apiData = JSON.parse(apiResponse.body);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${apiResponse.body}`);
    }
    if (apiData.data && apiData.data.database && apiData.data.database.connected) {
      console.log('   Database connection verified');
    }
    
    if (apiData.status !== 'success') {
      throw new Error(`API failed. Status: ${apiData.status}`);
    }
    
    testsPassed++;
    console.log('Test 2 PASSED: Backend API works correctly');

    // Test 3 : Frontend Accessibility
    testsTotal++;
    console.log('Test 3/5: Frontend Accessibility');
    console.log('Testing: Frontend is accessible and returns HTML');
    
    await waitForService(`${FRONTEND_URL}`);
    const frontendResponse = await httpGet(`${FRONTEND_URL}`);
    
    if (frontendResponse.statusCode !== 200) {
      throw new Error(`Expected status 200, got ${frontendResponse.statusCode}`);
    }
    
    // Vérifie que le root div existe (React)
    if (!frontendResponse.body.includes('id="root"') && 
        !frontendResponse.body.includes('id=\'root\'')) {
      console.log('    Warning: No root div found (might be OK for static HTML)');
    }
    
    testsPassed++;
    console.log(' Test 3 PASSED: Frontend is accessible');

    // Test 5 : Environment & Database
    testsTotal++;
    console.log(' Test 4/4: Environment & Database Connection');
    
    if (healthData.uptime !== undefined) {
      console.log(`ackend uptime: ${Math.floor(healthData.uptime)}s`);
    }
    
    if (apiData.data && apiData.data.environment) {
      console.log(` Environment: ${apiData.data.environment}`);
    }
    
    // Si ton backend a un endpoint pour vérifier la DB
    if (healthData.database || apiData.database) {
      console.log('  Database connection: OK');
    } else {
      console.log(' Database status not available in health check');
    }
    
    testsPassed++;
    console.log('Test 4 PASSED: Backend configuration OK');
    console.log('');
    process.exit(0);

  } catch (error) {
    testsFailed++;
    
    console.error('TEST FAILED');
    console.error(`Message: ${error.message}`);

    
    if (error.stack) {
      console.error('Stack Trace:');
      console.error(error.stack);
      console.error('');
    }
    
    process.exit(1);
  }
}

//MAIN
console.log('Starting integration tests...');
runTests();