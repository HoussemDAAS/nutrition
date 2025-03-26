/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { Brand, Category } from "@/sanity.types";

interface HeaderMenuProps {
  categories: Category[];
  brands: Brand[];
}

// Custom hook to detect clicks outside of a component
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({ categories, brands }) => {
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isBrandOpen, setBrandOpen] = useState(false);
  const pathname = usePathname();

  const categoryRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // @ts-ignore
  useClickOutside(categoryRef, () => setCategoryOpen(false));
  // @ts-ignore
  useClickOutside(brandRef, () => setBrandOpen(false));

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
    <div className="hidden md:flex items-center gap-5 text-sm capitalize font-semibold text-white">
      {headerData.map((item, index) => {
        if (item.title === "Catégories") {
          return (
            <div className="relative" key={index} ref={categoryRef}>
              <button
                onClick={toggleCategory}
                className={`relative hover:text-white transition-all duration-300 ${
                  isCategoryOpen ? "text-white" : "text-white/90"
                }`}
              >
                {item.title}
                <span
                  className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 transition-transform duration-300 ease-in-out ${
                    pathname.startsWith("/category/") || isCategoryOpen
                      ? "scale-x-100"
                      : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-gray-800 shadow-lg rounded-lg w-64 p-4 transition-opacity duration-300 ease-in-out z-50">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {categories.map((category, idx) => (
                      <Link
                        key={idx}
                        href={`/category/${category?.slug?.current}`}
                        className="block py-2 px-4 hover:bg-gray-700 rounded-lg text-sm font-medium text-center border border-gray-600 text-white transition duration-200"
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
            <div key={index} className="relative" ref={brandRef}>
              <button
                onClick={toggleBrand}
                className={`relative hover:text-white transition-all duration-300 ${
                  isBrandOpen ? "text-white" : "text-white/90"
                }`}
              >
                {item.title}
                <span
                  className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 transition-transform duration-300 ease-in-out ${
                    pathname.startsWith("/brand/") || isBrandOpen
                      ? "scale-x-100"
                      : ""
                  }`}
                />
              </button>
              {isBrandOpen && (
                <div className="absolute top-full left-0 mt-2 bg-gray-800 shadow-lg rounded-lg w-64 p-4 transition-opacity duration-300 ease-in-out z-50">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {brands.map((brand, idx) => (
                      <Link
                        key={idx}
                        href={`/brand/${brand?.slug?.current}`}
                        className="block py-2 px-4 hover:bg-gray-700 rounded-lg text-sm font-medium text-center border border-gray-600 text-white transition duration-200"
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
            className={`hover:text-white relative group transition-all duration-300 ${
              pathname === item.href ? "text-white" : "text-white/90"
            }`}
            href={item.href}
          >
            {item.title}
            <span
              className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
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