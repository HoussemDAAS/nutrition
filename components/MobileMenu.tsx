"use client";
import React from "react";
import { AlignLeft } from "lucide-react";
import SideBar from "./SideBar";
import { Category, Brand } from "@/sanity.types";

interface MobileMenuProps {
  categories: Category[]; // Receive categories
  brands: Brand[]; // Receive brands
}

const MobileMenu: React.FC<MobileMenuProps> = ({ categories, brands }) => {
  const [showSideBar, setShowSideBar] = React.useState(false);
  
  return (
    <>
      <button onClick={() => setShowSideBar(!showSideBar)}>
        <AlignLeft className="w-6 h-6 hover:text-darkColor hoverEffect md:hidden" />
      </button>
      <div className="md:hidden">
        <SideBar
          isOpen={showSideBar}
          onClose={() => setShowSideBar(false)}
          categories={categories} // Pass categories
          brands={brands} // Pass brands
        />
      </div>
    </>
  );
};

export default MobileMenu;
