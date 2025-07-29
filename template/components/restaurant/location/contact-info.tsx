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
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          Kontakt & Adresse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">{address.street}</p>
            <p className="text-muted-foreground">
              {address.postalCode} {address.city}
            </p>
            <p className="text-muted-foreground">{address.country}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <a 
            href={`tel:${phone}`}
            className="text-sm hover:text-accent transition-colors"
          >
            {phone}
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <a 
            href={`mailto:${email}`}
            className="text-sm hover:text-accent transition-colors"
          >
            {email}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}