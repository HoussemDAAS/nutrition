"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Brand, Category } from "@/sanity.types";
import { headerData } from "@/constants"; // Array of your primary nav links (e.g. Accueil, Promotion, etc)

// ----------------------
// Helper: Group Categories
// ----------------------
const groupCategories = (categories: Category[]) => {
  const groups: Record<string, Category[]> = {};
  categories.forEach((cat) => {
    if (!cat?.title) return;
    // Use the first word as the group key (all lowercase)
    const key = cat.title.split(" ")[0].toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(cat);
  });
  return groups;
};

// ----------------------
// SideBar Props
// ----------------------
interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
}

// ----------------------
// SideBar Component
// ----------------------
const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose, categories, brands }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  // Tab state: "categories" (default) or "liens" (renamed "Menu")
  const [activeTab, setActiveTab] = useState<"categories" | "liens">("categories");

  // For grouped categories, track each group’s open state.
  const [openGroup, setOpenGroup] = useState<Record<string, boolean>>({});

  // For the brands accordion (inside the Menu tab), track its open state.
  const [isBrandOpen, setBrandOpen] = useState(true);

  const toggleGroup = (groupKey: string) => {
    setOpenGroup((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  // Group categories using the helper
  const grouped = groupCategories(categories);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-white transition-transform duration-500 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <motion.div ref={sidebarRef} className="w-72 bg-white h-screen flex flex-col">
        {/* Header: Logo and Close Button */}
        <div className="flex items-center justify-between p-4 shadow-b">
          <Link href="/" onClick={onClose}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={140}
              className="w-28 h-auto object-contain"
            />
          </Link>
          <button onClick={onClose} className="hover:text-red-400">
            <X size={28} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 py-4 text-center text-sm font-medium uppercase ${
              activeTab === "categories"
                ? "border-b-2 border-darkColor text-AccentColor bg-gray-200"
                : "text-black"
            }`}
          >
            Catégories
          </button>
          <button
            onClick={() => setActiveTab("liens")}
            className={`flex-1 py-4 text-center text-sm font-medium uppercase ${
              activeTab === "liens"
                ? "border-b-2 border-darkColor text-AccentColor bg-gray-200"
                : "text-black"
            }`}
          >
            Menu
          </button>
        </div>

        {/* Content Area with Smooth Transition */}
        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="wait">
            {activeTab === "categories" && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className=""
              >
                {Object.entries(grouped).map(([groupKey, cats]) => {
                  // If more than one category in this group, render a collapsible group.
                  if (cats.length > 1) {
                    const isOpenGroup = openGroup[groupKey] ?? true; // default open
                    return (
                      <div key={groupKey} className="flex flex-col">
                        <button
                          onClick={() => toggleGroup(groupKey)}
                          className={`flex items-center justify-between w-full px-4 py-4 border-b border-gray-200 transition-colors ${
                            isOpenGroup
                              ? "bg-red-500 border-l-4 border-red-500 text-white"
                              : "hover:bg-gray-300 text-black/80"
                          }`}
                        >
                          <span className="text-sm font-semibold uppercase ">
                            {groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}
                          </span>
                          {isOpenGroup ? (
                            <ChevronUp size={16} className="border-l pl-1 border-gray-200" />
                          ) : (
                            <ChevronDown size={16} className="border-l pl-1 border-gray-200" />
                          )}
                        </button>
                        {isOpenGroup &&
                          cats.map((cat, idx) => (
                            <Link
                              key={cat?._id || idx}
                              href={`/category/${cat?.slug?.current}`}
                              className="block py-2 pl-12 pr-4 hover:bg-gray-200 text-sm font-medium border-b border-gray-200 uppercase"
                              onClick={onClose}
                            >
                              {cat?.title}
                            </Link>
                          ))}
                      </div>
                    );
                  } else {
                    // Single category group: show a simple link.
                    const cat = cats[0];
                    return (
                      <Link
                        key={cat?._id || groupKey}
                        href={`/category/${cat?.slug?.current}`}
                        className="block py-4 px-4 hover:bg-gray-200 text-black/80 text-sm font-semibold border-b border-gray-200 uppercase"
                        onClick={onClose}
                      >
                        {cat?.title}
                      </Link>
                    );
                  }
                })}
              </motion.div>
            )}

            {activeTab === "liens" && (
              <motion.div
                key="liens"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className=""
              >
                {/* Primary Nav Links */}
                <div className="flex flex-col">
                  {headerData.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`block py-4 px-4 hover:bg-gray-200 rounded-md text-sm font-semibold border-b border-gray-200 ${
                        pathname === item.href ? "text-AccentColor" : "text-black/80"
                      } uppercase`}
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                {/* Brands Accordion */}
                <div className="flex flex-col">
                  <button
                    onClick={() => setBrandOpen((prev) => !prev)}
                    className={`flex items-center justify-between w-full px-4 py-4 border-b border-gray-200 transition-colors ${
                      isBrandOpen
                        ? "bg-red-500 border-l-4 border-red-500 text-white"
                        : "hover:bg-gray-300 text-black/80"
                    }`}
                  >
                    <span className="text-sm font-semibold uppercase">Marques</span>
                    {isBrandOpen ? (
                      <ChevronUp size={16} className="border-l pl-1 border-gray-200" />
                    ) : (
                      <ChevronDown size={16} className="border-l pl-1 border-gray-200" />
                    )}
                  </button>
                  {isBrandOpen &&
                    brands.map((brand, idx) => (
                      <Link
                        key={brand?._id || idx}
                        href={`/brand/${brand?.slug?.current}`}
                        className="block py-2 px-4 hover:bg-gray-200 rounded-md text-sm font-medium border-b border-gray-200 uppercase"
                        onClick={onClose}
                      >
                        {brand?.title}
                      </Link>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer: Social Media */}
        <div className="p-4">
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default SideBar;
