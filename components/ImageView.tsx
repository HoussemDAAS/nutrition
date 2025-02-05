// components/ImageView.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
}

const ImageView = ({ images = [], productName }: ImageViewProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: '0% 0%' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isMobile) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => Math.min(Math.max(1, prev * delta), 3));
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const toggleFullscreen = () => {
    if (isMobile) setIsFullscreen(!isFullscreen);
  };

  if (!isClient) return null;

  return (
    <div className="w-full md:w-1/2 space-y-4">
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent 
          className="max-w-none w-full h-full p-0 bg-black/90 [&_[data-radix-popper-content-wrapper]]:overflow-visible"
          onInteractOutside={resetZoom}
        >
          <VisuallyHidden>
            <DialogTitle>Fullscreen View - {productName}</DialogTitle>
          </VisuallyHidden>
          <div 
            className="relative w-full h-full flex items-center justify-center touch-pan-x touch-pan-y"
            onWheel={handleWheel}
          >
            <div 
              className="relative w-full h-full group"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              <Image
                src={urlFor(images[selectedImage]).width(1200).url()}
                alt={productName}
                fill
                className="object-contain p-4 cursor-zoom-out"
                quality={100}
                onClick={resetZoom}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main image display */}
      <div 
        className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => !isMobile && setZoomStyle({ backgroundPosition: '0% 0%' })}
        onClick={toggleFullscreen}
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
            <Image
              src={urlFor(images[selectedImage]).width(800).url()}
              alt={productName}
              fill
              className="object-contain"
              quality={95}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!isMobile && (
              <div 
                className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundImage: `url(${urlFor(images[selectedImage]).width(1200).url()})`,
                  ...zoomStyle,
                  backgroundSize: '150%',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 10,
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {!isMobile && (
          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full text-sm">
            Survoler pour zoomer
          </div>
        )}
      </div>

      {/* Thumbnails */}
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
              src={urlFor(image).width(200).url()}
              alt=""
              fill
              className="object-cover"
              loading="lazy"
              quality={70}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;