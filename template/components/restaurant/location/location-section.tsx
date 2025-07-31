import { cn } from "@/lib/utils";
import { ContactInfo } from "./contact-info";
import { OpeningHours } from "./opening-hours";
import { MapEmbed } from "./map-embed";
import { HolidayBanner } from "./holiday-banner";
import { LocationData, LocationSectionProps } from "./types";
import { getOpeningHours } from "@/lib/restaurant/actions/opening-hours";
import { getActiveSpecialHours } from "@/lib/restaurant/actions/special-hours";

// Authentic Burgergrill location data (Solothurn)
const defaultLocationData: LocationData = {
  contact: {
    address: {
      street: "Bielstrasse 50",
      city: "Solothurn",
      postalCode: "4500",
      country: "Schweiz"
    },
    phone: "079 489 77 55",
    email: "info@burgergrill.ch" // From site config
  },
  hours: {
    monday: "10:00 - 14:00",
    tuesday: "10:00 - 18:30",
    wednesday: "10:00 - 18:30", 
    thursday: "10:00 - 18:30",
    friday: "10:00 - 18:30",
    saturday: "9:00 - 18:00",
    sunday: "Geschlossen"
  },
  // Google Maps embed for Bielstrasse 50, 4500 Solothurn (CSP now allows frame-src)
  mapEmbed: {
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2677.579554787817!2d7.528403866414368!3d47.21035549845828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e1a8c8d8f8d8f%3A0x8d8f8d8f8d8f8d8f!2sBielstrasse%2050%2C%204500%20Solothurn!5e0!3m2!1sde!2sch!4v1643723400000!5m2!1sde!2sch",
    title: "Burgergrill Solothurn - Bielstrasse 50"
  }
};

export async function LocationSection({ 
  data = defaultLocationData, 
  className 
}: LocationSectionProps) {
  // KISS: Simple server-side data fetching with fallback
  let liveOpeningHours = null;
  let activeHoliday = null;

  try {
    // Fetch live data from database
    const dbHours = await getOpeningHours();
    const holiday = await getActiveSpecialHours();
    
    // DEBUG: Log the data structure
    console.log('🏪 Marketing page database data:', { dbHours, holiday });
    
    if (dbHours) {
      // Convert database format to component format - FIXED DATA STRUCTURE
      liveOpeningHours = {
        monday: !dbHours.monday?.isOpen ? 'Geschlossen' : `${dbHours.monday?.openTime} - ${dbHours.monday?.closeTime}`,
        tuesday: !dbHours.tuesday?.isOpen ? 'Geschlossen' : `${dbHours.tuesday?.openTime} - ${dbHours.tuesday?.closeTime}`,
        wednesday: !dbHours.wednesday?.isOpen ? 'Geschlossen' : `${dbHours.wednesday?.openTime} - ${dbHours.wednesday?.closeTime}`,
        thursday: !dbHours.thursday?.isOpen ? 'Geschlossen' : `${dbHours.thursday?.openTime} - ${dbHours.thursday?.closeTime}`,
        friday: !dbHours.friday?.isOpen ? 'Geschlossen' : `${dbHours.friday?.openTime} - ${dbHours.friday?.closeTime}`,
        saturday: !dbHours.saturday?.isOpen ? 'Geschlossen' : `${dbHours.saturday?.openTime} - ${dbHours.saturday?.closeTime}`,
        sunday: !dbHours.sunday?.isOpen ? 'Geschlossen' : `${dbHours.sunday?.openTime} - ${dbHours.sunday?.closeTime}`,
      };
      
      // DEBUG: Log the converted data
      console.log('🏪 Converted opening hours:', liveOpeningHours);
    }
    
    activeHoliday = holiday;
  } catch (error) {
    console.error('Marketing page data fetch error:', error);
    // Graceful degradation - use hardcoded data
  }

  // Use live data if available, fallback to hardcoded
  const displayData = {
    ...data,
    hours: liveOpeningHours || data.hours
  };
  return (
    <section 
      id="location" 
      className={cn("py-20 lg:py-32 bg-muted/20", className)}
    >
      <div className="container mx-auto px-4">
        {/* KISS: Simple Holiday Banner - show if active */}
        {activeHoliday && (
          <div className="mb-8">
            <HolidayBanner />
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Besuchen Sie uns
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Vor dem Conforama in Solothurn servieren wir Ihnen authentische Cevapcici 
            und saftige Burger. Kommen Sie vorbei und erleben Sie unser Restaurant.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Contact Info & Hours */}
          <div className="space-y-6">
            <ContactInfo contact={displayData.contact} />
            <OpeningHours hours={displayData.hours} />
          </div>

          {/* Right Column: Map */}
          <div className="lg:order-first xl:order-last">
            <MapEmbed 
              mapEmbed={displayData.mapEmbed}
              address={displayData.contact.address}
            />
          </div>
        </div>

      </div>
    </section>
  );
}