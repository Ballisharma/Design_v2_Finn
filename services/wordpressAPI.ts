import { Product } from '../types';
import { cacheManager, CacheKeys, CacheTTL } from './cacheManager';

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
 * Fetch all products from WooCommerce with caching
 */
export const fetchWooCommerceProducts = async (forceRefresh: boolean = false): Promise<Product[]> => {
    try {
        // Check cache first
        if (!forceRefresh) {
            const cached = await cacheManager.get<Product[]>(CacheKeys.products());
            if (cached) {
                console.log('📦 Using cached products');
                return cached;
            }
        }

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

        // **OPTIMIZATION: Parallel variation fetching**
        // Instead of fetching variations one-by-one, fetch all in parallel
        const variableProductIds = wooProducts
            .filter((p: any) => p.type === 'variable')
            .map((p: any) => p.id);

        console.log(`🔄 Fetching variations for ${variableProductIds.length} variable products in parallel...`);

        // Fetch all variations in parallel
        const allVariationsResults = await Promise.all(
            variableProductIds.map((id: number) => fetchProductVariations(id))
        );

        // Create a map of product ID to variations
        const variationsMap = new Map<number, any[]>(
            variableProductIds.map((id: number, idx: number) => [id, allVariationsResults[idx]])
        );

        // Transform products with variations already available
        const products = wooProducts.map((wooProduct: any) =>
            transformWooProductToLocal(wooProduct, variationsMap)
        );

        // Cache the results
        await cacheManager.set(CacheKeys.products(), products, CacheTTL.products);
        console.log('✅ Products cached for 5 minutes');

        return products;
    } catch (error) {
        console.error('Error fetching WooCommerce products:', error);
        return [];
    }
};

/**
 * Fetch variations for a variable product with caching
 */
const fetchProductVariations = async (productId: number): Promise<any[]> => {
    try {
        // Check cache first
        const cacheKey = CacheKeys.variations(productId);
        const cached = await cacheManager.get<any[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const url = `${WC_API_URL}/products/${productId}/variations?per_page=100`;
        const response = await fetch(url, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch variations for product ${productId}`);
            return [];
        }

        const variations = await response.json();

        // Cache variations for 10 minutes
        await cacheManager.set(cacheKey, variations, CacheTTL.variations);

        return variations;
    } catch (error) {
        console.error(`Error fetching variations for product ${productId}:`, error);
        return [];
    }
};

/**
 * Transform WooCommerce product format to your local Product type
 * Now synchronous since variations are pre-fetched
 */
const transformWooProductToLocal = (wooProduct: any, variationsMap: Map<number, any[]>): Product => {
    let variants = [];
    let totalStock = 0;

    // Check if it's a variable product
    if (wooProduct.type === 'variable') {
        // Get variations from pre-fetched map
        const variations = variationsMap.get(wooProduct.id) || [];

        if (variations.length > 0) {
            variants = variations.map((variation: any) => {
                const size = variation.attributes?.find((attr: any) => attr.name.toLowerCase().includes('size'))?.option || 'Free Size';
                const stock = variation.stock_quantity || 0;
                totalStock += stock;

                return {
                    size,
                    stock
                };
            });
        } else {
            // Fallback to attributes if variations fetch fails
            const sizeOptions = wooProduct.attributes?.find((attr: any) => attr.name === 'Size')?.options || [];
            variants = sizeOptions.map((size: string) => ({
                size,
                stock: 0
            }));
        }
    } else {
        // Simple product - use parent stock
        totalStock = wooProduct.stock_quantity || 0;
        variants = [{ size: 'Free Size', stock: totalStock }];
    }

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
        stock: totalStock,
        variants
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

        // Invalidate cache after sync
        await cacheManager.delete(CacheKeys.products());

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

        // Invalidate product cache after order (stock changed)
        await cacheManager.delete(CacheKeys.products());

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

        // Invalidate cache after stock update
        await cacheManager.delete(CacheKeys.products());

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
            // Invalidate cache and refresh
            await cacheManager.delete(CacheKeys.products());
            return await fetchWooCommerceProducts(true);

        case 'order.created':
            // Handle new order notification
            console.log('New order created in WooCommerce:', data);
            // Invalidate cache (stock changed)
            await cacheManager.delete(CacheKeys.products());
            break;

        case 'stock.updated':
            // Update local stock
            console.log('Stock updated in WooCommerce:', data);
            await cacheManager.delete(CacheKeys.products());
            break;

        default:
            console.log('Unknown webhook action:', action);
    }
};

/**
 * Clear all WordPress API cache
 */
export const clearWooCommerceCache = async (): Promise<void> => {
    await cacheManager.clear();
    console.log('🗑️ WordPress API cache cleared');
};

export default {
    fetchWooCommerceProducts,
    syncProductToWooCommerce,
    createWooCommerceOrder,
    updateWooCommerceStock,
    handleWordPressWebhook,
    clearWooCommerceCache,
};
