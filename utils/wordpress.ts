import { Product, CartItem } from '../types';

// Configuration: Robust Environment Variable Loading
const WP_URL = import.meta.env.VITE_WORDPRESS_URL || import.meta.env.VITE_URL || 'https://admin.jumplings.in';

// Razorpay Configuration: Key ID from your screenshot as fallback
// (Public key, safe for frontend)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RyG0ZXrWONWBho';

// Use full WordPress URL for public GET requests (products, read-only)
const WP_API_URL_PUBLIC = `${WP_URL}/wp-json/wc/v3`;

// Use nginx proxy path for authenticated POST/PUT requests (orders, customers)
// The proxy adds authentication headers automatically
const WP_API_URL_AUTH = '/wp-json/wc/v3';

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
const WP_JWT_URL = `${WP_URL}/wp-json/jwt-auth/v1/token`;

/**
 * Fetches products from WooCommerce
 */
export const fetchWooProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${WP_API_URL_PUBLIC}/products?per_page=100&status=publish`, {
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
 * Includes all required WooCommerce fields for proper order creation
 */
export const createWooOrder = async (
  customer: any,
  items: CartItem[],
  total: number,
  paymentMethod: 'cod' | 'razorpay' = 'cod',
  customerId?: string,
  shippingCost: number = 0
) => {
  try {
    // Validate inputs
    if (!customer || !customer.email || !customer.firstName || !customer.lastName) {
      throw new Error('Customer information is incomplete. Please fill in all required fields.');
    }

    if (!items || items.length === 0) {
      throw new Error('Cart is empty. Cannot create order without items.');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      throw new Error('Please enter a valid email address.');
    }

    // Validate product IDs
    for (const item of items) {
      if (!item.id || isNaN(Number(item.id))) {
        throw new Error(`Invalid product ID for item: ${item.name}`);
      }
      if (!item.quantity || item.quantity < 1) {
        throw new Error(`Invalid quantity for item: ${item.name}`);
      }
      if (!item.price || item.price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }
    }

    let finalCustomerId = (customerId && !isNaN(Number(customerId))) ? Number(customerId) : 0;

    // Map common Indian states to their codes if necessary
    const stateMap: { [key: string]: string } = {
      'delhi': 'DL', 'maharashtra': 'MH', 'karnataka': 'KA', 'tamil nadu': 'TN',
      'west bengal': 'WB', 'gujarat': 'GJ', 'telangana': 'TG', 'uttar pradesh': 'UP',
      'haryana': 'HR', 'punjab': 'PB', 'rajasthan': 'RJ'
    };
    const stateInput = (customer.state || 'MH').toLowerCase().trim();
    const finalState = stateMap[stateInput] || customer.state || 'MH';

    // Calculate order totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalTax = 0; // No tax for now, but field is required
    const shippingTotal = shippingCost || 0;
    const orderTotal = subtotal + shippingTotal + totalTax;

    // Validate totals match
    if (Math.abs(orderTotal - total) > 0.01) {
      console.warn(`Order total mismatch: calculated ${orderTotal}, provided ${total}. Using calculated total.`);
    }

    // If guest, check if customer already exists by email
    if (!finalCustomerId) {
      const custCheckResponse = await fetch(`${WP_API_URL_PUBLIC}/customers?email=${encodeURIComponent(customer.email)}`, {
        headers: { 'Authorization': getAuthHeader() }
      });

      if (custCheckResponse.ok) {
        const existingCustomers = await custCheckResponse.json();
        if (Array.isArray(existingCustomers) && existingCustomers.length > 0) {
          finalCustomerId = existingCustomers[0].id;

          // Update existing customer billing info if needed
          try {
            await fetch(`${WP_API_URL_AUTH}/customers/${finalCustomerId}`, {
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
          // Generate a secure random password for new customer
          // Format: alphanumeric + special characters (meets WordPress requirements)
          const randomPassword = Math.random().toString(36).slice(-10) +
            Math.random().toString(36).slice(-10).toUpperCase() +
            '!@' +
            Math.floor(Math.random() * 100);

          // Create new customer with password
          const newCustomerResponse = await fetch(`${WP_API_URL_AUTH}/customers`, {
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
          } else {
            const errorText = await newCustomerResponse.text();
            console.error('Failed to create customer:', errorText);
            // Continue with order creation even if customer creation fails (guest order)
          }
        }
      }
    }

    // Build line items with required totals
    const lineItems = items.map(item => {
      const lineSubtotal = (item.price * item.quantity).toFixed(2);
      const lineTotal = (item.price * item.quantity).toFixed(2); // Same as subtotal if no discounts

      return {
        product_id: Number(item.id),
        quantity: item.quantity,
        subtotal: lineSubtotal, // Required: subtotal for this line
        total: lineTotal, // Required: total for this line (after discounts)
      };
    });

    // Build shipping lines
    const shippingLines = shippingTotal > 0 ? [{
      method_id: 'flat_rate',
      method_title: 'Standard Shipping',
      total: shippingTotal.toFixed(2)
    }] : [];

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery',
      set_paid: false,
      status: paymentMethod === 'razorpay' ? 'pending' : 'processing',
      customer_id: finalCustomerId || 0, // 0 for guest orders
      currency: 'INR', // Required: currency code
      total: orderTotal.toFixed(2), // Required: order total
      subtotal: subtotal.toFixed(2), // Subtotal before shipping/tax
      total_tax: totalTax.toFixed(2), // Required: total tax (even if 0)
      shipping_total: shippingTotal.toFixed(2), // Required: shipping cost
      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address,
        city: customer.city,
        state: finalState,
        postcode: customer.pincode,
        country: 'IN',
        email: customer.email,
        phone: customer.phone || ''
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
      line_items: lineItems, // Includes totals
      shipping_lines: shippingLines // Required: shipping information
    };

    console.log("📤 Sending Order to WordPress:", orderData);

    const response = await fetch(`${WP_API_URL_AUTH}/orders`, {
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

    const order = await response.json();

    // Trigger order confirmation email
    // WooCommerce REST API doesn't automatically send emails, so we need to trigger it
    try {
      await triggerOrderEmail(order.id);
    } catch (emailError) {
      console.warn("⚠️ Failed to trigger order email (order was created successfully):", emailError);
      // Don't fail the order creation if email trigger fails
    }

    return order;

  } catch (error) {
    console.error("Order Error:", error);
    throw error;
  }
};

/**
 * Triggers order confirmation email for a WooCommerce order
 * This is needed because REST API doesn't automatically send emails
 * 
 * Note: For this to work reliably, you may need to add a WordPress function
 * to your theme's functions.php or a custom plugin. See documentation.
 */
const triggerOrderEmail = async (orderId: number) => {
  try {
    // Get current order to check status
    const orderResponse = await fetch(`${WP_API_URL_PUBLIC}/orders/${orderId}`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!orderResponse.ok) {
      console.warn(`Could not fetch order ${orderId} to trigger email`);
      return; // Don't fail if we can't check status
    }

    const currentOrder = await orderResponse.json();
    const currentStatus = currentOrder.status;

    // Only update status if it's different - avoids unnecessary API calls
    // and ensures email is triggered by status change
    if (currentStatus === 'pending' || currentStatus === 'on-hold') {
      const updateResponse = await fetch(`${WP_API_URL_AUTH}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'processing'
        })
      });

      if (updateResponse.ok) {
        console.log("📧 Order status updated to trigger email for order #", orderId);
      } else {
        console.warn(`Failed to update order status for email trigger: ${updateResponse.status}`);
      }
    } else if (currentStatus === 'processing') {
      // Order is already processing, try adding a customer note to trigger email
      try {
        const noteResponse = await fetch(`${WP_API_URL_AUTH}/orders/${orderId}/notes`, {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            note: 'Thank you for your order!',
            customer_note: true // Customer notes can trigger emails
          })
        });

        if (noteResponse.ok) {
          console.log("📧 Customer note added to trigger email for order #", orderId);
        }
      } catch (noteError) {
        // Note creation failed, but that's okay - WordPress function should handle email
        console.warn("Could not add customer note (email should still be sent via WordPress function):", noteError);
      }
    }
  } catch (error) {
    // Don't throw - email failure shouldn't break order creation
    // WordPress function should handle email sending as backup
    console.warn("Failed to trigger order email (order was created successfully):", error);
  }
};

