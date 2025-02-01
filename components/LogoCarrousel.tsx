'use client';
import Image from 'next/image';
import { Brand } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

export default function LogoCarousel({ Brands }: { Brands: Brand[] }) {
  return (
    <div className="relative font-inter antialiased my-10">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        {/* Mobile - Vertical Stack */}
        <div className="md:hidden">
          <ul className="flex flex-col items-center space-y-8">
            {Brands.map((brand, index) => (
              <li key={`mobile-${index}`} className="w-full max-w-48 h-24 flex-shrink-0">
                <BrandLink brand={brand} />
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop - Centered Grid */}
        <div className="hidden md:block">
          <ul className="flex flex-wrap justify-center items-center gap-6">
            {Brands.map((brand, index) => (
              <li key={`desktop-${index}`} className="h-30 w-40 flex-shrink-0">
                <BrandLink brand={brand} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BrandLink({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brand/${brand.slug?.current}`}
      className="flex justify-center items-center h-full w-full relative group"
    >
      {brand?.image && (
        <div className="relative w-full h-full aspect-video">
          <Image
            src={urlFor(brand.image).url()}
            alt={brand.title || 'Brand Logo'}
            fill
            className="object-contain p-1 transition-transform duration-300 ease-in-out 
              group-hover:scale-105 group-hover:-translate-y-1"
            sizes="(max-width: 768px) 192px, 96px"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg" />
    </Link>
  );
}