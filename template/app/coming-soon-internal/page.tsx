import { ComingSoonPage } from '@/components/coming-soon';

// Internal Coming Soon Route - nur von Middleware aufgerufen
export default function ComingSoonInternalPage() {
  // Debug-Logging
  console.log('📄 Coming Soon Internal Page rendered at:', new Date().toISOString());
  
  return <ComingSoonPage />;
}

// Metadata für die Coming Soon Page
export const metadata = {
  title: 'Coming Soon - Burgergrill Solothurn',
  description: 'Burgergrill Solothurn - Authentische Balkan-Küche, bald für Sie da',
  robots: 'noindex, nofollow', // Coming Soon sollte nicht indexiert werden
};