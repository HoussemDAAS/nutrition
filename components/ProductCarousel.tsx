"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Produit } from "@/sanity.types";
import ProductCard from "./ProductCard";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import NoProducts from "./NoProducts";
import { useInView } from 'react-intersection-observer';
const ProductCarousel = ({ variant, status }: { variant?: string; status?: string }) => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLElement[]>([]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  // Fetch data from Sanity
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let query, params;
        if (status) {
          query = `*[_type == 'produit' && Status == $status] | order(_createdAt desc)`;
          params = { status };
        } else {
          query = `*[_type == 'produit' && variantes == $variant] | order(_createdAt desc)`;
          params = { variant };
        }
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

  // Update current index based on scroll position
  const updateCurrentIndex = useCallback(() => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const scrollPosition = carousel.scrollLeft + carousel.offsetWidth / 2;
    
    itemsRef.current.some((item, index) => {
      if (item.offsetLeft + item.offsetWidth >= scrollPosition) {
        setCurrentIndex(index);
        return true;
      }
      return false;
    });
  }, []);

  // Set up scroll listener to update active index
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    itemsRef.current = Array.from(carousel.children) as HTMLElement[];
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateCurrentIndex, 100);
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [products, updateCurrentIndex]);

  // Scroll handlers for arrow navigation
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="my-10 w-full relative" ref={ref}>
      {inView && (
        isLoading ? (
          <div className="flex justify-center items-center py-10 w-full">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-lg font-semibold">Loading...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Carousel Container */}
            <div className="relative">
              <motion.div
                ref={carouselRef}
                className="flex overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar w-full -ml-4"
                whileTap={{ cursor: "grabbing" }}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    className="flex-shrink-0 w-[calc(100vw-32px)] pl-4 snap-start sm:w-[200px] sm:snap-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} isNew={product.Status === "Nouveau"} />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Left & Right Navigation Arrows (visible on all devices) */}
              <button
                onClick={scrollLeft}
                aria-label="Scroll Left"
                className="flex absolute top-1/2 -translate-y-1/2 left-2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md z-10"
              >
                <ArrowLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll Right"
                className="flex absolute top-1/2 -translate-y-1/2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md z-10"
              >
                <ArrowRight className="w-5 h-5 text-gray-800" />
              </button>
            </div>
            
            {/* Circular Indicator Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              <IndicatorPagination total={products.length} currentIndex={currentIndex} />
            </div>
          </>
        ) : (
          <NoProducts selectedTab={variant || status || "default"} />
        )
      )}
    </div>
  );
};

interface IndicatorPaginationProps {
  total: number;
  currentIndex: number;
}

const IndicatorPagination = ({ total, currentIndex }: IndicatorPaginationProps) => {
  return (
    <>
      {Array.from({ length: total }).map((_, index) => (
        <motion.span
          key={index}
          className="h-3 w-3 rounded-full"
          initial={false}
          animate={{
            scale: currentIndex === index ? 1.2 : 1,
            backgroundColor: currentIndex === index ? "#DA1D3C" : "#D1D5DB",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </>
  );
};

export default ProductCarousel;
