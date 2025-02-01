/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function SanityImage({ value }: any) {
  return (
    <div className="my-6">
      <Image
        src={urlFor(value).url()}
        alt={value.alt || " "}
        width={800}
        height={600}
        className="w-full h-auto rounded-lg"
        placeholder="blur"
        blurDataURL={urlFor(value).width(24).height(24).blur(10).url()}
      />
      {value.caption && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          {value.caption}
        </p>
      )}
    </div>
  );
}