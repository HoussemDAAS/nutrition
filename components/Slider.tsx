"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Slider } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

const Sliders = ({ sliders }: { sliders: Slider[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [sliders.length]);

  return (
    <div className="relative w-full overflow-hidden h-[220px] md:h-[280px] lg:h-[420px]">
      <motion.div
        className="flex w-full h-full"
        animate={{
          x: `-${currentSlide * 100}%`,
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        {sliders.map((slide, index) => (
          <div
            key={slide._id}
            className="flex-shrink-0 w-full h-full relative group"
          >
            {/* Slide Image */}
            <Image
              src={slide?.image ? urlFor(slide.image).url() : ""}
              alt={slide?.title || "Slide Image"}
              fill
              priority={index === 0}
              className="object-cover object-center w-full h-full"
            />

            {/* Hover Content */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4 text-white">
              <Link href={`/${slide?.status}/${slide?.slug?.current}`}>
                <p className="px-6 py-4 text-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-md hover:animate-pulse">
                  Voir Plus
                </p>
              </Link>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Sliders;
