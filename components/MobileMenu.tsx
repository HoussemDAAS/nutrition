"use client";
import React from "react";
import { AlignLeft } from "lucide-react";
import SideBar from "./SideBar";
import { Category, Brand } from "@/sanity.types";

interface MobileMenuProps {
  categories: Category[];
  brands: Brand[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ categories, brands }) => {
  const [showSideBar, setShowSideBar] = React.useState(false);
  
  return (
    <>
      <button 
        onClick={() => setShowSideBar(!showSideBar)} 
        className="flex items-center gap-1"
      >
        <AlignLeft className="w-6 h-6 hover:text-darkColor hoverEffect" />
        <span className="text-sm">Menu</span>
      </button>
      <div className="md:hidden">
        <SideBar
          isOpen={showSideBar}
          onClose={() => setShowSideBar(false)}
          categories={categories}
          brands={brands}
        />
      </div>
    </>
  );
};

export default MobileMenu;
