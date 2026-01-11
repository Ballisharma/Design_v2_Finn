import { Product, CartItem } from '../types';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

// Initialize dataLayer if it doesn't exist
window.dataLayer = window.dataLayer || [];

/**
 * Analytics Service for Google Tag Manager (GA4)
 * Handles standard e-commerce events
 */
export const analytics = {
    /**
     * Track View Item (Product Details)
     */
    trackViewItem: (product: Product) => {
        try {
            window.dataLayer.push({ ecommerce: null });  // Clear previous ecommerce object
            window.dataLayer.push({
                event: "view_item",
                ecommerce: {
                    currency: "INR",
                    value: product.price,
                    items: [
                        {
                            item_id: product.id,
                            item_name: product.name,
                            item_brand: "Jumplings",
                            item_category: product.category,
                            price: product.price,
                            quantity: 1
                        }
                    ]
                }
            });
            // console.log("📊 Analytics: view_item", product.name);
        } catch (e) {
            console.error("Analytics Error (view_item):", e);
        }
    },

    /**
     * Track Add To Cart
     */
    trackAddToCart: (product: Product, quantity: number, size: string) => {
        try {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                    currency: "INR",
                    value: product.price * quantity,
                    items: [
                        {
                            item_id: product.id,
                            item_name: product.name,
                            item_brand: "Jumplings",
                            item_category: product.category,
                            item_variant: size,
                            price: product.price,
                            quantity: quantity
                        }
                    ]
                }
            });
            // console.log("📊 Analytics: add_to_cart", product.name);
        } catch (e) {
            console.error("Analytics Error (add_to_cart):", e);
        }
    },

    /**
     * Track Remove From Cart
     */
    trackRemoveFromCart: (item: CartItem) => {
        try {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
                event: "remove_from_cart",
                ecommerce: {
                    currency: "INR",
                    value: item.price * item.quantity,
                    items: [
                        {
                            item_id: item.id,
                            item_name: item.name,
                            item_brand: "Jumplings",
                            item_category: item.category,
                            item_variant: item.selectedSize,
                            price: item.price,
                            quantity: item.quantity
                        }
                    ]
                }
            });
        } catch (e) {
            console.error("Analytics Error (remove_from_cart):", e);
        }
    },

    /**
     * Track Begin Checkout
     */
    trackBeginCheckout: (items: CartItem[], totalValue: number) => {
        try {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
                event: "begin_checkout",
                ecommerce: {
                    currency: "INR",
                    value: totalValue,
                    items: items.map(item => ({
                        item_id: item.id,
                        item_name: item.name,
                        item_brand: "Jumplings",
                        item_category: item.category,
                        item_variant: item.selectedSize,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            });
            // console.log("📊 Analytics: begin_checkout");
        } catch (e) {
            console.error("Analytics Error (begin_checkout):", e);
        }
    },

    /**
     * Track Purchase
     */
    trackPurchase: (orderId: string | number, totalValue: number, shipping: number, items: CartItem[]) => {
        try {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
                event: "purchase",
                ecommerce: {
                    transaction_id: orderId.toString(),
                    value: totalValue,
                    currency: "INR",
                    shipping: shipping,
                    tax: 0, // Assuming tax included or 0 for now
                    items: items.map(item => ({
                        item_id: item.id,
                        item_name: item.name,
                        item_brand: "Jumplings",
                        item_category: item.category,
                        item_variant: item.selectedSize,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            });
            // console.log("📊 Analytics: purchase", orderId);
        } catch (e) {
            console.error("Analytics Error (purchase):", e);
        }
    }
};
