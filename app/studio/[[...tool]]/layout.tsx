import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Bizerte Nutrition",
    description: "Bienvenue chez Bizerte Nutrition, votre source incontournable pour des conseils sur une alimentation saine et des astuces nutritionnelles.",     
    keywords: "nutrition,Protein,Creatine, Bizerte, santé",
    authors: [{ name: "Bizerte Nutrition" }],
  };
const RootLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <html lang="fr">
        <body>
            {children}
        </body>
    </html>
  )
}

export default RootLayout
