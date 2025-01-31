"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { internalGroqTypeReferenceTo, SanityImageCrop, SanityImageHotspot } from "@/sanity.types";

interface ImageViewProps {
  images: Array<{
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
  }>;
  productName: string;
  className?: string;
}

const ImageView = ({ images = [], productName, className }: ImageViewProps) => {
  const [selectedImage, setSelectedImage] = React.useState(images[0]);

  return (
    <div className={`${className} space-y-2 md:space-3`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedImage?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full aspect-[4/3] border border-gray-200 rounded-lg overflow-hidden"
        >
          <Image
            src={urlFor(selectedImage).width(600).format('webp').url()}
            fill
            alt={productName}
            priority
            sizes="(max-width: 768px) 90vw, 40vw"
            className="object-contain"
            quality={80}
          />
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-1.5">
        {images.map((image) => (
          <button
            key={image?._key}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square border rounded-md overflow-hidden ${
              selectedImage?._key === image?._key 
                ? "ring-1.5 ring-primary" 
                : "border-gray-200"
            }`}
            aria-label={`View ${productName} - Image ${images.indexOf(image) + 1}`}
          >
            <Image
              src={urlFor(image).width(150).format('webp').url()}
              fill
              alt=""
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 20vw, 8vw"
              quality={60}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;