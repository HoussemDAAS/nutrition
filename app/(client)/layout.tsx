import type { Metadata } from "next";
import Script from "next/script"; // ✅ Import next/script
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';
import localFont from 'next/font/local';
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/next';

const raleway = localFont({
  src: '../fonts/Raleway.woff2',
  variable:'--font-raleway',
  weight: '100 900',
});

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
        width: 700,
        height: 300,
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
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="google-site-verification" content="XBJuQG42g2exmGtWuaBYtQaYp09j5Kn8TtIXaapakSQ" />
      </head>
      <body className={`${raleway.variable} antialiased`}>
        
        {/* ✅ Facebook Pixel Script */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1008907547333368');
              fbq('track', 'PageView');
            `,
          }}
        />

        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1008907547333368&ev=PageView&noscript=1"
          />
        </noscript>

        <Header />
        {children}
        <Analytics />
        <SpeedInsights dsn="5iV1AJTNj13san7iTNVYYug2J14" />
        <Footer />
        <Toaster position="bottom-right" toastOptions={{ 
          duration: 2000,
          style: { color: '#fffff' },
        }} />
      </body>
    </html>
  );
}
