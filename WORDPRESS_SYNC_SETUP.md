# WordPress ↔ React Bi-Directional Sync Setup Guide

## Overview
This guide will help you set up a complete bi-directional sync between your React frontend (`frontend.jumplings.in`) and your WordPress/WooCommerce website.

## Prerequisites
- WordPress website with admin access
- WooCommerce plugin installed
- Node.js and npm installed locally
- Access to your hosting/server (for webhooks)

---

## 📋 Phase 1: WordPress Configuration

### Step 1: Install Required WordPress Plugins

Log into your WordPress admin panel and install these plugins:

1. **WooCommerce** (if not installed)
   - Go to **Plugins → Add New**
   - Search for "WooCommerce"
   - Install and activate

2. **JWT Authentication for WP REST API**
   - Download from: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
   - Or search in **Plugins → Add New**
   - Install and activate

3. **WP Webhooks** (for real-time sync)
   - Search for "WP Webhooks" in plugins
   - Install and activate

### Step 2: Configure Permalinks

1. Go to **Settings → Permalinks**
2. Select **Post name** or any option except "Plain"
3. Click **Save Changes**

### Step 3: Generate WooCommerce API Keys

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Fill in the details:
   - **Description**: `Jumplings Frontend Sync`
   - **User**: Select your admin user
   - **Permissions**: **Read/Write**
4. Click **Generate API Key**
5. **IMPORTANT**: Copy and save:
   - Consumer key (starts with `ck_`)
   - Consumer secret (starts with `cs_`)

### Step 4: Configure JWT Authentication

1. Edit your WordPress `wp-config.php` file
2. Add before `/* That's all, stop editing! */`:

```php
define('JWT_AUTH_SECRET_KEY', 'YOUR-SECURE-SECRET-KEY-HERE');
define('JWT_AUTH_CORS_ENABLE', true);
```

3. Replace `YOUR-SECURE-SECRET-KEY-HERE` with a random secure string
4. Save the file

### Step 5: Set Up Webhooks (for Real-Time Sync)

1. Go to **WP Webhooks → Send Data**
2. Create webhooks for:
   - **Product Updated**: Triggers when product is modified
   - **Product Created**: Triggers when new product is added
   - **Order Created**: Triggers when new order is placed

3. For each webhook, set the URL to:
   ```
   https://frontend.jumplings.in/api/webhooks/wordpress
   ```

4. Save webhook secret for validation

---

## 📋 Phase 2: React Frontend Configuration

### Step 1: Create Environment File

1. In your project root, create a `.env` file:

```bash
cd /Users/shyamkarnani/Desktop/Jumplings_frontend/Jumplings_frontend
cp .env.example .env
```

2. Edit `.env` and add your WordPress credentials:

```env
VITE_WORDPRESS_URL=https://your-wordpress-site.com
VITE_WC_CONSUMER_KEY=ck_your_actual_consumer_key_here
VITE_WC_CONSUMER_SECRET=cs_your_actual_consumer_secret_here
VITE_WP_API_URL=https://your-wordpress-site.com/wp-json/wc/v3
VITE_WEBHOOK_SECRET=your_webhook_secret_here
```

**Replace** all placeholder values with your actual credentials from Step 1.

### Step 2: Test the Connection

Add a test component to verify the connection works:

```typescript
// In your console or a test page:
import { getMergedProducts, getSyncStatus } from './services/syncManager';

// Test fetching products
const products = await getMergedProducts();
console.log('Products:', products);

// Check sync status
const status = getSyncStatus();
console.log('Sync Status:', status);
```

### Step 3: Enable WordPress Mode

In your app, you can switch between local and WordPress mode by updating the `ProductContext`:

```typescript
import { useProducts } from './context/ProductContext';

function YourComponent() {
  const { setDataSource, dataSource } = useProducts();
  
  // Switch to WordPress mode
  setDataSource('wordpress');
  
  return <div>Data Source: {dataSource}</div>;
}
```

---

## 📋 Phase 3: Webhook Endpoint (Optional but Recommended)

For real-time sync, you'll need a webhook endpoint on your backend. Since this is a static React app, you have two options:

### Option A: Use a Serverless Function (Recommended)

Create a serverless function (e.g., Vercel, Netlify, or AWS Lambda):

```typescript
// api/webhooks/wordpress.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, data } = req.body;

  // Validate webhook secret
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.VITE_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Trigger cache invalidation
  // This will force fresh data on next request
  console.log(`Webhook received: ${action}`, data);

  res.status(200).json({ success: true });
}
```

