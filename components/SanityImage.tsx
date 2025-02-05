/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SanityImage.tsx
"use client";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function SanityImage({ value }: { value: any }) {
  const [aspectRatio, setAspectRatio] = useState(16/9);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    if (value?.asset?.metadata?.dimensions) {
      const { width, height } = value.asset.metadata.dimensions;
      setAspectRatio(width / height);
    }

    const handleGesture = (e: any) => {
      if (e.scale !== 1) {
        e.preventDefault();
        setScale(prev => Math.min(Math.max(1, prev * e.scale), 3));
      }
    };

    if (isMobile) {
      window.addEventListener('gesturechange', handleGesture);
    }
    return () => {
      if (isMobile) window.removeEventListener('gesturechange', handleGesture);
    };
  }, [value, isMobile]);

  const resetZoom = () => setScale(1);

  if (!value?.asset || !isClient) return null;

  return (
    <figure className="my-6 space-y-2">
      <div 
        className="relative rounded-lg overflow-hidden cursor-zoom-in w-full"
        style={{ aspectRatio, maxWidth: "min(100%, 800px)" }}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={urlFor(value).width(1440).url()}
          alt={value.alt || ""}
          fill
          className="object-contain"
          placeholder="blur"
          blurDataURL={value.asset.metadata?.lqip}
          sizes="(max-width: 640px) 100vw, 80vw"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-none w-full h-full p-0 bg-black/90 [&_[data-radix-popper-content-wrapper]]:overflow-visible"
          onInteractOutside={resetZoom}
        >
          <VisuallyHidden>
            <DialogTitle>{value.alt || "Image en grand format"}</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className="relative w-full h-full group"
              style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}
            >
              <Image
                src={urlFor(value).width(2000).url()}
                alt={value.alt || ""}
                fill
                className="object-contain p-4 cursor-zoom-out"
                onClick={resetZoom}
                priority
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(1);
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
    </figure>
  );
}