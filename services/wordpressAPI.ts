import { Product } from '../types';

// WordPress/WooCommerce API Configuration
const WP_URL = import.meta.env.VITE_WORDPRESS_URL || 'https://jumplings.in';

// Use relative path - handled by Vite Proxy in DEV and Nginx in PROD
// Authentication is securely handled by the server proxy (Nginx).
const WC_API_URL = '/wp-json/wc/v3';

// Create Basic Auth header (Secure Proxy handles this now)
const getAuthHeader = () => {
    return ''; // The Nginx/Vite proxy automatically injects the basic auth header
};

// ==================== PRODUCT SYNC ====================

/**
 * Fetch all products from WooCommerce
 */
export const fetchWooCommerceProducts = async (): Promise<Product[]> => {
    try {
        // Add cache busting to ensure we get fresh data from the server
        const cacheBuster = `_=${Date.now()}`;
        const url = `${WC_API_URL}/products?per_page=100&status=publish&${cacheBuster}`;

        console.log(`📥 Fetching fresh products from: ${url}`);

        const response = await fetch(url, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("WP API Failure:", response.status, errText);
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
    // If it's a variable product, the parent stock might be empty.
    // In a real app, we'd fetch variations, but for now we rely on manage_stock being true.
    const productStock = wooProduct.stock_quantity || 0;

    return {
        id: wooProduct.id.toString(),
        slug: wooProduct.slug,
        name: wooProduct.name,
        subtitle: wooProduct.short_description?.replace(/<[^>]*>?/gm, '') || '',
        description: wooProduct.description?.replace(/<[^>]*>?/gm, '') || wooProduct.short_description?.replace(/<[^>]*>?/gm, '') || '',
        price: parseFloat(wooProduct.price),
        currency: 'INR',
        category: wooProduct.categories?.[0]?.name || 'Uncategorized',
        images: wooProduct.images?.map((img: any) => img.src) || [],
        tags: wooProduct.tags?.map((tag: any) => tag.name) || [],
        isNew: wooProduct.featured || false,
        colorHex: wooProduct.attributes?.find((attr: any) => attr.name === 'Color')?.options?.[0] || '#000000',
        stock: productStock,
        variants: wooProduct.attributes?.find((attr: any) => attr.name === 'Size')?.options?.map((size: string) => ({
            size,
            stock: productStock // Default to parent stock if specific variation stock isn't fetched
        })) || [{ size: 'Free Size', stock: productStock }]
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
                body: JSON.stringify({ ...wooProduct, manage_stock: true }),
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
                stock_quantity: quantity,
                manage_stock: true
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
