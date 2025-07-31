/**
 * 📄 IMPRESSUM PAGE
 * Legal information and contact details for Burger Grill
 * 
 * Features:
 * - Clean, readable layout following marketing page patterns
 * - Structured contact information and legal disclaimers
 * - SEO-optimized metadata
 * - Responsive design with proper typography
 */

import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Scale, FileText, Copyright } from 'lucide-react';

// =====================================================================================
// METADATA
// =====================================================================================

export const metadata: Metadata = {
  title: 'Impressum | Burgergrill - Rechtliche Informationen',
  description: 'Impressum und rechtliche Informationen von Burgergrill. Kontaktdaten, Haftungsausschluss und Urheberrechte.',
  robots: 'index, follow',
};

// =====================================================================================
// IMPRESSUM PAGE
// =====================================================================================

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          Impressum
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Rechtliche Informationen und Kontaktdaten gemäss schweizerischem Recht
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              Kontaktadresse
            </CardTitle>
            <CardDescription>
              Angaben zum Betreiber dieser Webseite
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">Burger Grill</h3>
                  <p className="text-muted-foreground">Inhaberin Julia Kaddatz</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Bielstrasse 50</p>
                    <p className="text-muted-foreground">4500 Solothurn</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href="tel:0794897755" 
                    className="hover:text-primary transition-colors"
                  >
                    079 489 77 55
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href="mailto:info@burgergrill.ch" 
                    className="hover:text-primary transition-colors"
                  >
                    info@burgergrill.ch
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href="https://burgergrill.ch/" 
                    className="hover:text-primary transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    burgergrill.ch
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-primary" />
              Haftungsausschluss
            </CardTitle>
            <CardDescription>
              Rechtliche Hinweise zur Nutzung dieser Webseite
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <p>
              Der Webseitenbetreiber übernimmt keine Gewähr bezüglich der inhaltlichen Korrektheit, 
              Exaktheit, Aktualität, Vollständigkeit oder Zuverlässigkeit der veröffentlichten Informationen.
            </p>
            <p>
              Haftungsansprüche gegen den Webseitenbetreiber wegen materieller oder immaterieller Schäden 
              jeglicher Art, welche aus dem Besuch, der Nutzung oder auch Nichtnutzung der zur Verfügung 
              gestellten Daten, durch einen falschen Gebrauch der Internetverbindung oder durch eventuelle 
              technische Fehler entstanden sind, werden ausgeschlossen.
            </p>
            <p>
              Alle veröffentlichten Angebote haben einen unverbindlichen Charakter. Der Webseitenbetreiber 
              hat das Recht, Teile von Webseiten oder auch den gesamten Inhalt ohne vorherige Ankündigung 
              zu ändern, zu ergänzen, zu löschen oder die Publikation teilweise oder komplett einzustellen.
            </p>
          </CardContent>
        </Card>

        {/* Links Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              Haftung für Links
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              Links auf Webseiten von Drittanbietern, sowie Verweise darauf, liegen ausserhalb des 
              Verantwortungsbereichs des Webseitenbetreibers. Jegliche Verantwortung für die Inhalte 
              dieser Webseiten wird abgelehnt. Wer auf von Drittanbietern zugreift, diese besucht 
              oder nutzt, tut dies auf eigene Gefahr.
            </p>
          </CardContent>
        </Card>

        {/* Copyright */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Copyright className="w-6 h-6 text-primary" />
              Urheberrechte
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <p>
              Das Urheberrecht sowie alle anderen Rechte an Texten, Bildern, Fotos oder Dateien auf 
              der Webseite gehören ausschliesslich dem Webseitenbetreiber oder den angeführten 
              Rechteinhabern. Die Reproduktion von Elementen bedarf der schriftlichen Zustimmung 
              der Urheberrechtsträger.
            </p>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium text-foreground mb-2">Quelle von Bildmaterialien:</h4>
              <p>www.canva.com und eigene Fotos</p>
              
              <h4 className="font-medium text-foreground mb-2 mt-4">Realisierung und Gestaltung:</h4>
              <p>Die Seite wurde von 21design.ch mit ❤️ erstellt.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}