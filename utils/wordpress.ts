import { Product, CartItem } from '../types';

// Configuration: Prefer Environment Variables, fall back to hardcoded strings for local dev
const getEnv = (key: string) => {
  // @ts-ignore
  return import.meta.env?.[key] || process.env?.[key] || '';
};

const WP_API_URL = getEnv('VITE_WP_API_URL') || 'https://api.thelagaadi.com/wp-json/wc/v3'; 
const CONSUMER_KEY = getEnv('VITE_CONSUMER_KEY') || 'ck_YOUR_CONSUMER_KEY'; 
const CONSUMER_SECRET = getEnv('VITE_CONSUMER_SECRET') || 'cs_YOUR_CONSUMER_SECRET';
export const RAZORPAY_KEY_ID = getEnv('VITE_RAZORPAY_KEY_ID') || 'rzp_test_YOUR_ID_HERE';

/**
 * Fetches products from WooCommerce
 */
export const fetchWooProducts = async (): Promise<Product[]> => {
  try {
    const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    
    const response = await fetch(`${WP_API_URL}/products?per_page=100&status=publish`, {
      headers: {
        'Authorization': `Basic ${auth}`,
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
    const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery',
      set_paid: false,
      status: paymentMethod === 'razorpay' ? 'pending' : 'processing', // Pending for online, Processing for COD
      customer_id: customerId ? Number(customerId) : 0,
      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address,
        city: customer.city,
        state: '',
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
        state: '',
        postcode: customer.pincode,
        country: 'IN'
      },
      line_items: items.map(item => ({
        product_id: Number(item.id),
        quantity: item.quantity,
      }))
    };

    const response = await fetch(`${WP_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error('Order creation failed');
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
        const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
        const response = await fetch(`${WP_API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${auth}`,
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
        const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
        const response = await fetch(`${WP_API_URL}/orders?customer=${customerId}`, {
            headers: {
                'Authorization': `Basic ${auth}`,
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