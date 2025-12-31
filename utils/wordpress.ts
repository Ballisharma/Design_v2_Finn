import { Product, CartItem } from '../types';

// Configuration: Robust Environment Variable Loading
const WP_URL = import.meta.env.VITE_WORDPRESS_URL || 'https://jumplings.in';
// Support both standard VITE_WC_ prefix and VITE_ prefix (fallback)
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || import.meta.env.VITE_CONSUMER_KEY || 'ck_717db3f2db699eb3c8b77425e28ccb716d3661f3';
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || import.meta.env.VITE_CONSUMER_SECRET || 'cs_b536578381112bf7be0581eeaad03d3f6d963523';
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

// Use relative path in DEV to leverage Vite Proxy (bypassing CORS)
const WP_API_URL = '/wp-json/wc/v3';

// Helper for Auth Header
const getAuthHeader = () => {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.warn("⚠️ WooCommerce API Keys missing in this environment");
    return '';
  }
  return `Basic ${btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)}`;
};

/**
 * Fetches products from WooCommerce
 */
export const fetchWooProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${WP_API_URL}/products?per_page=100&status=publish`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch from WooCommerce');

    const wooData = await response.json();

    return wooData.map((item: any) => ({
      id: item.id.toString(),
      slug: item.slug,
      name: item.name,
      subtitle: item.short_description.replace(/<[^>]*>?/gm, '') || 'Premium Collection',
      description: item.description.replace(/<[^>]*>?/gm, ''),
      price: parseFloat(item.price),
      currency: 'INR',
      category: item.categories[0]?.name || 'Uncategorized',
      images: item.images.map((img: any) => img.src),
      tags: item.tags.map((t: any) => t.name),
      isNew: item.date_created > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      colorHex: item.attributes.find((a: any) => a.name === 'Color')?.options[0] || '#FFD166',
      stock: item.stock_quantity || 0,
      variants: item.variations.length > 0
        ? []
        : [{ size: 'Free Size', stock: item.stock_quantity || 0 }]
    }));

  } catch (error) {
    console.error("WordPress Sync Error:", error);
    return [];
  }
};

/**
 * Sends a new order to WooCommerce
 */
export const createWooOrder = async (
  customer: any,
  items: CartItem[],
  total: number,
  paymentMethod: 'cod' | 'razorpay' = 'cod',
  customerId?: string
) => {
  try {
    const orderData = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery',
      set_paid: false,
      status: paymentMethod === 'razorpay' ? 'pending' : 'processing', // Pending for online, Processing for COD
      customer_id: (customerId && !isNaN(Number(customerId))) ? Number(customerId) : 0,
      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address,
        city: customer.city,
        state: customer.state || 'MH',
        postcode: customer.pincode,
        country: 'IN',
        email: customer.email,
        phone: customer.phone
      },
      shipping: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address,
        city: customer.city,
        state: customer.state || 'MH',
        postcode: customer.pincode,
        country: 'IN'
      },
      line_items: items.map(item => ({
        product_id: Number(item.id),
        quantity: item.quantity,
      }))
    };

    console.log("📤 Sending Order to WordPress:", orderData);

    const response = await fetch(`${WP_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ WordPress Order Failed:", response.status, errorText);
      throw new Error(`Order creation failed: ${errorText}`);
    }
    return await response.json();

  } catch (error) {
    console.error("Order Error:", error);
    throw error;
  }
};

/**
 * Updates a WooCommerce Order (e.g., after successful payment)
 */
export const updateWooOrder = async (orderId: number, data: any) => {
  try {
    const response = await fetch(`${WP_API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to update order');
    return await response.json();
  } catch (error) {
    console.error("Order Update Error:", error);
    throw error;
  }
};

/**
 * Fetch Orders for a specific logged-in customer
 */
export const fetchCustomerOrders = async (customerId: string) => {
  try {
    const response = await fetch(`${WP_API_URL}/orders?customer=${customerId}`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.warn("Using Mock Orders (WP API not reachable)");
    return [
      {
        id: 1024,
        status: 'processing',
        date_created: new Date().toISOString(),
        total: '899.00',
        currency: 'INR',
        line_items: [
          { name: 'Nano-Grip™ Pro (Black)', quantity: 2, total: '598.00' },
          { name: 'Geometric Aqua', quantity: 1, total: '399.00' }
        ]
      }
    ];
  }
};

export const loginCustomer = async (email: string, password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        email: email,
        first_name: 'Funky',
        last_name: 'Fan',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Funky'
      });
    }, 1000);
  });
};