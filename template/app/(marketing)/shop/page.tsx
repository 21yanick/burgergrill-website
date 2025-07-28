/**
 * 🟩 SHOP-ONLY: Product Catalog Page
 * Echte Stripe Produkte mit Cart Integration
 */

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ProductCard } from '@/components/shop/product-card'
import { getAllProducts } from '@/lib/shop/products'

export default function ShopPage() {
  // Echte Stripe Produkte (24.90 CHF + 39.90 CHF)
  const products = getAllProducts()

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          Unser Shop
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Entdecken Sie unsere ausgewählten Produkte mit Schweizer Qualität. 
          Bezahlung in CHF, inklusive TWINT.
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-6">
            Keine Produkte verfügbar. Kommen Sie bald wieder!
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center mt-16">
        <p className="text-lg text-muted-foreground mb-6">
          Fragen zu unseren Produkten?
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link href="/contact">
            Kontakt aufnehmen
          </Link>
        </Button>
      </div>
    </div>
  )
}