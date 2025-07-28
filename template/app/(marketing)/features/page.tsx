import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Zap, 
  Users, 
  Database, 
  Mail, 
  Calendar,
  Coffee,
  Clock,
  Globe,
  Smartphone,
  ChefHat
} from 'lucide-react'

export default function FeaturesPage() {

  const coreFeatures = [
    {
      icon: Shield,
      title: 'Lebensmittelsicherheit',
      description: 'Höchste Hygienestandards und sichere Lebensmittelverarbeitung nach HACCP.',
      features: ['HACCP-zertifiziert', 'Tägliche Qualitätskontrollen', 'Frische-Garantie', 'Allergen-Management'],
    },
    {
      icon: Zap,
      title: 'Schnelle Küche',
      description: 'Professionelle Küchenausstattung für perfekt zubereitete Burger in kürzester Zeit.',
      features: ['Grill-Perfektion', 'Frische Zubereitung', 'Optimierte Abläufe', 'Live-Tracking'],
    },
    {
      icon: Database,
      title: 'Zuverlässiger Service',
      description: 'Konstant hohe Qualität und zuverlässige Öffnungszeiten für unsere Gäste.',
      features: ['Täglich geöffnet', 'Konstante Qualität', 'Professionelles Team', 'Gäste-Support'],
    },
    {
      icon: Globe,
      title: 'Lokale Verbundenheit',
      description: 'Verwurzelt in der Schweizer Tradition mit regionalen Zutaten und lokalen Partnern.',
      features: ['Schweizer Fleisch', 'Regionale Lieferanten', 'Lokale Traditionen', 'CHF-Preise'],
    },
  ]

  const restaurantFeatures = [
    {
      icon: ChefHat,
      title: 'Meister-Köche',
      description: 'Erfahrene Köche mit Leidenschaft für perfekte Burger-Kreationen.',
      features: ['Ausgebildete Köche', 'Kreative Rezepte', 'Individuelle Wünsche', 'Qualitäts-Standards'],
    },
    {
      icon: Coffee,
      title: 'Gemütliche Atmosphäre',
      description: 'Warme, einladende Umgebung für entspannte Mahlzeiten.',
      features: ['Moderne Einrichtung', 'Familienfreundlich', 'Terrasse', 'WLAN kostenlos'],
    },
    {
      icon: Clock,
      title: 'Flexible Service-Zeiten',
      description: 'Durchgehend warme Küche und flexible Bestelloptionen.',
      features: ['Lange Öffnungszeiten', 'Take-Away', 'Lieferservice', 'Reservierungen'],
    },
  ]

  const menuFeatures = [
    {
      icon: ChefHat,
      title: 'Signature Burger',
      description: 'Unser berühmter Burgergrill-Classic mit geheimen Gewürzen.',
      features: ['100% Schweizer Rindfleisch', 'Hausgemachte Sauce', 'Frisches Gemüse', 'Handwerkliche Brötchen'],
    },
    {
      icon: Coffee,
      title: 'Beilagen & Getränke',
      description: 'Perfekte Ergänzungen zu unseren Burgern.',
      features: ['Knusprige Pommes', 'Hausgemachte Dips', 'Schweizer Getränke', 'Frische Salate'],
    },
    {
      icon: Users,
      title: 'Familien-Angebote',
      description: 'Spezielle Menüs und Angebote für die ganze Familie.',
      features: ['Kinder-Menüs', 'Familien-Portionen', 'Vegetarische Optionen', 'Dessert-Auswahl'],
    },
  ]


  const serviceFeatures = [
    {
      icon: Mail,
      title: 'Online Bestellung',
      description: 'Bequeme Online-Bestellung mit Abholung oder Lieferung.',
      features: ['Online-Menü', 'Bestellsystem', 'Lieferservice', 'Abholung'],
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Unsere App für schnelle Bestellungen und exklusive Angebote.',
      features: ['Schnelle Bestellung', 'Treueprogramm', 'Push-Nachrichten', 'Standort-Service'],
    },
    {
      icon: Calendar,
      title: 'Tischreservierung',
      description: 'Einfache Online-Reservierung für Ihren perfekten Abend.',
      features: ['Online-Reservierung', 'Flexible Zeiten', 'Gruppenanfragen', 'Event-Buchungen'],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          Unser Service für Sie
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Von der Küche bis zum Service - entdecken Sie, was uns zum besten Burgergrill der Schweiz macht.
        </p>
      </div>

      {/* Core Features */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Unsere Grundpfeiler</h2>
          <p className="text-lg text-muted-foreground">
            Die Basis für unser erstklassiges Burgergrill-Erlebnis
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Restaurant Service Features */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Restaurant Service Features
            <Badge className="ml-3">Restaurant</Badge>
          </h2>
          <p className="text-lg text-muted-foreground">
            Alles was Sie für ein perfektes Burger-Erlebnis brauchen
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {restaurantFeatures.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* Service Features */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Digitale Services</h2>
          <p className="text-lg text-muted-foreground">
            Moderne Lösungen für maximalen Komfort
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {serviceFeatures.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}