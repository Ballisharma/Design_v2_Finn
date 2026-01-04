import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'grip-black',
    slug: 'nano-grip-black',
    name: 'Nano-Grip™ Pro (Black)',
    subtitle: 'Midnight Edition',
    description: 'The ultimate stability sock featuring Lava Red silicone grips. 300+ heat-fused nodes, compression arch support, and organic bamboo-cotton blend. Perfect for Yoga, Pilates, and Barre.',
    price: 299,
    currency: 'INR',
    category: 'Grip Socks',
    categories: ['Grip Socks', 'Best Seller', 'Yoga'],
    images: [
      'https://images.unsplash.com/photo-1596707328151-61472554d32e?q=80&w=1000&auto=format&fit=crop', // Placeholder until user uploads
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop',
    ],
    tags: ['Best Seller', 'Grip'],
    isNew: true,
    colorHex: '#1a1a1a',
    stock: 200,
    variants: [
      { size: 'Free Size', stock: 200 }
    ]
  },
  {
    id: 'grip-grey',
    slug: 'nano-grip-grey',
    name: 'Nano-Grip™ Pro (Grey)',
    subtitle: 'Slate Edition',
    description: 'Engineered stability in versatile grey with Sunshine Yellow grips. The antibacterial fabric keeps feet fresh, while the reinforced heel ensures longevity.',
    price: 299,
    currency: 'INR',
    category: 'Grip Socks',
    categories: ['Grip Socks'],
    images: [
      'https://images.unsplash.com/photo-1621213233215-0b043b23c21c?q=80&w=1000&auto=format&fit=crop', // Placeholder until user uploads
    ],
    tags: ['Essential', 'Grip'],
    colorHex: '#808080',
    stock: 200,
    variants: [
      { size: 'Free Size', stock: 200 }
    ]
  },
  {
    id: '1',
    slug: 'geometric-aqua-socks',
    name: 'Geometric Aqua',
    subtitle: 'Pop Art Series',
    description: 'Vibrant geometric patterns meet unparalleled comfort. Crafted from organic combed cotton, these socks feature reinforced heels and toes for durability. Perfect for adding a pop of color to any outfit.',
    price: 399,
    currency: 'INR',
    category: 'Crew',
    categories: ['Crew', 'Patterned'],
    images: [
      'https://images.unsplash.com/photo-1631557022137-b2eb6a6d653a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586350971171-84552199db3e?q=80&w=1000&auto=format&fit=crop',
    ],
    tags: ['Best Seller'],
    isNew: true,
    colorHex: '#118AB2',
    stock: 25,
    variants: [
      { size: '36-40', stock: 15 },
      { size: '41-46', stock: 10 }
    ]
  },
  {
    id: '2',
    slug: 'spotty-yellow-socks',
    name: 'Banana Split',
    subtitle: 'Fruit Loop Series',
    description: 'Go bananas with these vibrant yellow socks spotted with classic polka dots. Breathable, soft, and guaranteed to start conversations.',
    price: 349,
    currency: 'INR',
    category: 'Ankle',
    categories: ['Ankle', 'Patterned'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop',
    ],
    tags: ['Trending'],
    colorHex: '#FFD166',
    stock: 3,
    variants: [
      { size: 'Free Size', stock: 3 }
    ]
  },
  {
    id: '3',
    slug: 'neon-blast-socks',
    name: 'Neon Blast',
    subtitle: 'Cyberpunk Series',
    description: 'Electrify your step with these high-contrast neon socks. Perfect for raves, runs, or just being the brightest person in the room.',
    price: 449,
    currency: 'INR',
    category: 'Crew',
    categories: ['Crew', 'Neon'],
    images: [
      'https://images.unsplash.com/photo-1582966772652-132d30718c34?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533659828870-95ee305cee3e?q=80&w=1000&auto=format&fit=crop',
    ],
    tags: ['Limited'],
    isNew: true,
    colorHex: '#EF476F',
    stock: 12,
    variants: [
      { size: '36-40', stock: 0 },
      { size: '41-46', stock: 12 }
    ]
  },
  {
    id: '5',
    slug: 'avocado-dream',
    name: 'Avocado Dream',
    subtitle: 'Foodie Collection',
    description: 'Holy guacamole! These comfortable cotton blend socks feature cute little avocados. A must-have for brunch lovers.',
    price: 399,
    currency: 'INR',
    category: 'Ankle',
    categories: ['Ankle', 'Foodie'],
    images: [
      'https://images.unsplash.com/photo-1628153303724-c155d81b2413?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop',
    ],
    tags: ['Fun'],
    colorHex: '#9CAF88',
    stock: 8,
    variants: [
      { size: 'Free Size', stock: 8 }
    ]
  },
  {
    id: '6',
    slug: 'cosmic-traveler',
    name: 'Cosmic Traveler',
    subtitle: 'Space Series',
    description: 'Deep blue socks with little rockets and planets. Blast off into comfort with reinforced toes and a seamless feel.',
    price: 499,
    currency: 'INR',
    category: 'Crew',
    categories: ['Crew', 'Patterned'],
    images: [
      'https://images.unsplash.com/photo-1588640751993-8d6556b68a86?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504198358623-6e7f1695cd3f?q=80&w=1000&auto=format&fit=crop',
    ],
    tags: ['New'],
    colorHex: '#161345',
    stock: 42,
    variants: [
      { size: '36-40', stock: 20 },
      { size: '41-46', stock: 22 }
    ]
  }
];