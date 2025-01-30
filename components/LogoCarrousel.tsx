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
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center [&_li]:mx-4 animate-infinite-scroll">
            {infiniteBrands.map((brand, index) => (
              <li key={`first-${index}`} className="h-28 w-40 md:h-24 md:w-32 flex-shrink-0">
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
                        className="object-contain p-1 md:p-2 transition-transform duration-300 ease-in-out 
                          group-hover:scale-110 group-hover:-translate-y-1"
                        sizes="(max-width: 768px) 120px, 150px"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg" />
                </Link>
              </li>
            ))}
          </ul>
          
          <ul className="flex items-center [&_li]:mx-4 animate-infinite-scroll" aria-hidden="true">
            {infiniteBrands.map((brand, index) => (
              <li key={`second-${index}`} className="h-28 w-40 md:h-24 md:w-32 flex-shrink-0">
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
                        className="object-contain p-1 md:p-2 transition-transform duration-300 ease-in-out 
                          group-hover:scale-110 group-hover:-translate-y-1"
                        sizes="(max-width: 768px) 120px, 150px"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}