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
  title: "Bizerte Nutrition",
description: "Bienvenue chez Bizerte Nutrition, votre source incontournable pour des conseils sur une alimentation saine et des astuces nutritionnelles.",
keywords: "nutrition, alimentation saine, conseils nutritionnels, Bizerte, santé",
authors: [{ name: "Bizerte Nutrition" }],
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
          duration: 1000,
          style: {
            color: '#fffff',
          },
        }}/>
      </body>
    </html>

  
  );
}
