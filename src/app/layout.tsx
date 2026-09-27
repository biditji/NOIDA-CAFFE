import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

// The one webfont: display headings only, one weight, latin only (~18KB). Self-hosted by
// next/font with size-adjusted fallback metrics, so the swap causes no layout shift.
//
// Body text uses the system UI stack instead of Inter. Inter needed its 85KB latin-ext
// file just for the ₹ glyph, and in Lighthouse's mobile run the webfonts made the first
// layout ~2x slower. System fonts (Roboto, SF, Segoe UI) all ship ₹ and cost nothing.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "₹150 off your next visit — Morrow Café, Sector 104 Noida",
  description:
    "Claim ₹150 off your next visit to Morrow Café in Sector 104, Noida. Just your name and number — your code appears instantly.",
  openGraph: {
    title: "₹150 off your next visit at Morrow Café",
    description: "Claim in ten seconds. Show the code at the counter.",
    type: "website",
    locale: "en_IN",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5eee3",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
