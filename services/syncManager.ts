import { Product } from '../types';
import { PRODUCTS as LOCAL_PRODUCTS } from '../constants';
import {
    fetchWooCommerceProducts,
    syncProductToWooCommerce,
    updateWooCommerceStock
} from './wordpressAPI';

/**
 * Bi-Directional Sync Manager
 * Handles synchronization between local state and WordPress/WooCommerce
 */

export type SyncDirection = 'wordpress-to-local' | 'local-to-wordpress' | 'bidirectional';

export interface SyncResult {
    success: boolean;
    synced: number;
    failed: number;
    errors: string[];
}

/**
 * Main sync function
 */
export const syncProducts = async (direction: SyncDirection = 'bidirectional'): Promise<SyncResult> => {
    const result: SyncResult = {
        success: true,
        synced: 0,
        failed: 0,
        errors: []
    };

    try {
        if (direction === 'wordpress-to-local' || direction === 'bidirectional') {
            // Pull products from WordPress
            console.log('📥 Fetching products from WooCommerce...');
            const wooProducts = await fetchWooCommerceProducts();

            if (wooProducts.length > 0) {
                result.synced += wooProducts.length;
                console.log(`✅ Fetched ${wooProducts.length} products from WooCommerce`);

                // Store in localStorage or update context
                localStorage.setItem('woo_products', JSON.stringify(wooProducts));
                localStorage.setItem('last_sync', new Date().toISOString());
            }
        }

        if (direction === 'local-to-wordpress' || direction === 'bidirectional') {
            // Push local products to WordPress
            console.log('📤 Syncing local products to WooCommerce...');

            for (const product of LOCAL_PRODUCTS) {
                const success = await syncProductToWooCommerce(product);
                if (success) {
                    result.synced++;
                } else {
                    result.failed++;
                    result.errors.push(`Failed to sync: ${product.name}`);
                }
            }

            console.log(`✅ Synced ${result.synced} products to WooCommerce`);
        }

    } catch (error: any) {
        result.success = false;
        result.errors.push(error.message);
        console.error('Sync error:', error);
    }

    return result;
};

/**
 * Get merged products (local + WordPress)
 * Prioritizes WordPress data if available
 */
export const getMergedProducts = async (): Promise<Product[]> => {
    try {
        // Try to get cached WooCommerce products
        const cached = localStorage.getItem('woo_products');
        const lastSync = localStorage.getItem('last_sync');

        // Check if cache is fresh (less than 1 minute old)
        const isCacheFresh = lastSync &&
            (Date.now() - new Date(lastSync).getTime()) < 1 * 60 * 1000;

        if (cached && isCacheFresh) {
            console.log('📦 Using cached WooCommerce products');
            return JSON.parse(cached);
        }

        // Fetch fresh data from WooCommerce
        console.log('🔄 Fetching fresh products from WooCommerce...');
        const wooProducts = await fetchWooCommerceProducts();

        if (wooProducts.length > 0) {
            localStorage.setItem('woo_products', JSON.stringify(wooProducts));
            localStorage.setItem('last_sync', new Date().toISOString());
            return wooProducts;
        }

        // Fallback to local products if WordPress is unavailable
        console.log('⚠️ Using local products (WordPress unavailable)');
        return LOCAL_PRODUCTS;

    } catch (error) {
        console.error('Error getting merged products:', error);
        return LOCAL_PRODUCTS;
    }
};

/**
 * Sync stock levels after purchase
 */
export const syncStockAfterPurchase = async (
    productId: string,
    quantityPurchased: number
): Promise<boolean> => {
    try {
        // Get current product data
        const products = await getMergedProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }

        // Calculate new stock
        const newStock = product.stock - quantityPurchased;

        // Update in WooCommerce
        const success = await updateWooCommerceStock(productId, newStock);

        if (success) {
            // Update local cache
            const cachedProducts = products.map(p =>
                p.id === productId ? { ...p, stock: newStock } : p
            );
            localStorage.setItem('woo_products', JSON.stringify(cachedProducts));
        }

        return success;
    } catch (error) {
        console.error('Error syncing stock:', error);
        return false;
    }
};

/**
 * Force a full sync (useful for manual refresh)
 */
export const forceFullSync = async (): Promise<SyncResult> => {
    // Clear cache to force fresh fetch
    localStorage.removeItem('woo_products');
    localStorage.removeItem('last_sync');

    return await syncProducts('bidirectional');
};

/**
 * Check sync status
 */
export const getSyncStatus = () => {
    const lastSync = localStorage.getItem('last_sync');
    const cachedProducts = localStorage.getItem('woo_products');

    if (!lastSync || !cachedProducts) {
        return {
            synced: false,
            lastSync: null,
            productCount: 0
        };
    }

    return {
        synced: true,
        lastSync: new Date(lastSync),
        productCount: JSON.parse(cachedProducts).length
    };
};

export default {
    syncProducts,
    getMergedProducts,
    syncStockAfterPurchase,
    forceFullSync,
    getSyncStatus
};
