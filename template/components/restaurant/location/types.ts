/**
 * Location Section Types
 * Restaurant location, contact, and hours data structures
 */

export interface AddressData {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ContactData {
  address: AddressData;
  phone: string;
  email: string;
}

export interface OpeningHoursData {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface LocationData {
  contact: ContactData;
  hours: OpeningHoursData;
  mapEmbed?: {
    src: string;
    title: string;
  };
}

export interface LocationSectionProps {
  data?: LocationData;
  className?: string;
}