import { cn } from "@/lib/utils";
import { ContactInfo } from "./contact-info";
import { OpeningHours } from "./opening-hours";
import { MapEmbed } from "./map-embed";
import { HolidayBanner } from "./holiday-banner";
import { LocationData, LocationSectionProps } from "./types";
import { getDisplayOpeningHours } from "@/lib/restaurant/actions/opening-hours";
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
    saturday: "10:00 - 18:00", // Fixed: matches database
    sunday: "Geschlossen"
  },
  // Google Maps embed for Bielstrasse 50, 4500 Solothurn (CSP now allows frame-src)
  mapEmbed: {
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d734.5907313949376!2d7.526920328953299!3d47.211241866053044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4791d804a2f7a8f5%3A0xaeea4c9e0f451141!2sConforama%20Solothurn!5e0!3m2!1sde!2sch!4v1754924706092!5m2!1sde!2sch",
    title: "Burgergrill Solothurn - Bielstrasse 50"
  }
};

export async function LocationSection({ 
  data = defaultLocationData, 
  className 
}: LocationSectionProps) {
  // KISS: Simple server-side data fetching with clean separation of concerns
  let liveOpeningHours = null;
  let activeHoliday = null;

  try {
    // Fetch pre-formatted display data (no complex conversion needed)
    const displayHours = await getDisplayOpeningHours();
    const holiday = await getActiveSpecialHours();
    
    // Clean: Direct assignment, no complex transformation
    liveOpeningHours = displayHours;
    activeHoliday = holiday;
    
    // DEBUG: Only log when data is fetched successfully  
    if (displayHours) {
      console.log('🏪 Marketing page live data loaded successfully');
    }
  } catch (error) {
    console.error('🚨 Marketing page data fetch error:', error);
    // Graceful degradation - use hardcoded fallback data
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
            <HolidayBanner holiday={activeHoliday} />
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Besuchen Sie uns
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Vor dem Conforama in Solothurn servieren wir Ihnen authentische Cevapcici, 
            saftige Burger und leckere Hot Dog. Kommen Sie vorbei und erleben Sie unsere Spezialitäten frisch vom Grill.
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