"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import Image from "next/image";
import { Brand, Category } from "@/sanity.types";

// Helper function: group categories by the first word (lowercased)
const groupCategories = (categories: Category[]) => {
  const groups: Record<string, Category[]> = {};
  categories.forEach((cat) => {
    if (!cat?.title) return;
    const key = cat.title.split(" ")[0].toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(cat);
  });
  return groups;
};

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose, categories, brands }) => {

  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  // Tab state: "categories" or "brands"
  const [activeTab, setActiveTab] = useState<"categories" | "brands">("categories");

  // For grouped categories, keep track of open/closed state per group key.
  const [openGroupKeys, setOpenGroupKeys] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupKey: string) => {
    setOpenGroupKeys((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  // Group categories by first word
  const groupedCategories = groupCategories(categories);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-darkColor/50 shadow-xl transition-transform duration-500 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <motion.div
        ref={sidebarRef}
        className="min-w-[18rem] max-w-[18rem] bg-darkColor text-white h-screen p-6 flex flex-col overflow-y-auto"
      >
        {/* Header: Logo and Close Button */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" onClick={onClose}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={140}
              className="w-32 h-auto object-contain"
            />
          </Link>
          <button onClick={onClose} className="text-white hover:text-red-500">
            <X size={28} />
          </button>
        </div>

        {/* Tabs for Categories and Brands */}
        <div className="flex border-b border-gray-600 mb-4">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 py-2 text-center text-lg font-semibold ${
              activeTab === "categories" ? "border-b-2 border-white" : "text-gray-400"
            }`}
          >
            Catégories
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`flex-1 py-2 text-center text-lg font-semibold ${
              activeTab === "brands" ? "border-b-2 border-white" : "text-gray-400"
            }`}
          >
            Marques
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            {Object.entries(groupedCategories).map(([groupKey, groupCats]) => {
              if (groupCats.length > 1) {
                const isGroupOpen = openGroupKeys[groupKey] ?? true; // default open
                return (
                  <div key={groupKey} className="flex flex-col">
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className="flex items-center justify-between w-full py-2 px-4 bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      <span>{groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}</span>
                      {isGroupOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isGroupOpen &&
                      groupCats.map((cat, idx) => (
                        <Link
                          key={cat?._id || idx}
                          href={`/category/${cat?.slug?.current}`}
                          className="block py-2 pl-8 pr-4 hover:bg-gray-600 rounded-lg text-sm"
                          onClick={onClose}
                        >
                          {cat?.title}
                        </Link>
                      ))}
                  </div>
                );
              } else {
                // If there is only one category in this group, render it as a simple link.
                const cat = groupCats[0];
                return (
                  <Link
                    key={cat?._id || groupKey}
                    href={`/category/${cat?.slug?.current}`}
                    className="block py-2 px-4 hover:bg-gray-600 rounded-lg text-sm font-medium"
                    onClick={onClose}
                  >
                    {cat?.title}
                  </Link>
                );
              }
            })}
          </div>
        )}

        {activeTab === "brands" && (
          <div className="space-y-4">
            {brands.map((brand, idx) => (
              <Link
                key={brand?._id || idx}
                href={`/brand/${brand?.slug?.current}`}
                className="block py-2 px-4 hover:bg-gray-600 rounded-lg text-sm font-medium"
                onClick={onClose}
              >
                {brand?.title}
              </Link>
            ))}
          </div>
        )}

        {/* Social Media Section at the Bottom */}
        <div className="mt-auto pt-6">
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default SideBar;
