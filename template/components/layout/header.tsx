import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthButton } from "@/components/auth"
import { ThemeToggle } from "@/components/theme"
import { siteConfig } from "@/lib/config"
// 🟩 SHOP-ONLY: Cart Icon Integration
import { CartIcon } from "@/components/shop"
export function Header() {
  // ✅ SHARED navigation structure
  // 🟩 SHOP-FOCUSED: Using /shop navigation (for SaaS: change back to /pricing)
  const navigationLinks = [
    { href: '/features', label: 'Features' },        // ✅ SHARED
    { href: '/shop', label: 'Shop' },                // 🟩 SHOP-ONLY: for SaaS use { href: '/pricing', label: 'Pricing' }
    { href: '/contact', label: 'Contact' }           // ✅ SHARED
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  S
                </span>
              </div>
              <span className="hidden font-bold sm:inline-block">
                {siteConfig.name}
              </span>
            </Link>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Beta
            </Badge>
          </div>

          {/* Dynamic Navigation */}
          <nav className="flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Separator orientation="vertical" className="h-6" />
            {/* 🟩 SHOP-ONLY: Shopping Cart Icon */}
            <CartIcon />
            <ThemeToggle />
            {/* 🟦 SAAS-ONLY: AuthButton (for shop: make optional or replace with cart) */}
            <AuthButton />
          </nav>
        </div>
      </Container>
    </header>
  )
}