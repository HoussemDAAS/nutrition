import type { Metadata } from "next";

import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';
import localFont from 'next/font/local'
import { Toaster } from "react-hot-toast";

const raleway = localFont({
  src: '../fonts/Raleway.woff2',
  variable:'--font-raleway',
  weight: '100 900',
})
export const metadata: Metadata = {
  title: {
    default: "House Protein Bizerte - Nutrition Sportive Tunisie",
    template: "%s | House Protein Bizerte"
  },
  description: "Boutique en ligne de nutrition sportive en Tunisie. Protéines, BCAA, créatine et compléments alimentaires au meilleur prix. Livraison rapide dans toute la Tunisie.",
  keywords: [
    "nutrition sportive Tunisie",
    "compléments alimentaires musculation",
    "protéines en poudre Tunisie",
    "achat produits fitness Tunisie",
    "BCAA Tunisie",
    "créatine Tunisie",
    "livraison rapide Tunisie"
  ],
  authors: [{ name: "House Protein Bizerte", url: "https://house-protein.tn" }],
  openGraph: {
    type: "website",
    locale: "fr_TN",
    siteName: "House Protein Bizerte",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Bizerte Nutrition - Votre spécialiste en nutrition sportive"
      }
    ]
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

  <html lang="en">
      <body
        className={`${raleway.variable} antialiased`}
      >
        <Header />
      
        {children}
        <SpeedInsights dsn="5iV1AJTNj13san7iTNVYYug2J14" />
        <Footer />
        <Toaster  position="bottom-right" toastOptions={{ 
          duration: 2000,
          style: {
            color: '#fffff',
          },
        }}/>
      </body>
    </html>

  
  );
}
