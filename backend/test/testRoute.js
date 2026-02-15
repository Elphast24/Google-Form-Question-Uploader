const axios = require('axios');

async function testRoutes() {
  const baseURL = 'http://localhost:5000';
  
  console.log('Testing backend routes...\n');
  
  // Test 1: Health check
  try {
    const res = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check:', res.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Upload route (should return 401 without auth)
  try {
    await axios.post(`${baseURL}/api/upload`);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Upload route exists (returned 401 - needs auth)');
    } else if (error.response?.status === 404) {
      console.log('❌ Upload route NOT FOUND (404)');
    } else {
      console.log('❌ Upload route error:', error.message);
    }
  }
  
  // Test 3: Forms route (should return 401 without auth)
  try {
    await axios.get(`${baseURL}/api/forms`);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Forms route exists (returned 401 - needs auth)');
    } else if (error.response?.status === 404) {
      console.log('❌ Forms route NOT FOUND (404)');
    } else {
      console.log('❌ Forms route error:', error.message);
    }
  }
}

testRoutes();