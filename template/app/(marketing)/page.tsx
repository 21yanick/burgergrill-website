import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Check, Shield, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {

  const getHeroContent = () => {
    return {
      title: 'Das beste Burgergrill der Schweiz',
      subtitle: 'Frische Zutaten, perfekt gegrillte Burger und authentische Schweizer Qualität direkt vor Ihrer Haustür.',
      cta: 'Tisch reservieren',
      ctaLink: '/auth/register',
    }
  }

  const hero = getHeroContent()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 lg:text-2xl">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={hero.ctaLink}>
                  {hero.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Kontakt</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Erstklassige Zutaten, traditionelle Grillkunst und moderner Service für das perfekte Burger-Erlebnis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Qualität zuerst</CardTitle>
                <CardDescription>
                  Nur die besten Zutaten, frisch zubereitet und nach höchsten Qualitätsstandards serviert.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Schneller Service</CardTitle>
                <CardDescription>
                  Effiziente Küche und freundlicher Service für kurze Wartezeiten und maximalen Genuss.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Gastronomie-Erlebnis</CardTitle>
                <CardDescription>
                  Gemütliche Atmosphäre und herzlicher Service für ein unvergessliches Burger-Erlebnis.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Entdecken Sie, warum wir das beliebteste Burgergrill der Region sind.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href={hero.ctaLink}>
              {hero.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}