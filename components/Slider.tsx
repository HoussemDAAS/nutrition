"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Slider } from "@/sanity.types";

const Sliders = ({ sliders }: { sliders: Slider[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  }, [sliders.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 5) nextSlide();
    else if (diff < -5) prevSlide();
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute inset-y-0 w-full justify-between items-center z-10 px-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Image Slider */}
      <div 
        className="relative aspect-[1440/500] w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {sliders.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide 
                ? "opacity-100 z-10" 
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Link 
              href={`/${slide?.status}/${slide?.slug?.current}`} 
              className="block relative w-full h-full"
            >
              <Image
                src={slide.image ? urlFor(slide.image)
                  .width(1440)
                  .height(500)
                  .fit('clip')
                  .url() : '/placeholder-image.png'}
                alt={slide.title || 'Slider Image'}
                fill
                priority={index === 0}
                className="object-contain"
                quality={95}
                sizes="(max-width: 768px) 100vw, 1440px"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 py-2">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-8 h-1 transition-all duration-300 ${
              index === currentSlide 
                ? "bg-red-600"
                : "bg-blue-300"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Sliders;