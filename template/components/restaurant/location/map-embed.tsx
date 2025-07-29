import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MapEmbedProps {
  mapEmbed?: {
    src: string;
    title: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export function MapEmbed({ mapEmbed, address }: MapEmbedProps) {
  // Create Google Maps search URL
  const addressString = `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          Standort
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {mapEmbed ? (
          // Real Google Maps embed
          <div className="aspect-[4/3] w-full">
            <iframe
              src={mapEmbed.src}
              title={mapEmbed.title}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-b-lg"
            />
          </div>
        ) : (
          // Placeholder with map preview
          <div className="aspect-[4/3] w-full bg-muted/30 flex flex-col items-center justify-center rounded-b-lg border-t">
            <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
            <div className="text-center px-6">
              <h3 className="font-semibold text-lg mb-2">Besuchen Sie uns</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {address.street}<br />
                {address.postalCode} {address.city}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <a 
                  href={mapsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  In Google Maps öffnen
                </a>
              </Button>
            </div>
          </div>
        )}
        
        {/* Alternative: Add directions button */}
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="w-full justify-center"
          >
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressString)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Route planen
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}