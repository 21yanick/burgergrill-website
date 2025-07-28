# 🖼️ Product Images Guidelines

**Swiss Shop Template - Product Image Specifications**

---

## 📐 **Technical Requirements**

### **Image Specifications**
```yaml
Format: JPG (photos) / PNG (graphics) / WebP (modern browsers)
Dimensions: 400x400px (1:1 aspect ratio)
Quality: 85% (balance between size & quality)
Max File Size: 50KB per image
Color Space: sRGB
Background: White or transparent (PNG)
```

### **Naming Convention**
```yaml
Pattern: {product-name}.{ext}
Examples:
  - t-shirt-premium.jpg
  - hoodie-designer.jpg
  - placeholder.png (fallback)
```

---

## 📁 **Current Setup**

### **Current Files**
```
/public/images/products/
├── t-shirt-premium.svg          # ✅ PLACEHOLDER: Product 1 (24.90 CHF)
├── hoodie-designer.svg          # ✅ PLACEHOLDER: Product 2 (39.90 CHF)
├── placeholder.svg              # ✅ Default fallback image
└── README.md                    # This file
```

### **Production Ready Files (TODO)**
```
/public/images/products/
├── t-shirt-premium.jpg          # 📸 TODO: Replace SVG with real product photo
├── hoodie-designer.jpg          # 📸 TODO: Replace SVG with real product photo
└── placeholder.png              # 📸 TODO: Generic product placeholder
```

### **Current Implementation**
```typescript
// lib/shop/products.ts - Using SVG placeholders
export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'product-1',
    name: 'Premium T-Shirt',
    image_url: '/images/products/t-shirt-premium.svg',  // ← SVG placeholder
    // ...other fields
  },
  {
    id: 'product-2', 
    name: 'Designer Hoodie',
    image_url: '/images/products/hoodie-designer.svg',  // ← SVG placeholder
    // ...other fields
  }
]
```

### **Production Implementation (After adding real photos)**
```typescript
// lib/shop/products.ts - With real product photos
export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'product-1',
    name: 'Premium T-Shirt',
    image_url: '/images/products/t-shirt-premium.jpg',  // ← Real photo
    // ...other fields
  },
  {
    id: 'product-2', 
    name: 'Designer Hoodie',
    image_url: '/images/products/hoodie-designer.jpg',  // ← Real photo
    // ...other fields
  }
]
```

---

## 🎨 **Image Optimization Tips**

### **Tools for Optimization**
```yaml
Online Tools:
  - TinyPNG.com (PNG/JPG compression)
  - Squoosh.app (Google's image optimizer)
  - ImageOptim (Mac app)

Command Line:
  - imagemagick: convert input.jpg -resize 400x400^ -quality 85 output.jpg
  - cwebp: cwebp -q 85 -resize 400 400 input.jpg -o output.webp
```

### **NextJS Integration**
```typescript
// Automatic optimization via Next.js Image component
import Image from 'next/image'

<Image
  src="/images/products/t-shirt-premium.jpg"
  alt="Premium T-Shirt"
  width={400}
  height={400}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## 🔄 **Migration Status**

### **✅ COMPLETED: Unsplash → Local SVG Placeholders**
```typescript
// ❌ REMOVED: Unsplash URLs (external dependency)
// image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'

// ✅ CURRENT: Local SVG placeholders (NextJS friendly)
image_url: '/images/products/t-shirt-premium.svg'
```

### **🎯 NEXT: SVG Placeholders → Real Photos**
```typescript
// ✅ CURRENT: SVG placeholders (functional, but basic)
image_url: '/images/products/t-shirt-premium.svg'

// 🎯 TARGET: Real product photos (production-ready)
image_url: '/images/products/t-shirt-premium.jpg'
```

### **Fallback Strategy**
```typescript
// Placeholder for missing images
image_url: '/images/products/placeholder.svg'  // ← Currently active
// image_url: '/images/products/placeholder.png'  // ← Future version
```

---

## 🚀 **Production Checklist**

### **Before Going Live**
- [ ] All product images optimized to <50KB
- [ ] Images are 400x400px (square aspect ratio)
- [ ] Placeholder.png exists as fallback
- [ ] WebP versions available for modern browsers
- [ ] Alt text defined for accessibility
- [ ] Images tested on mobile devices

### **Performance Testing**
- [ ] Lighthouse Performance Score >90
- [ ] Images load in <2s on 3G network
- [ ] No layout shift (CLS) during image loading
- [ ] Responsive images work across all breakpoints

---

## 🎯 **Next Steps**

1. **Add Product Images:**
   - Place `t-shirt-premium.jpg` (400x400px, <50KB)
   - Place `hoodie-designer.jpg` (400x400px, <50KB)
   - Place `placeholder.png` (fallback image)

2. **Update Products Configuration:**
   - Edit `lib/shop/products.ts`
   - Replace Unsplash URLs with local paths
   - Test image loading in browser

3. **Verify Setup:**
   - Test all product cards display images correctly
   - Check mobile responsiveness
   - Validate fallback behavior

**Ready for Phase 3 after images are properly configured! 🚀**