/**
 * Updates a WooCommerce Order (e.g., after successful payment)
 * Includes retry logic for better reliability
 */
export const updateWooOrder = async (orderId: number, data: any, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${WP_API_URL_AUTH}/orders/${orderId}`, {
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
    const response = await fetch(`${WP_API_URL_PUBLIC}/orders?customer=${customerId}`, {
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
 * SECURITY: Password verification is REQUIRED - no fallback without password check
 */
export const loginCustomer = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  try {
    // JWT authentication is REQUIRED - no fallback without password verification
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

    if (!jwtResponse.ok) {
      // Check if it's a 403 (wrong credentials) vs 404 (endpoint not found)
      if (jwtResponse.status === 403 || jwtResponse.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (jwtResponse.status === 404) {
        throw new Error('Authentication service unavailable. Please contact support or install JWT Authentication plugin on WordPress.');
      } else {
        const errorData = await jwtResponse.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.code || 'Authentication failed';
        throw new Error(errorMessage);
      }
    }

    const jwtData = await jwtResponse.json();

    if (!jwtData.token || !jwtData.user) {
      throw new Error('Invalid authentication response. Please try again.');
    }

    setJWTToken(jwtData.token);

    // Fetch WooCommerce customer data to get billing/shipping info
    let customerData: any = {};
    try {
      const custResponse = await fetch(`${WP_API_URL_PUBLIC}/customers?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': getAuthHeader(),
        }
      });

      if (custResponse.ok) {
        const customers = await custResponse.json();
        if (Array.isArray(customers) && customers.length > 0) {
          customerData = customers[0];
        }
      }
    } catch (custError) {
      console.warn('Could not fetch WooCommerce customer data:', custError);
      // Continue with JWT user data even if customer fetch fails
    }

    return {
      id: customerData.id?.toString() || jwtData.user.id.toString(),
      email: jwtData.user.email || email,
      first_name: customerData.first_name || jwtData.user.name?.split(' ')[0] || jwtData.user.display_name?.split(' ')[0] || 'Valued',
      last_name: customerData.last_name || jwtData.user.name?.split(' ').slice(1).join(' ') || jwtData.user.display_name?.split(' ').slice(1).join(' ') || 'Customer',
      avatar_url: customerData.avatar_url || jwtData.user.avatar_url,
      billing: customerData.billing || jwtData.user.billing,
      shipping: customerData.shipping || jwtData.user.shipping
    };
  } catch (error: any) {
    console.error("Login failed", error);
    // Re-throw with user-friendly message if it's our error
    if (error.message && error.message !== 'Login failed') {
      throw error;
    }
    throw new Error('Login failed. Please check your email and password, or contact support if the problem persists.');
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
    const response = await fetch(`${WP_API_URL_AUTH}/customers`, {
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
 * Request password reset via WordPress/WooCommerce
 * Uses custom WordPress endpoint (requires WordPress function in functions.php)
 */
export const requestPasswordReset = async (email: string) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    // Method 1: Try custom WordPress REST API endpoint
    try {
      const response = await fetch(`${WP_URL}/wp-json/jumplings/v1/lost-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json().catch(() => ({}));
        // If it's a 404, the endpoint isn't installed
        if (response.status === 404) {
          console.warn('Custom lost-password endpoint not found (404)');
        } else {
          throw new Error(errorData.message || 'Password reset request failed.');
        }
      }
    } catch (customError: any) {
      console.log('Error with custom endpoint, falling back to verification:', customError.message);
    }

    // Method 2: Verify customer exists first as a fallback
    const custResponse = await fetch(`${WP_API_URL_PUBLIC}/customers?email=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': getAuthHeader(),
      }
    });

    if (!custResponse.ok) {
      throw new Error('Unable to verify email address. Please contact support or try again later.');
    }

    const customers = await custResponse.json();
    if (!Array.isArray(customers) || customers.length === 0) {
      throw new Error('No account found with this email address. Please check your email or register for a new account.');
    }

    // Method 3: If we are here, the email exists but our custom endpoints might be missing
    // Try to trigger the standard WordPress reset if possible, otherwise provide instructions
    try {
      const response = await fetch(`${WP_URL}/wp-json/jumplings/v1/send-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_login: email,
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Password reset email sent successfully.' };
      }
    } catch (e) {
      console.warn('Standard reset endpoint also failed');
    }

    // Final Fallback: Inform user that configuration is required
    throw new Error('Password reset service is not fully configured on the server. Please contact support or use the standard WordPress password reset page.');

  } catch (error: any) {
    console.error("Password reset request failed:", error);
    throw new Error(error.message || 'Failed to send password reset request. Please try again or contact support.');
  }
};

/**
 * Reset password with reset token (from email link)
 * This is called when user clicks the reset link from email
 */
export const resetPasswordWithToken = async (login: string, key: string, newPassword: string) => {
  try {
    // Validate password strength
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    // Validate password requirements
    if (!/[A-Z]/.test(newPassword)) {
      throw new Error('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(newPassword)) {
      throw new Error('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(newPassword)) {
      throw new Error('Password must contain at least one number.');
    }

    // Method 1: Try custom WordPress REST API endpoint
    try {
      const response = await fetch(`${WP_URL}/wp-json/jumplings/v1/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login,
          key: key,
          password: newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error('Password reset service is not fully configured on the server. Please contact support.');
        }
        throw new Error(errorData.message || 'Password reset failed. The link may have expired.');
      }
    } catch (customError: any) {
      if (customError.message.includes('not fully configured')) throw customError;
      throw new Error('Failed to reach password reset service. Please try again or contact support.');
    }
  } catch (error: any) {
    console.error("Password reset with token failed:", error);
    throw new Error(error.message || 'Failed to reset password. The link may have expired or service is unavailable.');
  }
};

