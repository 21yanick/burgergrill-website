import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Check, Shield, Zap, Users } from 'lucide-react'
import Link from 'next/link'
import { HeroSection, MenuSection, KgVerkaufSection, LocationSection } from '@/components/restaurant'

export default function LandingPage() {

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Menu Section */}
      <MenuSection />

      {/* KG-Verkauf Section */}
      <KgVerkaufSection />

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Warum Burgergrill?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Authentische Balkan-Küche trifft auf schweizer Qualität und traditionelle Grillkunst.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 mb-4 text-accent" />
                <CardTitle>Authentische Rezepte</CardTitle>
                <CardDescription>
                  Traditionelle Cevapcici-Rezepte aus dem Balkan, seit Generationen weitergegeben.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 mb-4 text-accent" />
                <CardTitle>Frisch vom Grill</CardTitle>
                <CardDescription>
                  Alles wird frisch auf unserem Grill zubereitet - für den unverwechselbaren Geschmack.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 mb-4 text-accent" />
                <CardTitle>Schweizer Qualität</CardTitle>
                <CardDescription>
                  Premium Rindfleisch aus der Region und höchste Qualitätsstandards bei allen Zutaten.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Location & Hours Section */}
      <LocationSection />

      {/* CTA Section */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Bereit für authentische Cevapcici?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Entdecken Sie, warum wir das beliebteste Cevapcici-Grill der Region sind.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="#kg-verkauf">
              KG-Verkauf bestellen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}