### Option B: Use Polling (Simpler)

The sync manager already implements automatic polling every 5 minutes when in WordPress mode.

---

## 📋 Phase 4: Initial Data Sync

### Sync Local Products to WordPress

If you want to push your existing local products to WordPress:

```typescript
import { syncProducts } from './services/syncManager';

// Push all local products to WordPress
const result = await syncProducts('local-to-wordpress');
console.log(`Synced ${result.synced} products`);
```

### Pull WordPress Products to React

To fetch products from WordPress:

```typescript
import { syncProducts } from './services/syncManager';

// Pull products from WordPress
const result = await syncProducts('wordpress-to-local');
console.log(`Fetched ${result.synced} products`);
```

### Bi-Directional Sync

For full two-way sync:

```typescript
import { syncProducts } from './services/syncManager';

// Sync both ways
const result = await syncProducts('bidirectional');
console.log(`Synced ${result.synced} products in both directions`);
```

---

## 📋 Phase 5: Testing

### Test Product Sync

1. **In WordPress**:
   - Create a new product
   - Wait 5 minutes or trigger manual sync
   - Check if it appears in your React app

2. **In React** (if you implement write operations):
   - Update stock after purchase
   - Check if stock is updated in WordPress

### Test Order Creation

When a user places an order in React:

```typescript
import { createWooCommerceOrder } from './services/wordpressAPI';

const orderData = {
  payment_method: "cod",
  payment_method_title: "Cash on Delivery",
  billing: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "New Delhi",
    postcode: "110001",
    country: "IN",
    email: "john@example.com",
    phone: "9876543210"
  },
  line_items: [
    {
      product_id: 123,
      quantity: 2
    }
  ]
};

const order = await createWooCommerceOrder(orderData);
console.log('Order created:', order);
```

---

## 🔧 Troubleshooting

### Problem: "Failed to fetch products"

**Solution**:
- Check if your WordPress site is accessible
- Verify API keys are correct in `.env`
- Check WordPress REST API is enabled
- Look for CORS errors in browser console

### Problem: "401 Unauthorized"

**Solution**:
- Regenerate WooCommerce API keys
- Ensure Read/Write permissions are set
- Check if keys are correctly copied

### Problem: Products not syncing in real-time

**Solution**:
- Verify webhooks are set up correctly
- Check webhook URL is accessible
- Ensure webhook secret matches in both systems
- For now, rely on 5-minute polling

### Problem: Stock not updating

**Solution**:
- Check WooCommerce API permissions
- Verify `updateWooCommerceStock` function is called after purchase
- Check browser console for API errors

---

## 📊 Sync Strategy Recommendations

### For E-commerce Store:

1. **Product Data**: Pull from WordPress (single source of truth)
2. **Orders**: Create in WordPress from React
3. **Stock**: Update in WordPress after each purchase
4. **User Accounts**: Use WordPress for authentication

### Sync Schedule:

- **On App Load**: Fetch fresh products
- **Every 5 Minutes**: Background sync (already implemented)
- **On Purchase**: Immediate stock update
- **Webhooks**: Real-time updates (if implemented)

---

## 🚀 Deployment Checklist

Before going live:

- [ ] WordPress API keys generated and saved
- [ ] `.env` file configured with correct credentials
- [ ] Initial product sync completed
- [ ] Test order creation
- [ ] Test stock updates
- [ ] Webhooks configured (optional)
- [ ] Error handling tested
- [ ] CORS configured on WordPress
- [ ] SSL/HTTPS enabled on both sites

---

## 📝 Next Steps

1. **Set up your WordPress site** if you haven't already
2. **Generate API keys** following Step 3
3. **Configure `.env`** with your credentials
4. **Run initial sync** to populate data
5. **Test thoroughly** before going live

---

## 🔐 Security Notes

- Never commit `.env` file to Git
- Keep API keys secure
- Use HTTPS for all API communication
- Validate webhook signatures
- Implement rate limiting if needed

---

## 📚 Additional Resources

- [WooCommerce REST API Docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [JWT Authentication Plugin](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

---

## 💡 Questions?

If you encounter any issues:
1. Check the browser console for errors
2. Look at WordPress debug logs
3. Verify API endpoints are accessible
4. Test API calls using Postman/Insomnia

---

**Ready to get started?** Follow Phase 1 to set up your WordPress site! 🚀
