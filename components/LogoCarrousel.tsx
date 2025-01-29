'use client';
import Image from 'next/image';
import { Brand } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

export default function LogoCarousel({ Brands }: { Brands: Brand[] }) {
  const infiniteBrands = [...Brands, ...Brands];

  return (
    <div className="relative font-inter antialiased overflow-hidden my-10">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        <div 
          className="w-full inline-flex flex-nowrap overflow-hidden 
          [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          {/* First set of logos */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-6 animate-infinite-scroll">
            {infiniteBrands.map((brand, index) => (
              <li key={`first-${index}`} className="p-2 md:p-3">
                <Link
                  href={`/brand/${brand.slug?.current}`}
                  className="flex justify-center items-center transition-all 
                  duration-300 hover:scale-110 h-24 w-48 md:h-24 md:w-48
                  group relative"
                >
                  {brand?.image && (
                    <Image
                      src={urlFor(brand.image).url()}
                      alt={brand.title || 'Brand Logo'}
                      width={200}
                      height={100}
                      className="object-contain max-h-full w-auto 
                        transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                        group-hover:translate-y-[-5%]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Mirrored set for infinite effect */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-6 animate-infinite-scroll"
            aria-hidden="true"
          >
            {infiniteBrands.map((brand, index) => (
              <li key={`second-${index}`} className="p-2 md:p-3">
                <Link
                  href={`/brand/${brand.slug?.current}`}
                  className="flex justify-center items-center transition-all 
                  duration-300 hover:scale-110 h-24 w-48 md:h-24 md:w-48
                  group relative"
                >
                  {brand?.image && (
                    <Image
                      src={urlFor(brand.image).url()}
                      alt={brand.title || 'Brand Logo'}
                      width={200}
                      height={100}
                      className="object-contain max-h-full w-auto 
                        transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                        group-hover:translate-y-[-5%]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}