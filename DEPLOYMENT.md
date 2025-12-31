# 🚀 Deployment Instructions for Dockploy

## ⚠️ IMPORTANT: Environment Variables

Your `.env` file is **NOT** committed to Git (for security). You need to add it to your Dockploy deployment.

### Step 1: Add Environment Variables in Dockploy

1. Go to your Dockploy dashboard: https://server.jumplings.in
2. Navigate to your **jumplings-frontend** service
3. Click on the **"Environment"** tab
4. Add the following environment variables:

```
VITE_WORDPRESS_URL=https://jumplings.in
VITE_WC_CONSUMER_KEY=ck_717db3f2db699eb3c8b77425e28ccb716d3661f3
VITE_WC_CONSUMER_SECRET=cs_b536578381112bf7be0581eeaad03d3f6d963523
VITE_WP_API_URL=https://jumplings.in/wp-json/wc/v3
```

### Step 2: Redeploy Your Service

1. After adding environment variables, click **"Redeploy"** or **"Deploy"**
2. Wait for the build to complete
3. The new build will include WordPress integration

### Step 3: Verify Deployment

Visit your site: https://frontend.jumplings.in

Open browser console and test:
```javascript
// Check if env variables are loaded
console.log(import.meta.env.VITE_WORDPRESS_URL); // Should show: https://jumplings.in

// Test product fetch
import { getMergedProducts } from './services/syncManager';
const products = await getMergedProducts();
console.log('Products:', products);
```

---

## 🎯 Next Steps After Deployment

### 1. Access the Sync Panel

Add this route to your `App.tsx`:

```typescript
import WordPressSyncPanel from './components/WordPressSyncPanel';

// In your Routes section:
<Route path="/admin/sync" element={<WordPressSyncPanel />} />
```

Then visit: `https://frontend.jumplings.in/#/admin/sync`

### 2. Enable WordPress Mode

In your app, switch to WordPress mode:

```typescript
import { useProducts } from './context/ProductContext';

const { setDataSource } = useProducts();
setDataSource('wordpress'); // This enables auto-sync every 5 minutes
```

### 3. Run Initial Sync

Use the Sync Panel or browser console:

```javascript
import { syncProducts } from './services/syncManager';

// Pull products from WordPress
await syncProducts('wordpress-to-local');
```

---

## 📊 What Happens After Deployment

✅ **Your React app will:**
- Connect to jumplings.in WordPress
- Fetch products from WooCommerce
- Display products with real-time stock
- Auto-sync every 5 minutes (when WordPress mode is enabled)
- Cache products for 5 minutes to reduce API calls

✅ **You can:**
- Manage products in WordPress (easier for non-technical users)
- Products automatically appear in React frontend
- Update stock in WordPress
- Create orders from React that save to WordPress

---

## 🐛 Troubleshooting

### Products not loading?

1. Check environment variables in Dockploy
2. Verify WooCommerce API keys are correct
3. Check browser console for errors
4. Test API connection manually:

```bash
curl "https://jumplings.in/wp-json/wc/v3/products?per_page=1" \
  -u "ck_717db3f2db699eb3c8b77425e28ccb716d3661f3:cs_b536578381112bf7be0581eeaad03d3f6d963523"
```

### CORS errors?

Add to your WordPress `wp-config.php`:
```php
header('Access-Control-Allow-Origin: https://frontend.jumplings.in');
header('Access-Control-Allow-Credentials: true');
```

---

## 🔐 Security Notes

- ✅ `.env` is gitignored (never committed)
- ✅ Environment variables only visible in Dockploy admin
- ✅ API keys transmitted over HTTPS
- ✅ WooCommerce API uses authentication

---

## 📝 Quick Reference

**Your credentials (already configured):**
- WordPress URL: `https://jumplings.in`
- WooCommerce API: `https://jumplings.in/wp-json/wc/v3`
- Consumer Key: `ck_717db3f2db699eb3c8b77425e28ccb716d3661f3`
- Consumer Secret: `cs_b536578381112bf7be0581eeaad03d3f6d963523`

**Documentation:**
- Setup Guide: `WORDPRESS_SYNC_SETUP.md`
- Quick Summary: `WORDPRESS_INTEGRATION_SUMMARY.md`
- This file: `DEPLOYMENT.md`

---

Ready to deploy! 🚀
