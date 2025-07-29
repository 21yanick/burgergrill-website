import { cn } from "@/lib/utils";
import { ContactInfo } from "./contact-info";
import { OpeningHours } from "./opening-hours";
import { MapEmbed } from "./map-embed";
import { LocationData, LocationSectionProps } from "./types";

// Mock data for Swiss restaurant (Zürich)
const defaultLocationData: LocationData = {
  contact: {
    address: {
      street: "Bahnhofstrasse 47",
      city: "Zürich",
      postalCode: "8001",
      country: "Schweiz"
    },
    phone: "+41 44 123 45 67",
    email: "info@burgergrill.ch" // From site config
  },
  hours: {
    monday: "Geschlossen",
    tuesday: "11:00 - 22:00",
    wednesday: "11:00 - 22:00", 
    thursday: "11:00 - 22:00",
    friday: "11:00 - 23:00",
    saturday: "11:00 - 23:00",
    sunday: "12:00 - 21:00"
  },
  // Optional: Real Google Maps embed can be added later
  // mapEmbed: {
  //   src: "https://www.google.com/maps/embed?pb=...",
  //   title: "Burgergrill Zürich Standort"
  // }
};

export function LocationSection({ 
  data = defaultLocationData, 
  className 
}: LocationSectionProps) {
  return (
    <section 
      id="location" 
      className={cn("py-20 lg:py-32 bg-muted/20", className)}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Besuchen Sie uns
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mitten im Herzen von Zürich servieren wir Ihnen authentische Cevapcici 
            und saftige Burger. Kommen Sie vorbei und erleben Sie unser Restaurant.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Contact Info & Hours */}
          <div className="space-y-6">
            <ContactInfo contact={data.contact} />
            <OpeningHours hours={data.hours} />
          </div>

          {/* Right Column: Map */}
          <div className="lg:order-first xl:order-last">
            <MapEmbed 
              mapEmbed={data.mapEmbed}
              address={data.contact.address}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-background border rounded-full px-6 py-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              Reservationen empfohlen • Takeaway verfügbar
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}