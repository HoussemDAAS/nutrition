/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SanityImage.tsx
"use client";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function SanityImage({ value }: { value: any }) {
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (value?.asset?.metadata?.dimensions) {
      const { width, height } = value.asset.metadata.dimensions;
      setAspectRatio(width / height);
    }
  }, [value]);

  if (!value?.asset || !isClient) return null;

  return (
    <figure className="my-6 space-y-2">
      <div 
        className="relative rounded-lg overflow-hidden cursor-zoom-in w-full"
        style={{ 
          aspectRatio,
          maxWidth: "min(100%, 800px)"
        }}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={urlFor(value)
            .width(1440)
            .height(Math.round(1440 / aspectRatio))
            .quality(95)
            .fit('max')
            .auto('format')
            .url()}
          alt={value.alt || "Image du produit"}
          fill
          className="object-contain"
          placeholder="blur"
          blurDataURL={value.asset.metadata?.lqip}
          sizes="(max-width: 640px) 100vw, 80vw"
          loading="lazy"
          decoding="async"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-none w-full h-full p-0 bg-black/90">
          <VisuallyHidden>
            <DialogTitle>Visualisation plein écran - {value.alt || "Image du produit"}</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={urlFor(value)
                .width(2000)
                .quality(100)
                .auto('format')
                .url()}
              alt={value.alt || "Image du produit en grand format"}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </figure>
  );
}