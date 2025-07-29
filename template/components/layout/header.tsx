import Link from "next/link"
import { Container } from "@/components/layout/container"
import { ThemeToggle } from "@/components/theme"
import { siteConfig } from "@/lib/config"

// Ultra-clean restaurant header - minimal design, maximum focus on content
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <span className="text-lg">🍔</span>
              </div>
              <span className="font-bold text-lg">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* Theme Toggle Only */}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}