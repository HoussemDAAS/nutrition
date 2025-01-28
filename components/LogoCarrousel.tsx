'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Brand } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

export default function LogoCarousel({ Brands }: { Brands: Brand[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += 1; // Adjust the value for scrolling speed
      }
    }, 30); // Adjust the interval for smoother scrolling

    return () => clearInterval(interval);
  }, []);

  // Duplicate the Brands array to create an infinite scroll effect
  const infiniteBrands = [...Brands, ...Brands, ...Brands, ...Brands];

  return (
    <div className="relative overflow-hidden my-10">
      {/* Logo Container with Infinite Scroll */}
      <div
        ref={carouselRef}
        className="flex gap-8 w-max animate-marquee items-center"
      >
        {infiniteBrands.map((logo, index) => (
          <Link
            href={`/brand/${logo.slug?.current}`}
            key={index}
            className="flex justify-center items-center transition-transform duration-300 ease-in-out h-32 w-32 md:h-48 md:w-48 "
          >
            {logo?.image && (
              <Image
                src={urlFor(logo?.image).url()}
                alt={logo.title || 'Logo'}
                width={500}  // Adjusted width for better visibility
                height={500} // Adjusted height for better visibility
                className="object-contain"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
