/**
 * 🔒 DATENSCHUTZ PAGE
 * Privacy policy for Burger Grill - Local hosting, no customer accounts
 * 
 * Features:
 * - DSGVO/DSG compliant for Swiss restaurant with German hosting
 * - Comprehensive coverage for bulk orders and management
 * - Hetzner Germany hosting (EU data protection)
 * - Responsive design following marketing patterns
 */

import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, MapPin, Cookie, Users, Lock, FileText } from 'lucide-react';

// =====================================================================================
// METADATA
// =====================================================================================

export const metadata: Metadata = {
  title: 'Datenschutz | Burgergrill - Datenschutzerklärung',
  description: 'Datenschutzerklärung von Burgergrill. Informationen zur Datenverarbeitung nach schweizer DSG mit zusätzlicher DSGVO-Compliance.',
  robots: 'index, follow',
};

// =====================================================================================
// DATENSCHUTZ PAGE  
// =====================================================================================

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          Datenschutzerklärung
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Informationen zur Datenverarbeitung gemäss schweizer Datenschutzgesetz (DSG) mit DSGVO-Compliance
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Responsible Party */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Verantwortlicher
            </CardTitle>
            <CardDescription>
              Verantwortlich für die Datenverarbeitung auf dieser Website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Burger Grill</h3>
              <p className="text-muted-foreground">Inhaberin Julia Kaddatz</p>
              <p className="text-muted-foreground">Bielstrasse 50, 4500 Solothurn</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm">📞 079 489 77 55</span>
                <span className="text-sm">✉️ info@burgergrill.ch</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Collection - Simplified */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Datenverarbeitung
            </CardTitle>
            <CardDescription>
              Welche Daten wir sammeln und warum
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border-l-4 border-primary/20 pl-4">
                <h4 className="font-medium">Website-Besuch</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Bei jedem Besuch unserer Website werden automatisch Informationen in Server-Logdateien gespeichert: 
                  IP-Adresse, Browsertyp, Betriebssystem, Referrer URL, Datum und Uhrzeit des Zugriffs.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Zweck:</strong> Technischer Betrieb und Sicherheit der Website<br/>
                  <strong>Rechtsgrundlage:</strong> Berechtigte Interessen (DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. f)<br/>
                  <strong>Speicherdauer:</strong> 30 Tage<br/>
                  <strong>Standort:</strong> Hetzner Deutschland (EU)
                </p>
              </div>

              <div className="border-l-4 border-primary/20 pl-4">
                <h4 className="font-medium">Grossbestellungen & Kontaktanfragen</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Für Grossbestellungen und Kontaktanfragen sammeln wir: Name, E-Mail-Adresse, 
                  Telefonnummer, Firmenname (optional), Bestelldetails und Nachrichteninhalt.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Zweck:</strong> Bearbeitung von Grossbestellungen und Kundenanfragen<br/>
                  <strong>Rechtsgrundlage:</strong> Einverständnis (DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. a) und Vertragsanbahnung (DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. b)<br/>
                  <strong>Speicherdauer:</strong> 3 Jahre (Geschäftskorrespondenz)<br/>
                  <strong>Standort:</strong> Hetzner Deutschland (EU)
                </p>
              </div>

              <div className="border-l-4 border-primary/20 pl-4">
                <h4 className="font-medium">Restaurant-Management (nur Inhaber)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Für die Verwaltung des Restaurant-Dashboards: E-Mail-Adresse, 
                  verschlüsseltes Passwort, Öffnungszeiten, Ferien-Einstellungen.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Zweck:</strong> Restaurant-Verwaltung (nur für Inhaberin)<br/>
                  <strong>Rechtsgrundlage:</strong> Berechtigte Interessen (DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. f)<br/>
                  <strong>Speicherdauer:</strong> Bis zur Löschung<br/>
                  <strong>Standort:</strong> Hetzner Deutschland (EU)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hosting & Data Transfer */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-200">
              <Lock className="w-6 h-6" />
              Hosting & Datenübertragung
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Sichere EU-Hosting-Infrastruktur
            </CardDescription>
          </CardHeader>
          <CardContent className="text-blue-800 dark:text-blue-200">
            <p className="text-sm">
              <strong>Hosting-Standort:</strong> Unsere Website wird auf Servern der Hetzner Online GmbH 
              in Deutschland gehostet. Deutschland ist EU-Mitglied und unterliegt der strengen DSGVO.
            </p>
            <ul className="list-disc list-inside mt-3 text-sm space-y-1">
              <li>Database-Server: Hetzner Deutschland (DSGVO-konform)</li>
              <li>Website-Hosting: Hetzner Deutschland (ISO 27001 zertifiziert)</li>
              <li>E-Mail-Service: Resend (EU-Datenschutz-konform)</li>
              <li>Backup-Systeme: Ebenfalls in Deutschland</li>
            </ul>
            <p className="text-xs mt-3">
              <strong>Datenübertragung:</strong> Daten können innerhalb der EU/EWR übertragen werden. 
              Bei Übertragungen in Drittländer verwenden wir EU-Standardvertragsklauseln oder 
              andere DSGVO-konforme Garantien.
            </p>
          </CardContent>
        </Card>

        {/* External Services - Comprehensive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              Externe Dienste & Drittanbieter
            </CardTitle>
            <CardDescription>
              Übersicht aller eingesetzten Drittanbieter-Services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Google Maps
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Eingebettete Karte zur Anzeige unseres Restaurant-Standorts.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Anbieter:</strong> Google LLC, USA<br/>
                  <strong>Zweck:</strong> Standort-Darstellung, Routenberechnung<br/>
                  <strong>Daten:</strong> IP-Adresse, Geräteinformationen<br/>
                  <strong>Datenschutz:</strong> <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-Mail-Versand (Resend)
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Transaktions-E-Mails und Kommunikation für Grossbestellungen.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Anbieter:</strong> Resend, EU<br/>
                  <strong>Zweck:</strong> E-Mail-Versand, Kommunikation<br/>
                  <strong>Daten:</strong> E-Mail-Adressen, Namen, Nachrichteninhalt<br/>
                  <strong>Rechtsgrundlage:</strong> Einverständnis, Vertragserfüllung
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Hetzner Cloud
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Hosting-Infrastruktur für Website und Datenbank.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Anbieter:</strong> Hetzner Online GmbH, Deutschland<br/>
                  <strong>Zweck:</strong> Website-Hosting, Datenspeicherung<br/>
                  <strong>Standort:</strong> Deutschland (EU)<br/>
                  <strong>Zertifizierung:</strong> ISO 27001, DSGVO-konform
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Next.js/Vercel (Font-Loading)
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Optimierte Web-Fonts für bessere Performance.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Anbieter:</strong> Google Fonts API<br/>
                  <strong>Zweck:</strong> Web-Font-Optimierung<br/>
                  <strong>Daten:</strong> IP-Adresse (bei Font-Requests)<br/>
                  <strong>Hinweis:</strong> Fonts werden lokal gecacht
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2">Zukünftige Services</h4>
              <p className="text-sm text-muted-foreground">
                Wir behalten uns vor, zusätzliche Services für verbesserte Funktionalität einzusetzen 
                (z.B. Analytics, Payment-Provider, Reservierungssysteme). Bei wesentlichen Änderungen 
                informieren wir Sie und aktualisieren diese Datenschutzerklärung entsprechend.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Framework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Anwendbares Datenschutzrecht
            </CardTitle>
            <CardDescription>
              Schweizer DSG als primäres Recht mit DSGVO-Compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🇨🇭 Primäres Recht: Schweizer DSG</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Als schweizer Unternehmen mit .ch-Domain und schweizer Zielgruppe unterliegen wir 
                primär dem <strong>schweizer Datenschutzgesetz (DSG)</strong>. Ihre Daten werden 
                nach schweizer Datenschutzstandards verarbeitet.
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                <li>• Schweizer Unternehmen (Solothurn)</li>
                <li>• .ch Domain und schweizer Ausrichtung</li>
                <li>• Primäre Zielgruppe: Schweizer Kunden</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">🇪🇺 Zusätzlich: DSGVO-Compliance</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Da unser Hosting-Partner (Hetzner) in Deutschland ansässig ist, halten wir 
                zusätzlich die <strong>europäische DSGVO</strong> ein. Dies bietet Ihnen einen 
                noch höheren Datenschutzstandard.
              </p>
              <ul className="text-xs text-green-600 dark:text-green-400 mt-2 space-y-1">
                <li>• Deutsches Hosting (Hetzner als Auftragsverarbeiter)</li>
                <li>• DSGVO-konforme Datenverarbeitung</li>
                <li>• Höchste EU-Datenschutzstandards</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Rechtsgrundlagen für Datenverarbeitung (DSG/DSGVO)</h4>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="text-sm">
                  <strong>DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. a:</strong><br/>
                  <span className="text-muted-foreground">Einwilligung (Kontaktformular, Cookies)</span>
                </div>
                <div className="text-sm">
                  <strong>DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. b:</strong><br/>
                  <span className="text-muted-foreground">Vertragserfüllung (Grossbestellungen)</span>
                </div>
                <div className="text-sm">
                  <strong>DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. f:</strong><br/>
                  <span className="text-muted-foreground">Berechtigte Interessen (Website-Sicherheit)</span>
                </div>
                <div className="text-sm">
                  <strong>DSG Art. 6 / DSGVO Art. 6 Abs. 1 lit. c:</strong><br/>
                  <span className="text-muted-foreground">Rechtliche Verpflichtung (Geschäftsunterlagen)</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium">Ihr Vorteil: Doppelter Schutz</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sie profitieren sowohl vom schweizer Datenschutzrecht als auch von den strengeren 
                EU-Standards. Wir wenden automatisch den jeweils höheren Schutzstandard an.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies - Comprehensive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Cookie className="w-6 h-6 text-primary" />
              Cookies & Tracking-Technologien
            </CardTitle>
            <CardDescription>
              Detaillierte Informationen zu Cookies und ähnlichen Technologien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-green-500/20 pl-4">
                <h4 className="font-medium text-green-700 dark:text-green-300">Unbedingt erforderliche Cookies</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Diese Cookies sind für das Funktionieren der Website erforderlich und können nicht 
                  abgewählt werden.
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Session-Management (Benutzer-Anmeldung)</li>
                  <li>• Sicherheits-Token (CSRF-Schutz)</li>
                  <li>• Cookie-Einstellungen (Ihre Cookie-Präferenzen)</li>
                  <li>• Load-Balancing (Server-Auslastung)</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500/20 pl-4">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Funktionale Cookies</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Diese Cookies ermöglichen erweiterte Funktionalität und Personalisierung.
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Theme-Einstellungen (Hell/Dunkel-Modus)</li>
                  <li>• Spracheinstellungen</li>
                  <li>• Benutzer-Präferenzen</li>
                  <li>• Formulardaten (temporär)</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500/20 pl-4">
                <h4 className="font-medium text-orange-700 dark:text-orange-300">Analytische Cookies (zukünftig)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Zur Analyse der Website-Nutzung. Werden nur mit Ihrer Einwilligung gesetzt.
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Besucherzahlen und -verhalten</li>
                  <li>• Beliebteste Seiten und Inhalte</li>
                  <li>• Verweildauer und Absprungrate</li>
                  <li>• Technische Performance-Metriken</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500/20 pl-4">
                <h4 className="font-medium text-purple-700 dark:text-purple-300">Marketing-Cookies (zukünftig)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Für personalisierte Werbung und Marketing. Nur mit expliziter Einwilligung.
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Personalisierte Inhalte</li>
                  <li>• Social Media Integration</li>
                  <li>• Remarketing und Retargeting</li>
                  <li>• Newsletter-Personalisierung</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">Cookie-Verwaltung</h4>
              <p className="text-sm text-muted-foreground">
                Sie können Ihre Cookie-Einstellungen jederzeit in Ihrem Browser ändern oder ein 
                Cookie-Banner nutzen (falls implementiert). Beachten Sie, dass das Deaktivieren 
                bestimmter Cookies die Funktionalität der Website beeinträchtigen kann.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Aktuelle Cookie-Richtlinie:</strong> Derzeit verwenden wir nur technisch 
                notwendige Cookies. Bei Implementierung zusätzlicher Cookies werden Sie entsprechend informiert.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Ihre Rechte
            </CardTitle>
            <CardDescription>
              Ihre Rechte gemäss schweizer DSG mit zusätzlichen DSGVO-Garantien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">🔍 Auskunftsrecht</h4>
                  <p className="text-sm text-muted-foreground">
                    Recht auf Auskunft über verarbeitete personenbezogene Daten
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">✏️ Berichtigungsrecht</h4>
                  <p className="text-sm text-muted-foreground">
                    Recht auf Korrektur unrichtiger Daten
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">🗑️ Löschungsrecht</h4>
                  <p className="text-sm text-muted-foreground">
                    Recht auf Löschung personenbezogener Daten
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">⏸️ Einschränkungsrecht</h4>
                  <p className="text-sm text-muted-foreground">
                    Recht auf Einschränkung der Verarbeitung
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">📤 Datenübertragbarkeit</h4>
                  <p className="text-sm text-muted-foreground">
                    Recht auf Übertragung Ihrer Daten
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">❌ Widerspruchsrecht</h4>
                  <p className="text-sm text-muted-foreground">
                    Recht auf Widerspruch gegen die Verarbeitung
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              Datenspeicherung & Löschung
            </CardTitle>
            <CardDescription>
              Speicherdauer und Löschkonzept für verschiedene Datenarten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500/20 pl-4">
                  <h4 className="font-medium text-sm">Server-Logs</h4>
                  <p className="text-xs text-muted-foreground">30 Tage, dann automatische Löschung</p>
                </div>
                <div className="border-l-4 border-green-500/20 pl-4">
                  <h4 className="font-medium text-sm">Benutzerkonten (Dashboard)</h4>
                  <p className="text-xs text-muted-foreground">Bis zur manuellen Löschung oder Anfrage</p>
                </div>
                <div className="border-l-4 border-orange-500/20 pl-4">
                  <h4 className="font-medium text-sm">Grossbestellungen</h4>
                  <p className="text-xs text-muted-foreground">3 Jahre (Geschäftskorrespondenz)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-500/20 pl-4">
                  <h4 className="font-medium text-sm">Kontaktanfragen</h4>
                  <p className="text-xs text-muted-foreground">2 Jahre oder bis zur Bearbeitung</p>
                </div>
                <div className="border-l-4 border-red-500/20 pl-4">
                  <h4 className="font-medium text-sm">Cookies</h4>
                  <p className="text-xs text-muted-foreground">Session-Ende oder nach 1 Jahr</p>
                </div>
                <div className="border-l-4 border-yellow-500/20 pl-4">
                  <h4 className="font-medium text-sm">Analytics (zukünftig)</h4>
                  <p className="text-xs text-muted-foreground">14 Monate, dann Anonymisierung</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-primary" />
              Kontakt, Beschwerden & Änderungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Datenschutz-Kontakt</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte:
                </p>
                <div className="space-y-1">
                  <p className="text-sm">📧 info@burgergrill.ch</p>
                  <p className="text-sm">📞 079 489 77 55</p>
                  <p className="text-sm">📍 Bielstrasse 50, 4500 Solothurn</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Beschwerderecht</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Sie haben das Recht, Beschwerde bei einer Aufsichtsbehörde einzulegen:
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Schweiz:</strong> Eidg. Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)</p>
                  <p><strong>Deutschland:</strong> Landesdatenschutzbehörden</p>
                  <p><strong>EU:</strong> Datenschutzbehörde Ihres Wohnsitzlandes</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium">Änderungen der Datenschutzerklärung</h4>
              <p className="text-sm text-muted-foreground">
                Diese Datenschutzerklärung kann aufgrund sich ändernder Rechtslage oder bei 
                Änderungen unserer Services angepasst werden. Die aktuelle Version ist stets 
                auf unserer Website verfügbar. Bei wesentlichen Änderungen informieren wir 
                Sie per E-Mail oder über einen deutlichen Hinweis auf unserer Website.
              </p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Erstellt:</strong> Juli 2025
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Letzte Aktualisierung:</strong> Juli 2025
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Version:</strong> 1.0
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}