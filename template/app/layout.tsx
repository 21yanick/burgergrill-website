/**
 * 🏠 ROOT LAYOUT - Next.js 15 Clean Architecture
 * Minimal root layout - Route Groups handle specific layouts
 * 
 * Features:
 * - ThemeProvider for dark/light mode
 * - Font loading and CSS globals
 * - Coming Soon mode support
 * - Route Groups: (marketing) and dashboard/
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { getSiteMetadata } from "@/lib/config";
import { headers } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check for Coming Soon mode (Environment Variable OR Middleware Header)
  const headersList = await headers();
  const comingSoonHeaderActive = headersList.get('x-coming-soon-active') === 'true';
  const isComingSoon = process.env.SHOW_COMING_SOON === 'true';
  const shouldUseCleanLayout = isComingSoon || comingSoonHeaderActive;

  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {shouldUseCleanLayout ? (
            // Coming Soon Mode - Clean layout
            <div className="min-h-screen">
              {children}
            </div>
          ) : (
            // Normal Mode - Route Groups handle their own layouts
            <>{children}</>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
