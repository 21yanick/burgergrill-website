/**
 * 🟩 SHOP-ONLY: Product Definitions & Helpers
 * Echte Stripe Produkte mit Swiss CHF Pricing
 * 
 * 🎯 STARTER KIT FLEXIBILITY: Digital vs Physical Products  
 * - digital: true = No shipping address needed (PDF, Software, Licenses)
 * - digital: false = Shipping address required (T-Shirts, Hardware) 
 * - Checkout automatically detects if ANY item needs shipping
 */

// Product Type Definition
export interface Product {
  id: string
  name: string
  description: string
  price: number // in Rappen (CHF cents)
  originalPrice?: number // für Sales
  currency: 'CHF'
  stripePriceId: string
  image_url?: string
  category?: string
  digital: boolean // 🎯 KISS: true = digital product (no shipping), false = physical product (shipping required)
  active: boolean
  featured?: boolean
}

// Echte Stripe Produkte (deine Test-Produkte)
export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'product-1',
    name: 'Premium T-Shirt',
    description: 'Hochwertiges T-Shirt aus 100% Bio-Baumwolle. Perfekt für den Alltag und besondere Anlässe.',
    price: 2490, // 24.90 CHF in Rappen
    currency: 'CHF',
    stripePriceId: process.env.STRIPE_PRODUCT_1_PRICE_ID || 'price_1RmVHYEFwSnkmysmWsfWDbWe',
    // 🖼️ Using local placeholder - replace with actual product image (400x400px, <50KB)
    image_url: '/images/products/t-shirt-premium.svg',
    category: 'Kleidung',
    digital: false, // 🎯 Physical product = shipping required
    active: true,
    featured: true,
  },
  {
    id: 'product-2', 
    name: 'Designer Hoodie',
    description: 'Komfortabler Hoodie mit modernem Design. Ideal für kühle Tage und einen lässigen Look.',
    price: 3990, // 39.90 CHF in Rappen
    currency: 'CHF',
    stripePriceId: process.env.STRIPE_PRODUCT_2_PRICE_ID || 'price_1RmVLsEFwSnkmysmQS17NN4y',
    // 🖼️ Using local placeholder - replace with actual product image (400x400px, <50KB)
    image_url: '/images/products/hoodie-designer.svg',
    category: 'Kleidung', 
    digital: false, // 🎯 Physical product = shipping required
    active: true,
    featured: false,
  },
  
  // 📝 STARTER KIT EXAMPLES: Digital products (uncomment to test digital checkout)
  // {
  //   id: 'digital-guide',
  //   name: 'Startup Guide PDF',
  //   description: 'Umfassendes Handbuch für Schweizer Startups. Sofortiger Download nach Kauf.',
  //   price: 990, // CHF 9.90
  //   currency: 'CHF',
  //   stripePriceId: 'price_xxx', // Add your digital product price ID
  //   image_url: '/images/products/guide-digital.svg',
  //   category: 'Digital',
  //   digital: true, // 🎯 Digital product = no shipping needed
  //   active: true,
  //   featured: false,
  // },
]

// Helper: Format Swiss Price
export function formatSwissPrice(priceInRappen: number): string {
  const priceInCHF = priceInRappen / 100
  
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInCHF)
}

// Helper: Get product by ID
export function getProductById(productId: string): Product | undefined {
  return SHOP_PRODUCTS.find(product => product.id === productId)
}

// Helper: Get featured products
export function getFeaturedProducts(): Product[] {
  return SHOP_PRODUCTS.filter(product => product.featured && product.active)
}

// Helper: Get products by category
export function getProductsByCategory(category: string): Product[] {
  return SHOP_PRODUCTS.filter(
    product => product.category === category && product.active
  )
}

// Helper: Get all active products
export function getAllProducts(): Product[] {
  return SHOP_PRODUCTS.filter(product => product.active)
}

// 🎯 KISS HELPER: Check if any products need shipping
export function needsShippingAddress(products: Product[]): boolean {
  return products.some(product => !product.digital)
}