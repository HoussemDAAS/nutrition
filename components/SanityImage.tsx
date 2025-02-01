/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useState } from "react";

export default function SanityImage({ value }: { value: any }) {
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  
  useEffect(() => {
    if (value?.asset?.metadata?.dimensions) {
      const { width, height } = value.asset.metadata.dimensions;
      setAspectRatio(width / height);
    }
  }, [value]);

  if (!value?.asset) return null;

  return (
    <figure className="my-6 space-y-2">
        <div className="relative rounded-lg overflow-hidden" 
           style={{ 
             aspectRatio,
             maxWidth: "min(100%, 800px)" // Added max-width constraint
           }}>
        <Image
          src={urlFor(value)
            .width(1440)
            .height(Math.round(1440 / aspectRatio))
            .quality(95)
            .fit('max')
            .auto('format')
            .url()}
          alt={value.alt || "Product image"}
          fill
          className="object-contain"
          placeholder="blur"
          blurDataURL={value.asset.metadata?.lqip}
         sizes="(max-width: 640px) 100vw, 80vw"
          loading="lazy"
          decoding="async"
        />
      </div>
     
    </figure>
  );
}