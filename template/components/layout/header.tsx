import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthButton } from "@/components/auth"
import { ThemeToggle } from "@/components/theme"
import { siteConfig } from "@/lib/config"
// Restaurant header with navigation and authentication
export function Header() {
  // Restaurant navigation structure
  const navigationLinks = [
    { href: '/features', label: 'Features' },
    { href: '/contact', label: 'Contact' }
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
            <ThemeToggle />
            {/* Restaurant: User authentication for reservations and orders */}
            <AuthButton />
          </nav>
        </div>
      </Container>
    </header>
  )
}