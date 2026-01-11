/**
 * Cache Manager for WordPress API responses
 * Uses IndexedDB for persistent caching across sessions
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class CacheManager {
    private dbName = 'jumplings-cache';
    private storeName = 'api-cache';
    private db: IDBDatabase | null = null;

    /**
     * Initialize IndexedDB connection
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    /**
     * Get cached data if not expired
     */
    async get<T>(key: string): Promise<T | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const entry = request.result as CacheEntry<T> | undefined;

                if (!entry) {
                    resolve(null);
                    return;
                }

                // Check if expired
                const now = Date.now();
                const isExpired = (now - entry.timestamp) > entry.ttl;

                if (isExpired) {
                    // Clean up expired entry
                    this.delete(key);
                    resolve(null);
                } else {
                    resolve(entry.data);
                }
            };
        });
    }

    /**
     * Store data with TTL
     */
    async set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): Promise<void> {
        if (!this.db) await this.init();

        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl,
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(entry, key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Delete a cache entry
     */
    async delete(key: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Clear all cache
     */
    async clear(): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Check if cache has valid entry
     */
    async has(key: string): Promise<boolean> {
        const data = await this.get(key);
        return data !== null;
    }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Cache key generators
export const CacheKeys = {
    products: () => 'wc-products',
    variations: (productId: number) => `wc-variations-${productId}`,
    allVariations: () => 'wc-all-variations',
};

// Cache TTL constants (in milliseconds)
// Optimized for production - longer caching reduces API calls
export const CacheTTL = {
    products: 15 * 60 * 1000,     // 15 minutes (was 5)
    variations: 30 * 60 * 1000,   // 30 minutes (was 10)
    short: 5 * 60 * 1000,         // 5 minutes (was 2)
    long: 60 * 60 * 1000,         // 60 minutes (was 30)
};

export default cacheManager;
