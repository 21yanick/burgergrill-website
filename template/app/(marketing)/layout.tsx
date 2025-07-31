/**
 * 🍔 MARKETING LAYOUT - Customer-facing pages
 * Full layout with header and footer for marketing pages
 * 
 * Features:
 * - Glassmorphism Header with logo and theme toggle
 * - Restaurant Footer with contact info
 * - SEO-optimized structure
 * - Responsive design
 */

import { Header, Footer } from "@/components/layout";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Marketing Header - Logo + Theme Toggle */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Marketing Footer - Contact + Links */}
      <Footer />
    </div>
  );
}