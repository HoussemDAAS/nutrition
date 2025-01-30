/* eslint-disable @next/next/no-img-element */
"use client";

import { Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

export default function ScrollableList({ categories }: { categories: Category[] }) {
  return (
    <div className="relative w-full py-6 md:py-8 mx-auto max-w-[90vw] 
      [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      
      {/* Changed class from hide-scrollbar to no-scrollbar */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scroll-smooth no-scrollbar py-2">
        {categories.map((category) => (
          <Link
            href={`/category/${category?.slug?.current}`}
            key={category._id}
            className="flex flex-col items-center justify-center 
              min-w-[45vw] h-[140px] md:min-w-[220px] md:h-[160px] lg:min-w-[240px]
              bg-gray-100 rounded-lg p-3 md:p-4 transition-transform 
              hover:bg-gray-200 hover:scale-105 hover:shadow-md
              cursor-pointer flex-none"
          >
            <div className="w-22 h-22 md:w-24 md:h-24 lg:w-28 lg:h-28 overflow-hidden rounded-md 
              flex items-center justify-center">
              <img
                src={category.image ? urlFor(category.image).url() : ""}
                alt={category.title}
                className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20
                  object-contain aspect-square"
                loading="lazy"
              />
            </div>
            
            <h5 className="mt-2 md:mt-3 text-xs md:text-sm text-center 
              font-medium text-gray-700 uppercase tracking-wide 
              px-1 line-clamp-2 leading-tight">
              {category.title}
            </h5>
          </Link>
        ))}
      </div>
    </div>
  );
}