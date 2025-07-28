import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/config"

export function Footer() {
  // Clean SaaS-only footer - using centralized config
  const { name: brandName, description } = siteConfig
  
  const productLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' }
  ]

  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="py-8 md:py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                  <span className="text-xs font-bold text-primary-foreground">
                    S
                  </span>
                </div>
                <span className="font-bold">{brandName}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>

            {/* Product column */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Navigate</h4>
              <ul className="space-y-2 text-sm">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* System column */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">System</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/api/health" className="text-muted-foreground hover:text-foreground">
                    API Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom footer */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 {brandName}. Built with Next.js 15 & Supabase.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground">
                SAAS Mode
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}