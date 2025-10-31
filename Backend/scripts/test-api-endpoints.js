const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/v1';

async function testAPIEndpoints() {
  console.log('Testing API endpoints...\n');

  const endpoints = [
    { path: '/services', name: 'Services' },
    { path: '/realisations', name: 'Portfolio' },
    { path: '/articles', name: 'Articles' },
    { path: '/team', name: 'Team' },
    { path: '/testimonials', name: 'Testimonials' },
    { path: '/products', name: 'Products' },
    { path: '/auth/users', name: 'Users' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name} endpoint: ${endpoint.path}`);

      const response = await axios.get(`${API_BASE_URL}${endpoint.path}`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.status === 'success') {
        const count = response.data.results || response.data.data?.length || 0;
        console.log(`✅ ${endpoint.name}: ${count} items found`);

        // Show sample data structure
        if (response.data.data && response.data.data.length > 0) {
          console.log(`   Sample: ${JSON.stringify(response.data.data[0]).substring(0, 100)}...`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: Invalid response format`);
        console.log(`   Response:`, response.data);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${endpoint.name}: Backend server not running`);
        console.log(`   Make sure to start the server with: npm run dev`);
      } else if (error.response) {
        console.log(`❌ ${endpoint.name}: HTTP ${error.response.status}`);
        console.log(`   Error: ${error.response.data?.message || error.message}`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
    console.log('');
  }

  console.log('API testing complete!');
  console.log('\nIf you see mock data warnings in the browser console, it means:');
  console.log('1. The backend server is not running');
  console.log('2. The database is empty');
  console.log('3. The API endpoints are returning errors');
  console.log('\nTo fix:');
  console.log('1. Start the backend: cd Backend && npm run dev');
  console.log('2. Run sample data scripts: node scripts/create-sample-users.js && node scripts/create-sample-content.js');
  console.log('3. Check database connection in .env file');
}

testAPIEndpoints();
