'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Brand } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

export default function LogoCarousel({ Brands }: { Brands: Brand[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Brands.length - 1 : prev - 1));
    carouselRef.current?.scrollBy({ left: -180, behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === Brands.length - 1 ? 0 : prev + 1));
    carouselRef.current?.scrollBy({ left: 180, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-6xl mx-auto overflow-hidden  pt-4 pb-7 mb-8 ">
      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 z-10 p-1 bg-red-500 rounded-full shadow-md hover:bg-red-600"
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>

      {/* Logo Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 w-full justify-center overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {Brands.map((logo, index) => (
          <Link href={`/brand/${logo.slug?.current}`}
            key={index}
            className={`transition-transform duration-300 ease-in-out snap-center ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-50 scale-75'}`}
          >
            {logo?.image && (
              <Image 
                src={urlFor(logo?.image).url()} 
                alt={logo.title || 'Logo'} 
                width={150} 
                height={80} 
                className="object-contain w-[150px] h-[80px]"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 z-10 p-1 bg-AccentColor/70 rounded-full shadow-md hover:bg-AccentColor transition-transform"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>
    </div>
  );
}
