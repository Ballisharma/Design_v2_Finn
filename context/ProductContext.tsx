import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';
import { getMergedProducts, syncProducts, syncStockAfterPurchase, getSyncStatus } from '../services/syncManager';

export interface StoreSettings {
  freeShippingThreshold: number;
  shippingFee: number;
}

interface ProductContextType {
  products: Product[];
  categories: string[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addCategory: (category: string) => void;
  availableSizes: string[];
  addAvailableSize: (size: string) => void;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  dataSource: 'local' | 'wordpress'; // Track where data comes from
  setDataSource: (source: 'local' | 'wordpress') => void;
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Default categories
const DEFAULT_CATEGORIES = ['Crew', 'Ankle', 'Knee High', 'No Show', 'Grip Socks'];
const DEFAULT_SIZES = ['Free Size', '36-40', '41-46', 'Small', 'Medium', 'Large'];
const DEFAULT_SETTINGS: StoreSettings = {
  freeShippingThreshold: 399,
  shippingFee: 49
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dataSource, setDataSource] = useState<'local' | 'wordpress'>(() => {
    return (localStorage.getItem('jumplings_data_source') as 'local' | 'wordpress') || 'local';
  });

  // Save dataSource preference
  useEffect(() => {
    localStorage.setItem('jumplings_data_source', dataSource);
  }, [dataSource]);

  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('jumplings_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      console.error("Failed to load products", e);
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jumplings_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  });

  const [availableSizes, setAvailableSizes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jumplings_sizes');
      return saved ? JSON.parse(saved) : DEFAULT_SIZES;
    } catch (e) {
      return DEFAULT_SIZES;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('jumplings_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // WordPress Data Sync Logic - Enhanced with bi-directional sync
  useEffect(() => {
    if (dataSource === 'wordpress') {
      setIsLoading(true);

      // Initial sync
      getMergedProducts().then((mergedProducts: Product[]) => {
        if (mergedProducts.length > 0) {
          setProducts(mergedProducts);
          // Extract unique categories from products
          const wpCategories = Array.from(new Set(mergedProducts.map((p: Product) => p.category)));
          if (wpCategories.length > 0) setCategories(wpCategories as string[]);
        } else {
          console.warn("No products found in WordPress or API failed. Using local data.");
        }
        setIsLoading(false);
      });

      // Set up automatic background sync every 5 minutes
      const syncInterval = setInterval(async () => {
        console.log('🔄 Running background sync...');
        const freshProducts = await getMergedProducts();
        if (freshProducts.length > 0) {
          setProducts(freshProducts);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(syncInterval);
    }
  }, [dataSource]);

  // Save to local storage whenever products change (only if local mode)
  useEffect(() => {
    if (dataSource === 'local') {
      localStorage.setItem('jumplings_products', JSON.stringify(products));
    }
  }, [products, dataSource]);

  // Save categories to local storage
  useEffect(() => {
    if (dataSource === 'local') {
      localStorage.setItem('jumplings_categories', JSON.stringify(categories));
    }
  }, [categories, dataSource]);

  // Save sizes to local storage
  useEffect(() => {
    if (dataSource === 'local') {
      localStorage.setItem('jumplings_sizes', JSON.stringify(availableSizes));
    }
  }, [availableSizes, dataSource]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('jumplings_settings', JSON.stringify(settings));
  }, [settings]);

  const addProduct = (product: Product) => {
    if (dataSource === 'wordpress') {
      alert("You are in WordPress mode. Please add products via your WP-Admin dashboard.");
      return;
    }
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    if (dataSource === 'wordpress') {
      alert("Please delete this product in your WordPress dashboard.");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    if (dataSource === 'wordpress') {
      // Ideally we would POST to WP API here to update stock
      console.log("Mocking stock update to WP for product:", id);
    }
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addCategory = (category: string) => {
    const trimmed = category.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
  };

  const addAvailableSize = (size: string) => {
    const trimmed = size.trim();
    if (trimmed && !availableSizes.includes(trimmed)) {
      setAvailableSizes((prev) => [...prev, trimmed]);
    }
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const freshProducts = await getMergedProducts();
      if (freshProducts.length > 0) {
        setProducts(freshProducts);
      }
    } catch (error) {
      console.error("Failed to refresh products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      products, categories, addProduct, deleteProduct, updateProduct, addCategory,
      availableSizes, addAvailableSize, settings, updateSettings,
      dataSource, setDataSource, isLoading, refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};