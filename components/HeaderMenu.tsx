"use client";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import { Brand, Category } from "@/sanity.types";

interface HeaderMenuProps {
  categories: Category[];
  brands:Brand[],
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ categories,brands }) => {
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isBrandOpen, setBrandOpen] = useState(false);
  const pathname = usePathname();



  const toggleCategory = () => {
    setCategoryOpen((prev) => !prev);
    if (isBrandOpen) setBrandOpen(false);
  };

  const toggleBrand = () => {
    setBrandOpen((prev) => !prev);
    if (isCategoryOpen) setCategoryOpen(false);
  };

  useEffect(() => {
    setCategoryOpen(false);
    setBrandOpen(false);
  }, [pathname]);

  return (
    <div className="hidden md:flex w-1/3 items-center gap-5 text-sm capitalize font-semibold">
      {headerData.map((item, index) => {
        if (item.title === "Catégories") {
          return (
            <div className="relative" key={index}>
              <button
                onClick={toggleCategory}
                className={`relative hover:text-darkColor transition-all duration-300 ${
                  isCategoryOpen ? "text-darkColor" : ""
                }`}
              >
                {item.title}
                <span
                  className={`absolute h-0.5 w-full bg-darkColor bottom-0 left-0 transform scale-x-0 transition-transform duration-300 ease-in-out ${
                    pathname.startsWith("/category/") || isCategoryOpen
                      ? "scale-x-100"
                      : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg w-64 p-4 transition-opacity duration-300 ease-in-out z-50">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {categories.map((category, idx) => (
                      <Link
                        key={idx}
                        href={`/category/${category?.slug?.current}`}
                        className="block py-2 px-4 hover:bg-gray-100 rounded-lg text-sm font-medium text-center border border-gray-200 transition duration-200"
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
                className={`relative hover:text-darkColor transition-all duration-300 ${
                  isBrandOpen ? "text-darkColor" : ""
                }`}
              >
                {item.title}
                <span
                  className={`absolute h-0.5 w-full bg-darkColor bottom-0 left-0 transform scale-x-0 transition-transform duration-300 ease-in-out ${
                    pathname.startsWith("/brand/") || isBrandOpen
                      ? "scale-x-100"
                      : ""
                  }`}
                />
              </button>
              {isBrandOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg w-64 p-4 transition-opacity duration-300 ease-in-out z-50">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {brands.map((brand, idx) => (
                      <Link
                        key={idx}
                        href={`/brand/${brand?.slug?.current}`}
                        className="block py-2 px-4 hover:bg-gray-100 rounded-lg text-sm font-medium text-center border border-gray-200 transition duration-200"
                      >
                        {brand?.title}
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
            className={`hover:text-darkColor relative group transition-all duration-300 ${
              pathname === item.href && "text-darkColor"
            }`}
            href={item.href}
          >
            {item.title}
            <span
              className={`absolute h-0.5 w-full bg-darkColor bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
                pathname === item.href && "scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default HeaderMenu;
