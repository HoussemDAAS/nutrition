// components/ImageView.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import type { internalGroqTypeReferenceTo, SanityImageCrop, SanityImageHotspot } from "@/sanity.types";

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
}

const ImageView = ({ images = [], productName }: ImageViewProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: '0% 0%' });

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  return (
    <div className="w-full md:w-1/2 space-y-4">
      <div 
        className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => !isMobile && setZoomStyle({ backgroundPosition: '0% 0%' })}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            {/* Main Image */}
            <Image
              src={urlFor(images[selectedImage]).width(800).format('webp').url()}
              alt={productName?.toLowerCase() || 'Product Image'}
              fill
              className="object-contain"
              quality={95}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Zoom Overlay (Desktop only) */}
            {!isMobile && (
              <div 
                className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundImage: `url(${urlFor(images[selectedImage]).width(1200).format('webp').url()})`,
                  ...zoomStyle,
                  backgroundSize: '150%',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 10,
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Zoom Indicator (Desktop only) */}
        {!isMobile && (
          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <span>Survoler pour zoomer</span>
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={image._key}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index ? 'border-primary' : 'border-transparent'
            }`}
          >
            <Image
              src={urlFor(image).width(200).format('webp').url()}
              alt=""
              fill
              className="object-cover"
              loading="lazy"
              quality={70}
              sizes="(max-width: 768px) 20vw, 8vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;