/**
 * Update customer profile
 * Includes validation and proper data structure
 */
export const updateCustomerProfile = async (customerId: string, data: {
  first_name?: string;
  last_name?: string;
  email?: string;
  billing?: any;
  shipping?: any;
}) => {
  try {
    // Validate customer ID
    if (!customerId || isNaN(Number(customerId))) {
      throw new Error('Invalid customer ID');
    }

    // Validate input data
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address.');
      }
    }

    if (data.first_name && data.first_name.trim().length === 0) {
      throw new Error('First name cannot be empty.');
    }

    if (data.last_name && data.last_name.trim().length === 0) {
      throw new Error('Last name cannot be empty.');
    }

    // Build update payload - ensure billing and shipping are properly structured
    const updateData: any = {};

    if (data.first_name) updateData.first_name = data.first_name.trim();
    if (data.last_name) updateData.last_name = data.last_name.trim();
    if (data.email) updateData.email = data.email.trim().toLowerCase();

    // Include billing if provided
    if (data.billing) {
      updateData.billing = {
        ...data.billing,
        country: data.billing.country || 'IN'
      };
    }

    // Include shipping if provided (use billing as default if shipping not provided but billing is)
    if (data.shipping) {
      updateData.shipping = {
        ...data.shipping,
        country: data.shipping.country || 'IN'
      };
    } else if (data.billing) {
      // If shipping not provided but billing is, copy billing to shipping
      updateData.shipping = {
        first_name: data.billing.first_name || updateData.first_name,
        last_name: data.billing.last_name || updateData.last_name,
        address_1: data.billing.address_1 || '',
        address_2: data.billing.address_2 || '',
        city: data.billing.city || '',
        state: data.billing.state || '',
        postcode: data.billing.postcode || '',
        country: data.billing.country || 'IN'
      };
    }

    const token = getJWTToken();
    const response = await fetch(`${WP_API_URL_AUTH}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Profile update failed';

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.code || errorMessage;
      } catch (e) {
        errorMessage = errorText.substring(0, 200); // Limit error message length
      }

      throw new Error(errorMessage);
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
    const custResponse = await fetch(`${WP_API_URL_PUBLIC}/customers?email=${encodeURIComponent(user.email)}`, {
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