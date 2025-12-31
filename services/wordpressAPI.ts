import { Product } from '../types';

// WordPress/WooCommerce API Configuration
const WP_URL = import.meta.env.VITE_WORDPRESS_URL;
// Support both standard VITE_WC_ prefix and VITE_ prefix (fallback)
const WC_CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || import.meta.env.VITE_CONSUMER_KEY;
const WC_CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || import.meta.env.VITE_CONSUMER_SECRET;
const WC_API_URL = import.meta.env.DEV ? '/wp-json/wc/v3' : `${WP_URL}/wp-json/wc/v3`;

// Create Basic Auth header for WooCommerce
const getAuthHeader = () => {
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
        console.error("Missing WooCommerce API Keys in environment variables");
        return '';
    }
    const credentials = btoa(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`);
    return `Basic ${credentials}`;
};

// ==================== PRODUCT SYNC ====================

/**
 * Fetch all products from WooCommerce
 */
export const fetchWooCommerceProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${WC_API_URL}/products?per_page=100`, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const wooProducts = await response.json();

        // Transform WooCommerce products to your Product type
        return wooProducts.map((wooProduct: any) => transformWooProductToLocal(wooProduct));
    } catch (error) {
        console.error('Error fetching WooCommerce products:', error);
        return [];
    }
};

/**
 * Transform WooCommerce product format to your local Product type
 */
const transformWooProductToLocal = (wooProduct: any): Product => {
    return {
        id: wooProduct.id.toString(),
        slug: wooProduct.slug,
        name: wooProduct.name,
        subtitle: wooProduct.short_description || '',
        description: wooProduct.description || wooProduct.short_description || '',
        price: parseFloat(wooProduct.price),
        currency: 'INR',
        category: wooProduct.categories?.[0]?.name || 'Uncategorized',
        images: wooProduct.images?.map((img: any) => img.src) || [],
        tags: wooProduct.tags?.map((tag: any) => tag.name) || [],
        isNew: wooProduct.featured || false,
        colorHex: wooProduct.attributes?.find((attr: any) => attr.name === 'Color')?.options?.[0] || '#000000',
        stock: wooProduct.stock_quantity || 0,
        variants: wooProduct.attributes?.find((attr: any) => attr.name === 'Size')?.options?.map((size: string) => ({
            size,
            stock: wooProduct.stock_quantity || 0
        })) || [{ size: 'Free Size', stock: wooProduct.stock_quantity || 0 }]
    };
};

/**
 * Sync local product to WooCommerce
 */
export const syncProductToWooCommerce = async (product: Product): Promise<boolean> => {
    try {
        const wooProduct = transformLocalProductToWoo(product);

        // Check if product exists by slug
        const existingResponse = await fetch(`${WC_API_URL}/products?slug=${product.slug}`, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        const existingProducts = await existingResponse.json();

        let response;
        if (existingProducts.length > 0) {
            // Update existing product
            response = await fetch(`${WC_API_URL}/products/${existingProducts[0].id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(wooProduct),
            });
        } else {
            // Create new product
            response = await fetch(`${WC_API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(wooProduct),
            });
        }

        if (!response.ok) {
            throw new Error(`Failed to sync product: ${response.statusText}`);
        }

        console.log(`✅ Product "${product.name}" synced to WooCommerce`);
        return true;
    } catch (error) {
        console.error('Error syncing product to WooCommerce:', error);
        return false;
    }
};

/**
 * Transform local Product to WooCommerce format
 */
const transformLocalProductToWoo = (product: Product) => {
    return {
        name: product.name,
        slug: product.slug,
        type: 'simple',
        regular_price: product.price.toString(),
        description: product.description,
        short_description: product.subtitle,
        categories: [{ name: product.category }],
        images: product.images.map(url => ({ src: url })),
        tags: product.tags.map(name => ({ name })),
        featured: product.isNew,
        stock_quantity: product.stock,
        manage_stock: true,
        attributes: [
            {
                name: 'Size',
                visible: true,
                variation: false,
                options: product.variants.map(v => v.size)
            }
        ]
    };
};

// ==================== ORDER SYNC ====================

/**
 * Create order in WooCommerce
 */
export const createWooCommerceOrder = async (orderData: any): Promise<any> => {
    try {
        const response = await fetch(`${WC_API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating WooCommerce order:', error);
        throw error;
    }
};

/**
 * Update stock in WooCommerce
 */
export const updateWooCommerceStock = async (productId: string, quantity: number): Promise<boolean> => {
    try {
        const response = await fetch(`${WC_API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stock_quantity: quantity
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update stock: ${response.statusText}`);
        }

        console.log(`✅ Stock updated for product ${productId}: ${quantity}`);
        return true;
    } catch (error) {
        console.error('Error updating stock:', error);
        return false;
    }
};

// ==================== WEBHOOK HANDLERS ====================

/**
 * Handle incoming webhook from WordPress
 */
export const handleWordPressWebhook = async (webhookData: any) => {
    const { action, data } = webhookData;

    switch (action) {
        case 'product.updated':
        case 'product.created':
            // Refresh products from WooCommerce
            return await fetchWooCommerceProducts();

        case 'order.created':
            // Handle new order notification
            console.log('New order created in WooCommerce:', data);
            break;

        case 'stock.updated':
            // Update local stock
            console.log('Stock updated in WooCommerce:', data);
            break;

        default:
            console.log('Unknown webhook action:', action);
    }
};

export default {
    fetchWooCommerceProducts,
    syncProductToWooCommerce,
    createWooCommerceOrder,
    updateWooCommerceStock,
    handleWordPressWebhook,
};
