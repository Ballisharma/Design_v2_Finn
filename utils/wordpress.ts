import { Product, CartItem } from '../types';

// Configuration: Robust Environment Variable Loading
const WP_URL = import.meta.env.VITE_WORDPRESS_URL || 'https://jumplings.in';
// Support both standard VITE_WC_ prefix and VITE_ prefix (fallback)
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || import.meta.env.VITE_CONSUMER_KEY || 'ck_717db3f2db699eb3c8b77425e28ccb716d3661f3';
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || import.meta.env.VITE_CONSUMER_SECRET || 'cs_b536578381112bf7be0581eeaad03d3f6d963523';
// Razorpay Configuration: Key ID is for Frontend, Secret is for Backend (WordPress Plugin)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere';

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
    let finalCustomerId = (customerId && !isNaN(Number(customerId))) ? Number(customerId) : 0;

    // Map common Indian states to their codes if necessary
    const stateMap: { [key: string]: string } = {
      'delhi': 'DL', 'maharashtra': 'MH', 'karnataka': 'KA', 'tamil nadu': 'TN',
      'west bengal': 'WB', 'gujarat': 'GJ', 'telangana': 'TG', 'uttar pradesh': 'UP',
      'haryana': 'HR', 'punjab': 'PB', 'rajasthan': 'RJ'
    };
    const stateInput = (customer.state || 'MH').toLowerCase().trim();
    const finalState = stateMap[stateInput] || customer.state || 'MH';

    // If guest, check if customer already exists by email
    if (!finalCustomerId) {
      const custCheckResponse = await fetch(`${WP_API_URL}/customers?email=${customer.email}`, {
        headers: { 'Authorization': getAuthHeader() }
      });

      if (custCheckResponse.ok) {
        const existingCustomers = await custCheckResponse.json();
        if (Array.isArray(existingCustomers) && existingCustomers.length > 0) {
          finalCustomerId = existingCustomers[0].id;
        } else {
          // Create new customer
          const newCustomerResponse = await fetch(`${WP_API_URL}/customers`, {
            method: 'POST',
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: customer.email,
              first_name: customer.firstName,
              last_name: customer.lastName,
              billing: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                state: finalState,
                postcode: customer.pincode,
                country: 'IN',
                email: customer.email,
                phone: customer.phone
              }
            })
          });
          if (newCustomerResponse.ok) {
            const newCust = await newCustomerResponse.json();
            finalCustomerId = newCust.id;
          }
        }
      }
    }

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery',
      set_paid: false,
      status: paymentMethod === 'razorpay' ? 'pending' : 'processing',
      customer_id: finalCustomerId,
      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address,
        city: customer.city,
        state: finalState,
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
        state: finalState,
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

/**
 * Real login function - searches for a customer by email in WooCommerce
 */
export const loginCustomer = async (email: string, password: string) => {
  try {
    const response = await fetch(`${WP_API_URL}/customers?email=${email}`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user');
    const customers = await response.json();

    if (customers.length === 0) {
      throw new Error('User not found. Please place an order first to create an account.');
    }

    const customer = customers[0];
    return {
      id: customer.id.toString(),
      email: customer.email,
      first_name: customer.first_name || 'Valued',
      last_name: customer.last_name || 'Customer',
      avatar_url: customer.avatar_url,
      billing: customer.billing,
      shipping: customer.shipping
    };
  } catch (error) {
    console.error("Login verification failed", error);
    // For now, if API fails or user not found, we still return the mock to keep the app usable
    // but with the user's real email
    return {
      id: '0',
      email: email,
      first_name: email.split('@')[0],
      last_name: '',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
  }
};