import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import Image from "next/image";
import { Brand, Category } from "@/sanity.types";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose, categories, brands }) => {
  const Pathname = usePathname();
  const SideBarRef = useOutsideClick<HTMLDivElement>(onClose);

  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isBrandOpen, setBrandOpen] = useState(false);

  const toggleCategory = () => {
    setCategoryOpen((prev) => !prev);
    if (isBrandOpen) setBrandOpen(false);  // Close the brand menu if open
  };

  const toggleBrand = () => {
    setBrandOpen((prev) => !prev);
    if (isCategoryOpen) setCategoryOpen(false);  // Close the category menu if open
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-darkColor/50 shadow-xl hoverEffect w-full transition-transform duration-500 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <motion.div
        className="min-x-72 max-w-72 bg-darkColor text-white/70 h-screen p-8 border-r border-r-gray-300 flex flex-col gap-6 overflow-y-auto"
        ref={SideBarRef}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between pb-8">
          <Link href={"/"} onClick={onClose}>
            <Image
              src={"/logo.png"}
              alt="logo"
              width={140}
              height={140}
              className="w-36 h-36 object-contain mx-auto"
            />
          </Link>
          <button className="hover:text-red-500" onClick={onClose}>
            <X className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-5 text-lg font-semibold tracking-wide">
          {headerData.map((item, index) => {
            if (item.title === "Catégories") {
              return (
                <div className="relative" key={index}>
                  <button
                    onClick={toggleCategory}
                    className={`relative hover:text-white transition-all duration-300 ${isCategoryOpen ? "text-white" : ""} group`}
                  >
                    {item.title}
                    <span
                      className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
                        isCategoryOpen && "scale-x-100"
                      }`}
                    />
                  </button>
                  {isCategoryOpen && (
                    <div className="grid grid-cols-1 gap-4 p-4 bg-darkColor text-white rounded-lg mt-2">
                      {categories.map((category, idx) => (
                        <Link
                          key={idx}
                          href={`/category/${category?.slug?.current}`}
                          className="block py-2 px-4 hover:bg-gray-700 rounded-lg text-sm font-medium"
                          onClick={onClose}
                        >
                          {category?.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (item.title === "Brands") {
              return (
                <div key={index} className="relative">
                  <button
                    onClick={toggleBrand}
                    className={`relative hover:text-white transition-all duration-300 ${isBrandOpen ? "text-white" : ""} group`}
                  >
                    {item.title}
                    <span
                      className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
                        isBrandOpen && "scale-x-100"
                      }`}
                    />
                  </button>
                  {isBrandOpen && (
                    <div className="grid grid-cols-1 gap-4 p-4 bg-darkColor text-white rounded-lg mt-2">
                      {brands.map((brand, idx) => (
                        <Link
                          key={idx}
                          href={`/brand/${brand?.slug?.current}`}
                          className="block py-2 px-4 hover:bg-gray-700 rounded-lg text-sm font-medium"
                          onClick={onClose}
                        >
                          {brand?.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                className={`hover:text-white relative group transition-all duration-300 ${
                  Pathname === item?.href && "text-white"
                }`}
                href={item?.href}
                onClick={onClose}
              >
                {item?.title}
                <span
                  className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
                    Pathname === item?.href && "scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Social Media Section */}
        <div className="py-6">
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default SideBar;
