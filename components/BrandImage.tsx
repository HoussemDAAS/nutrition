// components/BrandImage.tsx
"use client";

import { internalGroqTypeReferenceTo, SanityImageCrop, SanityImageHotspot } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";


interface BrandImageProps {
  image: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
      _key: string;
    };
  alt: string;
  width?: number;
  height?: number;
}

export default function BrandImage({ image, alt, width = 80, height = 40 }: BrandImageProps) {
  return (
    <Image
      src={urlFor(image).url()}
      alt={alt}
      width={width}
      height={height}
      className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
      onLoad={() => {}}
    />
  );
}