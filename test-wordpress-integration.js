// Test WordPress Integration
// Run this in your browser console after the app loads

import { getMergedProducts, syncProducts, getSyncStatus, forceFullSync } from './services/syncManager';

console.log('🧪 Testing WordPress Integration for jumplings.in\n');

// Test 1: Check sync status
console.log('📊 Test 1: Checking Sync Status...');
const status = getSyncStatus();
console.log('Sync Status:', status);

// Test 2: Fetch products from WordPress
console.log('\n📥 Test 2: Fetching Products from WordPress...');
const products = await getMergedProducts();
console.log(`✅ Fetched ${products.length} products from WooCommerce`);
console.log('Sample product:', products[0]);

// Test 3: Check if products have correct structure
console.log('\n🔍 Test 3: Validating Product Structure...');
if (products.length > 0) {
    const product = products[0];
    console.log('Product ID:', product.id);
    console.log('Product Name:', product.name);
    console.log('Product Price:', product.price);
    console.log('Product Images:', product.images?.length || 0);
    console.log('Product Stock:', product.stock);
}

// Test 4: Full sync test
console.log('\n🔄 Test 4: Testing Bi-directional Sync...');
try {
    const syncResult = await syncProducts('wordpress-to-local');
    console.log('Sync Result:', syncResult);
    console.log(`✅ Success: ${syncResult.success}`);
    console.log(`📦 Synced: ${syncResult.synced} products`);
} catch (e) {
    console.error('Sync Test Failed:', e);
}

// Test 5: Order Creation (Write Test)
console.log('\n📝 Test 5: Testing Order Creation (WRITE Permission)...');
import { createWooOrder } from './utils/wordpress';
try {
    const dummyOrderItems = products.length > 0 ? [{ id: products[0].id, quantity: 1, cartId: 'test', name: products[0].name, price: products[0].price, images: products[0].images, category: products[0].category, selectedSize: 'Free Size' }] : [];

    if (dummyOrderItems.length > 0) {
        const order = await createWooOrder(
            { email: 'test@example.com', firstName: 'Test', lastName: 'User', phone: '9999999999', address: 'Test', city: 'Test', state: 'MH', pincode: '400001' },
            dummyOrderItems,
            dummyOrderItems[0].price,
            'cod'
        );
        console.log('✅ Order Created Successfully!', order.id);
    } else {
        console.log('⚠️ Skipping order test (no products available)');
    }
} catch (e) {
    console.error('❌ Order Creation Failed (Possible Permission Issue):', e.message);
}

console.log('\n✨ WordPress Integration Test Complete!');
console.log('Your React app is now connected to jumplings.in WordPress!');
