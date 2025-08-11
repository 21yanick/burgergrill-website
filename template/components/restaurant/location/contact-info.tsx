import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactData } from "./types";

interface ContactInfoProps {
  contact: ContactData;
}

export function ContactInfo({ contact }: ContactInfoProps) {
  const { address, phone, email } = contact;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <MapPin className="w-6 h-6 text-accent" />
          Kontakt & Adresse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address - Enhanced visibility for restaurant location */}
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 mt-0.5 text-accent shrink-0" />
          <div>
            <p className="text-base font-semibold text-foreground">{address.street}</p>
            <p className="text-base text-muted-foreground">
              {address.postalCode} {address.city}
            </p>
            <p className="text-sm text-muted-foreground">{address.country}</p>
            <p className="text-xs text-accent mt-1 font-medium">
              Vor dem Conforama
            </p>
          </div>
        </div>

        {/* Phone - Enhanced as primary CTA for restaurant */}
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-accent shrink-0" />
          <a 
            href={`tel:${phone}`}
            className="text-base font-medium hover:text-accent transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-accent/5 flex-1"
          >
            {phone}
          </a>
        </div>

        {/* Email - Enhanced for business inquiries */}
        <div className="flex items-center gap-4">
          <Mail className="w-5 h-5 text-accent shrink-0" />
          <a 
            href={`mailto:${email}`}
            className="text-base font-medium hover:text-accent transition-colors py-2 px-1 -mx-1 rounded-md hover:bg-accent/5 flex-1 break-all"
          >
            {email}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}