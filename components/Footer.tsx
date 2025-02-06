import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import SocialMedia from "./SocialMedia";
import { Input } from "./ui/input";
import { categoriesData, quickLinksData } from "@/constants";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
       <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
       <div className="gap-6 flex flex-col items-center justify-center">
       <Link href={'/'}    className="flex items-center justify-center " >
        <Image src={'/logo.png'} alt='logo' width={150} height={150} />
      </Link>
          <p className="text-gray-600 text-sm text-center">House Protein est votre boutique spécialisée en nutrition sportive à Bizerte, Tunisie. Nous proposons une large gamme de compléments alimentaires, protéines, acides aminés et produits énergétiques pour optimiser vos performances et atteindre vos objectifs fitness.</p>
          <SocialMedia className="text-darkColor/60" iconClassName="border-darkColor/90 hover:border-darkColor hover:text-darkColor" tooltipClassName="bg-darkColor text-white"/>
        </div>
        <div>
<h3 className="font-semibold text-darkColor mb-4">Liens rapides</h3>
     <div className="flex flex-col gap-3">
      {quickLinksData.map((quicklink) => (
     
          <Link key={quicklink.title}
            href={quicklink.href}
            className="text-gray-600 text-sm font-medium hover:text-darkColor hoverEffect"
          >
            {quicklink.title}
          </Link>
  
      ))}
     </div>
        </div>
        <div>
        <h3 className="font-semibold text-darkColor mb-4">Categories</h3>
     <div className="flex flex-col gap-3">
      {categoriesData.map((categorie) => (
     
          <Link key={categorie.title}
            href={categorie.href}
            className="text-gray-600 text-sm font-medium hover:text-darkColor hoverEffect"
          >
            {categorie.title}
          </Link>
  
      ))}
     </div>
        </div>
        <div>
            <h3 className="font-semibold text-darkColor mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">Abonnez-vous à notre newsletter pour recevoir des mises à jour et des offres exclusives</p>
            <form action="" className="space-y-4">
            <Input type="email" placeholder="Entrez votre email" required className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline focus:ring-2 focus:ring-gray-200 " />
            <button className="w-full bg-darkColor text-white px-4 py-2 rounded-lg  hover:bg-gray-800 transition-colors hoverEffect">S&apos;abonner</button>
          </form>
        </div>
       </div>
      </Container>
    </footer>
  );
};

export default Footer;
