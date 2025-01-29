/* eslint-disable @next/next/no-img-element */
"use client";

import { Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Fragment } from "react";
import Link from "next/link";

export default function ScrollableList({ categories }: { categories: Category[] }) {
  return (
    <div className="relative overflow-hidden w-full pt-4 pb-7 mb-8 
      [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      
      {/* Mobile-optimized scrolling container */}
      <div className="flex gap-6 flex-nowrap animate-infinite-scroll 
        hover:[animation-play-state:paused] group">
        
        {[...Array(4)].map((_, index) => (
          <Fragment key={index}>
            {categories.map((category) => (
              <Link
                href={`/category/${category?.slug?.current}`}
                key={`${category._id}-${index}`}
                className="flex flex-col items-center justify-center 
                  w-[156px] h-[130px] md:w-[228px] md:h-[154px]
                  bg-darkColor/5 rounded-md p-2 transition-transform 
                  hover:bg-darkColor/10 hover:scale-105 hover:shadow-lg 
                  cursor-pointer flex-none shrink-0" // Added shrink-0
              >
                {/* Image container with size constraints */}
                <div className="w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-md 
                  flex items-center justify-center transition-transform 
                  duration-200 group-hover:[animation-play-state:paused]">
                  <img
                    src={category.image ? urlFor(category.image).url() : ""}
                    alt={category.title}
                    className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] 
                      object-contain aspect-square"
                  />
                </div>
                
                {/* Category title */}
                <h5 className="mt-1 text-xs md:text-sm font-medium text-center 
                  uppercase tracking-wide text-gray-700 break-words px-1">
                  {category.title}
                </h5>
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}