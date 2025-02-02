/* eslint-disable @next/next/no-img-element */
"use client";

import { Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ScrollableList({ categories }: { categories: Category[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress((scrollLeft / maxScroll) * 100);
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = direction === 'right' ? 300 : -300;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full pb-8 md:pb-8 mx-auto max-w-[90vw]">
      {/* Scrollable Content with Gradient Edges */}
      <div className="relative group">
        <div 
          ref={containerRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto py-6 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {categories.map((category) => (
            <Link
              href={`/category/${category?.slug?.current}`}
              key={category._id}
              className="snap-start snap-always flex-none min-w-[50vw] md:min-w-[220px]"
            >
         
              <motion.div 
                whileHover={{ y: -5 }}
                className="group relative h-[160px] md:h-[200px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#9dceff] to-[#1396fa]"
              >
                {/* Image Container */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <img
                    src={category.image ? urlFor(category.image).url() : "/placeholder.svg"}
                    alt={category.title}
                    className="w-3/4 h-3/4 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>

                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-center text-white font-semibold text-sm md:text-base uppercase tracking-wide">
                    {category.title}
                  </h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
       
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="px-4 mt-6">
        <div className="relative h-2 bg-gray-200/30 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-[#DA1D3C] transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          >
            <div className="absolute right-0 w-2 h-full bg-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Floating Arrows */}
      <div className="hidden md:flex justify-center gap-4 mt-6">
        <button 
          onClick={() => scrollTo('left')}
          className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6 text-[#0F2E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => scrollTo('right')}
          className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6 text-[#0F2E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}