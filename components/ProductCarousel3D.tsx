"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Produit } from "@/sanity.types";
import ProductCard from "./ProductCard";

import { motion } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import NoProducts from "./NoProducts";
import { useInView } from "react-intersection-observer";
import { client } from "@/sanity/lib/client";

const ProductCarousel3D = ({ variant, status }: { variant?: string; status?: string }) => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const query = status 
          ? `*[_type == 'produit' && Status == $status] | order(_createdAt desc)`
          : `*[_type == 'produit' && variantes == $variant] | order(_createdAt desc)`;
        const params = status ? { status } : { variant };
        const response = await client.fetch(query, params);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [variant, status]);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const cardWidth = 300;
    const scrollAmount = direction === 'right' ? cardWidth : -cardWidth;
    
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });

    setCurrentIndex(prev => {
      const newIndex = direction === 'right' 
        ? Math.min(prev + 1, products.length - 1)
        : Math.max(prev - 1, 0);
      return newIndex;
    });
  }, [products.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleScroll('left');
      if (e.key === 'ArrowRight') handleScroll('right');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleScroll]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  return (
    <div className="relative py-8 w-full" ref={ref}>
      {inView && (isLoading ? (
        <div className="flex justify-center items-center py-10 w-full">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-lg font-semibold">Loading...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="relative group">
          {/* Reduced gradient overlay */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none opacity-50" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none opacity-50" />

          <motion.div
            ref={carouselRef}
            className="flex overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar px-4 gap-4"
            whileTap={{ cursor: 'grabbing' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                className="flex-shrink-0 snap-center"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                style={{ width: '300px' }}
              >
                <div className={`
                  relative transition-all duration-500
                  ${index === currentIndex ? 'scale-100' : 'scale-95'}
                  hover:scale-105 hover:shadow-xl
                `}>
                  <ProductCard
                    product={product}
                    isNew={product.Status === "Nouveau"}
                    className="rounded-xl shadow-lg overflow-hidden"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Always visible arrows */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-30 transition-all"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-30 transition-all"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      ) : (
        <NoProducts selectedTab={variant || status || "default"} />
      ))}
    </div>
  );
};

export default ProductCarousel3D;