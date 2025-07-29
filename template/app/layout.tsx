import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { Header, Footer } from "@/components/layout";
import { getSiteMetadata } from "@/lib/config";
import { headers } from "next/headers";
// Restaurant layout with clean structure

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteMetadata = getSiteMetadata();

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get headers and check for Coming Soon indicators
  const headersList = headers();
  const comingSoonHeaderActive = headersList.get('x-coming-soon-active') === 'true';
  
  // Check if we're in Coming Soon mode (Environment Variable OR Middleware Header)
  const isComingSoon = process.env.SHOW_COMING_SOON === 'true';
  const shouldUseCleanLayout = isComingSoon || comingSoonHeaderActive;
  
  // Debug-Logging für Root Layout
  console.log('🏠 ROOT LAYOUT - Layout Decision:', {
    isComingSoon,
    comingSoonHeaderActive,
    shouldUseCleanLayout,
    timestamp: new Date().toISOString()
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Restaurant theme provider setup */}
          {shouldUseCleanLayout ? (
            // Coming Soon Mode - Clean layout without Header/Footer
            <div className="min-h-screen">
              {children}
            </div>
          ) : (
            // Normal Mode - Full layout with Header/Footer
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          )}
          {/* Clean restaurant layout structure */}
        </ThemeProvider>
      </body>
    </html>
  );
}
