"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Category } from "@/sanity.types";
import { X } from "lucide-react";

const CategoryDropdown = ({ categories, slug }: { categories: Category[]; slug: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [checkedCategories, setCheckedCategories] = useState<Record<string, boolean>>({});

  // Set default checked state after the component mounts
  useEffect(() => {
    const initialCheckedState: Record<string, boolean> = {};
    categories.forEach((category) => {
      if (category?.slug?.current === slug) {
        initialCheckedState[category._id] = true;
      }
    });
    setCheckedCategories(initialCheckedState);
  }, [categories, slug]);

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setCheckedCategories((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Filter categories by their title
  const filteredCategories = categories.filter((category) =>
    category.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block w-64">
        <Accordion type="single" collapsible>
          <AccordionItem value="categories">
            <AccordionTrigger className="text-left text-lg text-AccentColor tracking-wide uppercase">
              Categories
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-2">
                <Input
                  placeholder="Recherche"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3 w-full"
                />
                <div className="max-h-48 overflow-y-auto">
                  {filteredCategories.map((category: Category) => (
                    <label key={category._id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                        checked={checkedCategories[category._id] || false}
                        onChange={() => handleCheckboxChange(category._id)}
                      />
                      <span className="text-sm text-gray-800">{category.title || "Unnamed Category"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Mobile View */}
      <button
        className="md:hidden px-4 py-2 bg-AccentColor text-white rounded-lg"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        Filter
      </button>

      {isMobileFilterOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-0 bg-white z-50 shadow-lg"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold">Filter</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            <Input
              placeholder="Recherche"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3 w-full"
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredCategories.map((category: Category) => (
                <label key={category._id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                    checked={checkedCategories[category._id] || false}
                    onChange={() => handleCheckboxChange(category._id)}
                  />
                  <span className="text-sm text-gray-800">{category.title || "Unnamed Category"}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CategoryDropdown;
