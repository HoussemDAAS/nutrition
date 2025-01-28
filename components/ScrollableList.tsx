/* eslint-disable @next/next/no-img-element */
"use client";

import { Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Fragment } from "react";
import Link from "next/link";

export default function ScrollableList({ categories }: { categories: Category[] }) {
  return (
    <div className="relative overflow-hidden w-full pt-4 pb-7 mb-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex space-x-6 flex-nowrap animate-move-left [animation-duration:15s] md:[animation-duration:10s] hover:[animation-play-state:paused]">
        {[...new Array(3)].fill(0).map((_, index) => (
          <Fragment key={index}>
            {categories.map((category) => (
              <Link
                href={`/category/${category?.slug?.current}`}
                key={category._id}
                className="flex flex-col items-center justify-center w-[156px] h-[130px] md:w-[228px] md:h-[154px] bg-darkColor/5 rounded-md p-2 transition-transform hover:bg-darkColor/10 hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                {/* Image */}
                <div className="w-28 h-28 overflow-hidden rounded-md flex items-center justify-center transition-transform duration-200 transform hover:scale-110">
                  <img
                    src={category.image ? urlFor(category.image).url() : ""}
                    alt={category.title}
                    className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] object-contain"
                  />
                </div>
                {/* Title */}
                <h5 className="mt-1 text-xs md:text-sm font-medium text-center uppercase tracking-wide text-gray-700">{category.title}</h5>
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
      {/* Hide scrollbar */}
      <style jsx>{`
        .animate-move-left {
          animation: move-left 15s linear infinite;
        }
        .animate-move-left:hover {
          animation-play-state: paused;
        }
        @keyframes move-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  );
}
