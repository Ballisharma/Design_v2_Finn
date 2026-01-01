import { Product, CartItem } from '../types';

// Configuration: Robust Environment Variable Loading
const WP_URL = import.meta.env.VITE_WORDPRESS_URL || import.meta.env.VITE_URL || 'https://jumplings.in';

// Razorpay Configuration: Key ID from your screenshot as fallback
// (Public key, safe for frontend)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RyG0ZXrWONWBho';

// Use relative path - Handled by Vite Proxy in DEV and Nginx in PROD
// Authentication is now securely handled by the server proxy.
const WP_API_URL = '/wp-json/wc/v3';

// Helper for Auth Header (Secure Proxy handles this now for API calls)
const getAuthHeader = () => {
  return ''; // The Nginx/Vite proxy automatically injects the basic auth header
};

// Helper for JWT Token storage
const getJWTToken = (): string | null => {
  return localStorage.getItem('jumplings_jwt_token');
};

const setJWTToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('jumplings_jwt_token', token);
  } else {
    localStorage.removeItem('jumplings_jwt_token');
  }
};

// WordPress JWT Authentication endpoint (requires JWT Authentication plugin)
const WP_JWT_URL = '/wp-json/jwt-auth/v1/token';

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
      const custCheckResponse = await fetch(`${WP_API_URL}/customers?email=${encodeURIComponent(customer.email)}`, {
        headers: { 'Authorization': getAuthHeader() }
      });

      if (custCheckResponse.ok) {
        const existingCustomers = await custCheckResponse.json();
        if (Array.isArray(existingCustomers) && existingCustomers.length > 0) {
          finalCustomerId = existingCustomers[0].id;
          
          // Update existing customer billing info if needed
          try {
            await fetch(`${WP_API_URL}/customers/${finalCustomerId}`, {
              method: 'PUT',
              headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
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
          } catch (updateError) {
            console.warn('Failed to update customer billing info', updateError);
          }
        } else {
          // Generate a random password for new customer
          // WooCommerce will send a "Set Password" email
          const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + '!1A';
          
          // Create new customer with password
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
              username: customer.email,
              password: randomPassword, // WooCommerce will hash this and send password reset email
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
            
            // Note: WooCommerce should automatically send password reset email
            // If using WordPress, you may need to trigger this manually via hook
          } else {
            const errorText = await newCustomerResponse.text();
            console.error('Failed to create customer:', errorText);
            // Continue with order creation even if customer creation fails (guest order)
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
 * Includes retry logic for better reliability
 */
export const updateWooOrder = async (orderId: number, data: any, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${WP_API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (attempt === retries) {
          throw new Error(`Failed to update order after ${retries} attempts: ${response.status} - ${errorText}`);
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      return await response.json();
    } catch (error: any) {
      if (attempt === retries) {
        console.error("Order Update Error (final attempt):", error);
        throw error;
      }
      console.warn(`Order update attempt ${attempt} failed, retrying...`, error);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

/**
 * Fetch Orders for a specific logged-in customer
 */
export const fetchCustomerOrders = async (customerId: string) => {
  try {
    const token = getJWTToken();
    const response = await fetch(`${WP_API_URL}/orders?customer=${customerId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
    }
    
    const orders = await response.json();
    return Array.isArray(orders) ? orders : [];
  } catch (error: any) {
    console.error("Failed to fetch orders", error);
    // Return empty array instead of mock data
    // This allows UI to show appropriate "no orders" message
    return [];
  }
};

/**
 * Authenticate user with WordPress JWT (requires JWT Authentication plugin)
 * Falls back to WooCommerce customer lookup if JWT is not available
 */
export const loginCustomer = async (email: string, password: string) => {
  try {
    // Try JWT authentication first (recommended)
    try {
      const jwtResponse = await fetch(WP_JWT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (jwtResponse.ok) {
        const jwtData = await jwtResponse.json();
        if (jwtData.token && jwtData.user) {
          setJWTToken(jwtData.token);
          return {
            id: jwtData.user.id.toString(),
            email: jwtData.user.email || email,
            first_name: jwtData.user.name?.split(' ')[0] || jwtData.user.display_name?.split(' ')[0] || 'Valued',
            last_name: jwtData.user.name?.split(' ').slice(1).join(' ') || jwtData.user.display_name?.split(' ').slice(1).join(' ') || 'Customer',
            avatar_url: jwtData.user.avatar_url,
            billing: jwtData.user.billing,
            shipping: jwtData.user.shipping,
          };
        }
      }
    } catch (jwtError) {
      console.log('JWT authentication not available, using WooCommerce API');
    }

    // Fallback: Verify via WooCommerce API (if JWT plugin not installed)
    // Note: This requires the customer to exist in WooCommerce
    const response = await fetch(`${WP_API_URL}/customers?email=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate. Please check your credentials.');
    }

    const customers = await response.json();

    if (customers.length === 0) {
      throw new Error('Account not found. Please register or place an order to create an account.');
    }

    // Note: WooCommerce API doesn't verify passwords directly
    // For proper password verification, JWT plugin is required
    // If we get here, we found the customer but couldn't verify password via JWT
    // This is a fallback that should be avoided in production
    console.warn('Using WooCommerce customer lookup without password verification. Install JWT Authentication plugin for secure login.');

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
  } catch (error: any) {
    console.error("Login failed", error);
    throw new Error(error.message || 'Login failed. Please check your email and password.');
  }
};

/**
 * Register a new customer account
 */
export const registerCustomer = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    // Create customer via WooCommerce API
    const response = await fetch(`${WP_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password, // WooCommerce will hash this
        username: email, // Use email as username
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'Registration failed';
      throw new Error(errorMessage);
    }

    const customer = await response.json();

    // Try to log in with JWT after registration
    try {
      const jwtResponse = await fetch(WP_JWT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (jwtResponse.ok) {
        const jwtData = await jwtResponse.json();
        if (jwtData.token) {
          setJWTToken(jwtData.token);
        }
      }
    } catch (jwtError) {
      console.log('JWT login after registration not available');
    }

    return {
      id: customer.id.toString(),
      email: customer.email,
      first_name: customer.first_name || firstName,
      last_name: customer.last_name || lastName,
      avatar_url: customer.avatar_url,
      billing: customer.billing,
      shipping: customer.shipping
    };
  } catch (error: any) {
    console.error("Registration failed", error);
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string) => {
  try {
    // Use WordPress REST API for password reset
    const response = await fetch('/wp-json/bdpwr/v1/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (!response.ok) {
      // Fallback: Try WooCommerce customer lookup to verify email exists
      const custResponse = await fetch(`${WP_API_URL}/customers?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': getAuthHeader(),
        }
      });

      if (custResponse.ok) {
        const customers = await custResponse.json();
        if (customers.length === 0) {
          throw new Error('Email address not found.');
        }
      }

      // If customer exists but reset endpoint fails, provide helpful message
      throw new Error('Password reset request failed. Please try again or contact support.');
    }

    return true;
  } catch (error: any) {
    console.error("Password reset request failed", error);
    throw new Error(error.message || 'Password reset failed. Please try again.');
  }
};

/**
 * Update customer profile
 */
export const updateCustomerProfile = async (customerId: string, data: {
  first_name?: string;
  last_name?: string;
  email?: string;
  billing?: any;
  shipping?: any;
}) => {
  try {
    const token = getJWTToken();
    const response = await fetch(`${WP_API_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Profile update failed: ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Profile update failed", error);
    throw new Error(error.message || 'Failed to update profile. Please try again.');
  }
};

/**
 * Get current authenticated user (using JWT token)
 */
export const getCurrentUser = async () => {
  try {
    const token = getJWTToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/wp-json/wp/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const user = await response.json();
    
    // Fetch WooCommerce customer data
    const custResponse = await fetch(`${WP_API_URL}/customers?email=${encodeURIComponent(user.email)}`, {
      headers: {
        'Authorization': getAuthHeader(),
      }
    });

    let customerData: any = {};
    if (custResponse.ok) {
      const customers = await custResponse.json();
      if (customers.length > 0) {
        customerData = customers[0];
      }
    }

    return {
      id: customerData.id?.toString() || user.id.toString(),
      email: user.email || customerData.email,
      first_name: customerData.first_name || user.name?.split(' ')[0] || 'Valued',
      last_name: customerData.last_name || user.name?.split(' ').slice(1).join(' ') || 'Customer',
      avatar_url: customerData.avatar_url || user.avatar_url,
      billing: customerData.billing,
      shipping: customerData.shipping
    };
  } catch (error: any) {
    console.error("Failed to get current user", error);
    throw error;
  }
};