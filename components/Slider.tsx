"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
// import { Button } from "./ui/button";
import { Slider } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const Sliders = ({ sliders }:{sliders:Slider[]}) => {

 

  // Duplicate the slides array for seamless infinite loop
  const extendedSlides = [...sliders, ...sliders];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length); // Cycle through original slides
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval); // Cleanup on unmount
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-full h-full"
        animate={{
          x: `-${currentSlide * 100}%`, // Keep moving forward by 100% of each slide
        }}
        transition={{
          duration: 1.5, // Smooth, slow transition
          ease: "easeInOut",
        }}
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {extendedSlides.map((slide, index) => (
              <div
                key={slide._id + index}
                className="flex-shrink-0 w-full h-full relative group"
              >
                <Image
                    src={slide?.image ? urlFor(slide.image).url() : ""}
                  alt={slide?.title || "Slide Image"}
                  fill
                  priority
                  className="object-cover w-full h-full"
                />
                {/* Content that appears on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4 text-white">
                  <Link href={`/${slide?.status}/${slide?.slug?.current}`}>
                    <p className="px-6 py-4 text-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-md hover:animate-pulse">
                      Voir Plus
                    </p>
                  </Link>
                </div>
                
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Add responsive height */}
      <style jsx>{`
        .relative {
          height: 600px; /* Increased height for desktop */
        }
        @media (max-width: 768px) {
          .relative {
            height: 250px; /* Adjust for smaller screens (mobile) */
          }
        }
      `}</style>
    </div>
  );
};

export default Sliders;
