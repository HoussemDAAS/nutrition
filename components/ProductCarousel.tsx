"use client";
import React, { useState, useEffect, useRef } from "react";
import { Produit } from "@/sanity.types";
import ProductCard from "./ProductCard";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import NoProducts from "./NoProducts";

const ProductCarousel = ({ variant }: { variant: string }) => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const query = `*[_type == 'produit' && variantes == $variant] | order(_createdAt desc)`;
        const params = { variant };
        const response = await client.fetch(query, params);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [variant]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth } = carouselRef.current;
      const totalItems = products.length;
      const itemWidth = scrollWidth / totalItems;
      const index = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(index);
    }
  };

  return (
    <div className="my-10 flex flex-col items-center w-full overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center py-10 w-full">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-lg font-semibold">Loading...</span>
        </div>
      ) : products.length > 0 ? (
        <>
          <motion.div
            ref={carouselRef}
            className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar w-full justify-center"
            whileTap={{ cursor: "grabbing" }}
            onScroll={handleScroll}
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                className="flex-shrink-0 w-[250px] snap-center"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
           <div className="md:hidden">
          <IndicatorPagination total={products.length} currentIndex={currentIndex} />

           </div>
        </>
      ) : (
        <NoProducts selectedTab={variant} />
      )}
    </div>
  );
};

// Indicator Component
const IndicatorPagination = ({ total, currentIndex }: { total: number; currentIndex: number }) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-1 w-6 rounded-full transition-all duration-300 ${
            currentIndex === index ? "bg-gray-900" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default ProductCarousel;

// Add the following styles in your global CSS file (e.g., globals.css)
