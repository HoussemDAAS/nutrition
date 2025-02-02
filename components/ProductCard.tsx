/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Produit } from '@/sanity.types';
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import PriceView from './PriceView';
import AddToCardButton from './AddToCardButton';
import { urlFor } from '@/sanity/lib/image';

const ProductCard = ({ product, isNew = false }: { product: Produit, isNew?: boolean }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

  // Optimize image URL with Sanity's built-in parameters
  const imageUrl = (image: any) => urlFor(image)
    .width(600)
    .height(600)
    .auto('format')
    .fit('max')
    .quality(85)
    .url();

  return (
    <div className='rounded-lg group text-sm overflow-hidden'>
      <div className='bg-gradient-to-t from-zinc-100 via-zinc-200 to-zinc-100 overflow-hidden relative'>
        {/* Skeleton loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
        )}

        {product?.images && (
          <Link href={`/product/${product?.slug?.current || ''}`}>
            <div className="relative w-full h-[300px]">
              {/* Main Image - Prioritized */}
              <Image
                src={imageUrl(product.images[0])}
                alt={product?.nom || 'Product Image'}
                width={600}
                height={600}
                priority
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  product?.images[1] ? 'group-hover:opacity-0' : 'group-hover:scale-95'
                } ${!mainImageLoaded ? 'opacity-0' : 'opacity-100'}`}
                onLoadingComplete={() => {
                  setMainImageLoaded(true);
                  setIsLoading(false);
                }}
                placeholder="blur"
                blurDataURL={urlFor(product.images[0]).width(40).quality(20).url()}
              />

              {/* Hover Image - Loaded in background */}
              {product?.images[1] && (
                <Image
                  src={imageUrl(product.images[1])}
                  alt={product?.nom || 'Product Image'}
                  width={600}
                  height={600}
                  className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  onLoadingComplete={() => setHoverImageLoaded(true)}
                  placeholder="blur"
                  blurDataURL={urlFor(product.images[1]).width(40).quality(20).url()}
                  loading="lazy"
                />
              )}
            </div>
          </Link>
        )}

        {/* Product Status Badges */}
        <div className='absolute top-2 left-2 flex space-x-2 z-20'>
          {isNew && product.Status === "Nouveau" && (
            <div className="animate-bounce bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              Nouveau
            </div>
          )}
          {product?.stock === 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              En rupture de stock
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {(product?.remise ?? 0) > 0 && (
          <div className="absolute top-2 right-2 bg-AccentColor text-white text-xs font-bold px-2 py-1 rounded z-20">
            -{product.remise || 0}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='py-2 px-2 flex flex-col gap-1.5 bg-zinc-50 border border-t-0 rounded-lg rounded-tr-none rounded-tl-none'>
        <h2 className='font-semibold line-clamp-1'>{product?.nom}</h2>
        <p className='line-clamp-1 text-sm text-gray-500'>{product?.intro}</p>
        <PriceView price={product?.prix} discount={product?.remise} className='text-sm' />
        <AddToCardButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;