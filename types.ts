export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  tags: string[];
  isNew?: boolean;
  colorHex?: string; // Dominant color for UI accents
  stock: number; // Total stock (calculated sum of variants)
  variants: ProductVariant[]; // Inventory per size
  // sizes: string[]; // Deprecated in favor of variants
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedSize: string; // Size is now mandatory
}