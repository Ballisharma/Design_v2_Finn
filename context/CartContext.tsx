import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useProducts } from './ProductContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingCost: number;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedItems = localStorage.getItem('jumplings_cart');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return [];
    }
  });

  const { settings } = useProducts();

  // Persist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jumplings_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    // Find the specific variant stock
    const variant = product.variants.find(v => v.size === selectedSize);
    const availableStock = variant ? variant.stock : 0;

    if (availableStock === 0) {
      alert("This size is currently out of stock.");
      return;
    }

    setItems((prev) => {
      // Check if item exists with same ID and Size
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === selectedSize);
      const currentQtyInCart = existing ? existing.quantity : 0;

      // Validation: Check if adding this quantity exceeds stock for this size
      if (currentQtyInCart + quantity > availableStock) {
        alert(`Sorry, we only have ${availableStock} units of size ${selectedSize} in stock.`);

        // If we can add some, add the difference
        const remainingSpace = availableStock - currentQtyInCart;
        if (remainingSpace > 0) {
          if (existing) {
            return prev.map((item) =>
              item.cartId === existing.cartId ? { ...item, quantity: item.quantity + remainingSpace } : item
            );
          } else {
            return [...prev, {
              ...product,
              cartId: `${product.id}-${selectedSize}-${Date.now()}`,
              quantity: remainingSpace,
              selectedSize
            }];
          }
        }
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          item.cartId === existing.cartId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...prev, {
        ...product,
        cartId: `${product.id}-${selectedSize}-${Date.now()}`,
        quantity,
        selectedSize
      }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          // Find product variant stock again
          const variant = item.variants.find(v => v.size === item.selectedSize);
          const stock = variant ? variant.stock : 0;

          // Check against stock
          if (quantity > stock) {
            alert(`Cannot add more. Only ${stock} units available for this size.`);
            return { ...item, quantity: stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Shipping Logic
  const shippingCost = (subtotal > 0 && subtotal < settings.freeShippingThreshold) ? settings.shippingFee : 0;
  const cartTotal = subtotal + shippingCost;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, shippingCost, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};