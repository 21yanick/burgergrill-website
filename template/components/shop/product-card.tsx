/**
 * 🟩 SHOP-ONLY: Product Card Component  
 * Integration mit Cart Store und Swiss Formatting
 */

'use client'

import Image from 'next/image'
import { Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatSwissPrice, type Product } from '@/lib/shop/products'
import { useCartStore } from '@/lib/shop/cart-store'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  
  const handleAddToCart = () => {
    // Convert Product to CartItem product format
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
      digital: product.digital, // 🎯 Include digital flag for shipping detection
    }
    
    addItem(cartProduct, 1)
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className || ''}`}>
      {/* Product Image */}
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Featured Badge */}
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-primary">
              Featured
            </Badge>
          )}
          
          {/* Sale Badge */}
          {product.originalPrice && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              Sale
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Product Details */}
      <CardContent className="p-6">
        <CardTitle className="text-xl mb-2 line-clamp-2">
          {product.name}
        </CardTitle>
        
        <CardDescription className="mb-4 line-clamp-3">
          {product.description}
        </CardDescription>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-foreground">
              {formatSwissPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatSwissPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          className="w-full group/button"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2 group-hover/button:scale-110 transition-transform" />
          In den Warenkorb
        </Button>
      </CardContent>
    </Card>
  )
}