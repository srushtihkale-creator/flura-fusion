import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://florafusion.in"),
  title: "Flora Fusion — Nature Meets Your Space",
  description:
    "Discover a wide range of healthy plants, beautiful pots and quality seeds — all in one place. Premium Indian plant nursery lifestyle brand.",
  icons: {
    icon: "/assets/logo.png",
  },
  openGraph: {
    title: "Flora Fusion — Nature Meets Your Space",
    description:
      "Premium Indian plant nursery e-commerce for healthy plants, artisan pots, and organic seeds.",
    siteName: "Flora Fusion",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 600,
        alt: "Flora Fusion",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#173F2B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
