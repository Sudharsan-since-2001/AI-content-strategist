import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AI Content Strategist | Premium Social Strategy",
  description: "Generate high-converting social media content strategies instantly with AI. Tailored for brands, niches, and specific goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols for icons */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
        
        {/* Preload monospace fonts for notepad */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Style for monospace font fallback */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Ensure monospace fonts are available for notepad */
            .notepad-document,
            .notepad-content,
            .notepad-line-numbers,
            .line-number {
              font-family: 'Consolas', 'Monaco', 'Courier New', 'Courier', monospace !important;
            }
            
            /* Keep Outfit for UI elements */
            body {
              font-family: var(--font-outfit), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
          `
        }} />
      </head>
      <body className={`${outfit.variable} antialiased font-[family-name:var(--font-outfit)]`}>
        {children}
      </body>
    </html>
  );
}