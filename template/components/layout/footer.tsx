import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Instagram, Facebook, Settings } from "lucide-react"
import { siteConfig } from "@/lib/config"

export function Footer() {
  // Restaurant-specific navigation
  const restaurantLinks = [
    { href: '#menu', label: 'Speisekarte' },
    { href: '#grillfleisch-verkauf', label: 'Grillfleisch-Verkauf' },
    { href: '#location', label: 'Standort' }
  ]

  // Restaurant contact info (consistent with LocationSection)
  const contactInfo = {
    address: "Bielstrasse 50, 4500 Solothurn",
    phone: "079 489 77 55",
    email: "info@burgergrill.ch"
  }

  // Social media links
  const socialLinks = [
    { href: '#', label: 'Instagram', icon: Instagram },
    { href: '#', label: 'Facebook', icon: Facebook }
  ]

  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="py-8 md:py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Restaurant Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <span className="text-lg">🍔</span>
                </div>
                <span className="font-bold text-lg">{siteConfig.name}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Authentische Cevapcici nach traditionellem Balkan-Rezept. 
                Frisch gegrillt mit schweizer Premium-Zutaten.
              </p>
            </div>

            {/* Restaurant Navigation */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Restaurant</h4>
              <ul className="space-y-3 text-sm">
                {restaurantLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Kontakt</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {contactInfo.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social & System */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Folgen Sie uns</h4>
              <div className="space-y-3">
                {/* Social Media */}
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label={social.label}
                      >
                        <IconComponent className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
                
                {/* Dashboard Link (hidden for non-owners) */}
                <div className="pt-2 border-t border-border/50">
                  <Link 
                    href="/dashboard"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Settings className="w-3 h-3" />
                    Restaurant-Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom footer */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2025 {siteConfig.name}. Authentische Cevapcici seit 2020.
              </p>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <Link 
                  href="/impressum"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  Impressum
                </Link>
                <span className="text-xs text-muted-foreground">•</span>
                <Link 
                  href="/datenschutz"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  Datenschutz
                </Link>
              </div>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Made with ❤️ from 21design.ch</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}