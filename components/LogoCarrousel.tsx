'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Brand } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LogoCarousel({ Brands }: { Brands: Brand[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Brands.length - 1 : prev - 1));
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth / 3,
        behavior: 'smooth',
      });
    }
  };

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === Brands.length - 1 ? 0 : prev + 1));
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth / 3,
        behavior: 'smooth',
      });
    }
  };

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const scrollLeft = carouselRef.current?.scrollLeft ?? 0;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const moveX = moveEvent.clientX;
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = scrollLeft - (moveX - startX);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-6xl mx-auto overflow-hidden pt-4 pb-7 mb-8">
      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 z-10 p-2 bg-red-500 rounded-full shadow-md hover:bg-red-600"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>

      {/* Logo Container */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        className="flex gap-6 w-full justify-start overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 cursor-grab"
      >
        {Brands.map((logo, index) => (
          <Link
            href={`/brand/${logo.slug?.current}`}
            key={index}
            className={`transition-transform duration-300 ease-in-out snap-center ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-50 scale-75'
            }`}
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.3 },
              }}
              className="flex justify-center items-center"
            >
              {logo?.image && (
                <Image
                  src={urlFor(logo?.image).url()}
                  alt={logo.title || 'Logo'}
                  width={200}
                  height={120}
                  className="object-contain w-[150px] h-[90px] sm:w-[180px] sm:h-[110px] md:w-[200px] md:h-[120px] lg:w-[220px] lg:h-[130px]"
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 z-10 p-2 bg-AccentColor/70 rounded-full shadow-md hover:bg-AccentColor transition-transform"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>
    </div>
  );
}
