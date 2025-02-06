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
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: "0% 0%" });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // New state: zoom factor (1 = normal, 2 = zoomed in)
  const [zoom, setZoom] = useState(1);

  // Detect mobile devices
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const toggleFullscreen = () => {
    if (isMobile) {
      setIsFullscreen(!isFullscreen);
      setZoom(1);
    }
  };

  if (!isClient) return null;
  return (
    <div className="w-full md:w-1/2 space-y-4">
      <Dialog
        open={isFullscreen}
        onOpenChange={(open) => {
          setIsFullscreen(open);
          if (!open) setZoom(1); // Reset zoom on dialog close
        }}
      >
        <DialogContent className="max-w-none w-full h-full p-0 bg-gray-700/50">
          <VisuallyHidden>
            <DialogTitle>Fullscreen View - {productName}</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Motion container for zoom and pan */}
            <motion.div
              drag={zoom !== 1} // Enable drag only when zoomed in
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              onDoubleClick={() => setZoom(zoom === 1 ? 2 : 1)}
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full h-full flex items-center justify-center cursor-zoom-in select-none"
            >
              <Image
                src={urlFor(images[selectedImage]).width(1200).format("webp").url()}
                alt={productName?.toLowerCase() || "Product Image"}
                fill
                className="object-contain p-4"
                quality={100}
                onClick={toggleFullscreen}
              />
            </motion.div>
            {zoom === 1 && (  // Optionally hide this message when zoomed in
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            double click pour zoomer
          </div>
        )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Standard view with hover-zoom overlay (desktop only) */}
      <div
        className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => !isMobile && setZoomStyle({ backgroundPosition: "0% 0%" })}
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
              src={urlFor(images[selectedImage]).width(800).format("webp").url()}
              alt={productName?.toLowerCase() || "Product Image"}
              fill
              className="object-contain"
              quality={95}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Zoom overlay for desktop */}
            {!isMobile && (
              <div
                className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundImage: `url(${urlFor(images[selectedImage]).width(1200).format("webp").url()})`,
                  ...zoomStyle,
                  backgroundSize: "150%",
                  backgroundRepeat: "no-repeat",
                  zIndex: 10,
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {!isMobile && (
          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <span>Survoler pour zoomer</span>
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={image._key}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index ? "border-primary" : "border-transparent"
            }`}
          >
            <Image
              src={urlFor(image).width(200).format("webp").url()}
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
