// WordPress Connection Test Script
// Run with: node test-wp-connection.js

const https = require('https');

const WP_URL = 'https://jumplings.in';
const WC_API_URL = `${WP_URL}/wp-json/wc/v3`;
const CONSUMER_KEY = 'ck_717db3f2db699eb3c8b77425e28ccb716d3661f3';
const CONSUMER_SECRET = 'cs_b536578381112bf7be0581eeaad03d3f6d963523';

// Basic Auth encoding
const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function testConnection() {
  console.log('🔌 Testing WordPress Connection...\n');
  console.log(`WordPress URL: ${WP_URL}`);
  console.log(`API URL: ${WC_API_URL}\n`);

  // Test 1: Check WordPress REST API
  console.log('📡 Test 1: WordPress REST API');
  try {
    const response = await makeRequest(`${WP_URL}/wp-json/`);
    if (response.status === 200) {
      console.log('✅ WordPress REST API is accessible');
      console.log(`   Site Name: ${response.data.name || 'N/A'}`);
      console.log(`   API Version: ${response.data.namespaces?.join(', ') || 'N/A'}\n`);
    } else {
      console.log(`❌ WordPress REST API returned status: ${response.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Failed to connect: ${error.message}\n`);
    return;
  }

  // Test 2: Check WooCommerce API
  console.log('🛒 Test 2: WooCommerce API');
  try {
    const response = await makeRequest(`${WC_API_URL}/products?per_page=1`);
    if (response.status === 200) {
      const products = Array.isArray(response.data) ? response.data : [];
      console.log('✅ WooCommerce API is accessible');
      console.log(`   Products found: ${products.length}`);
      if (products.length > 0) {
        console.log(`   Sample product: ${products[0].name || products[0].id}\n`);
      } else {
        console.log('   (No products found)\n');
      }
    } else {
      console.log(`❌ WooCommerce API returned status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data).substring(0, 200)}\n`);
    }
  } catch (error) {
    console.log(`❌ Failed to connect to WooCommerce API: ${error.message}\n`);
  }

  // Test 3: Check Orders API
  console.log('📦 Test 3: Orders API');
  try {
    const response = await makeRequest(`${WC_API_URL}/orders?per_page=1`);
    if (response.status === 200) {
      const orders = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Orders API is accessible');
      console.log(`   Recent orders: ${orders.length}\n`);
    } else {
      console.log(`❌ Orders API returned status: ${response.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Failed to connect to Orders API: ${error.message}\n`);
  }

  // Test 4: Check Customers API
  console.log('👥 Test 4: Customers API');
  try {
    const response = await makeRequest(`${WC_API_URL}/customers?per_page=1`);
    if (response.status === 200) {
      const customers = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Customers API is accessible');
      console.log(`   Customers found: ${customers.length}\n`);
    } else {
      console.log(`❌ Customers API returned status: ${response.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Failed to connect to Customers API: ${error.message}\n`);
  }

  // Test 5: Check if JWT endpoint exists
  console.log('🔐 Test 5: JWT Authentication Endpoint');
  try {
    const response = await makeRequest(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      body: { username: 'test', password: 'test' }
    });
    if (response.status === 403 || response.status === 401 || response.status === 404) {
      if (response.status === 404) {
        console.log('⚠️  JWT Authentication plugin not installed');
        console.log('   Install: JWT Authentication for WP REST API plugin\n');
      } else {
        console.log('✅ JWT Authentication endpoint exists (credentials invalid, but endpoint works)\n');
      }
    } else {
      console.log(`⚠️  Unexpected response: ${response.status}\n`);
    }
  } catch (error) {
    console.log(`❌ JWT endpoint check failed: ${error.message}\n`);
  }

  console.log('✨ Connection test complete!');
  console.log('\n💡 Next Steps:');
  console.log('1. If APIs are accessible, your frontend should work');
  console.log('2. For email configuration, add the code from WORDPRESS_EMAIL_SETUP.md to functions.php');
  console.log('3. Install WP Mail SMTP plugin for reliable email delivery');
}

testConnection().catch(console.error);

