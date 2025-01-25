"use client";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import { Category } from "@/sanity.types";

interface HeaderMenuProps {
  categories: Category[]; // Accept categories as prop
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ categories }) => {
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isBrandOpen, setBrandOpen] = useState(false);
  const Pathname = usePathname();

  // Static brands for now
  const brands = ["Brand1", "Brand2", "Brand3", "Brand4"];

  const toggleCategory = () => {
    setCategoryOpen(!isCategoryOpen);
    if (isBrandOpen) setBrandOpen(false);
  };

  const toggleBrand = () => {
    setBrandOpen(!isBrandOpen);
    if (isCategoryOpen) setCategoryOpen(false);
  };

  useEffect(() => {
    setCategoryOpen(false);
    setBrandOpen(false);
  }, [Pathname]);

  return (
    <div className="hidden md:flex w-1/3 items-center gap-5 text-sm capitalize font-semibold">
      {headerData.map((item, index) => {
        if (item.title === "Catégories") {
          return (
            <div className="relative" key={index}>
              <button
                onClick={toggleCategory}
                className={`relative hover:text-darkColor ${isCategoryOpen ? "text-darkColor" : ""}`}
              >
                {item.title}
                <span
                  className={`absolute h-0.5 w-full bg-darkColor bottom-0 left-0 transform scale-x-0 transition-transform duration-300 ease-in-out ${
                    Pathname.startsWith("/category/") || isCategoryOpen
                      ? "scale-x-100"
                      : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg w-64 p-4 transition-all duration-300 ease-in-out">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-center">
                    {categories.map((category: Category, idx) => (
                      <Link
                        key={idx}
                        href={`/category/${category?.slug?.current}`}
                        className="block py-2 px-4 hover:bg-gray-100 rounded-md text-sm text-center items-center w-fit justify-center"
                      >
                        {category?.title}
                      </Link>
                    ))}
                  </div>
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
            className={`relative hover:text-darkColor ${isCategoryOpen ? "text-darkColor" : ""}`}
          >
            {item.title}
            <span
              className={`absolute h-0.5 w-full bg-darkColor bottom-0 left-0 transform scale-x-0 transition-transform duration-300 ease-in-out ${
                Pathname.startsWith("/brand/") || isBrandOpen
                  ? "scale-x-100"
                  : ""
              }`}
            />
          </button>
              {isBrandOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg w-64 p-4 transition-all duration-300 ease-in-out">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {brands.map((brand, idx) => (
                      <Link
                        key={idx}
                        href={`/Brands/${brand.toLowerCase()}`}
                        className="block py-2 px-4 hover:bg-gray-100 rounded-md text-sm"
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={index}
            className={`hover:text-darkColor hoverEffect relative group ${Pathname === item?.href && "text-darkColor"}`}
            href={item?.href}
          >
            {item?.title}
            <span
              className={`absolute h-0.5 w-full bg-darkColor bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${Pathname === item?.href && "scale-x-100"}`}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default HeaderMenu;
