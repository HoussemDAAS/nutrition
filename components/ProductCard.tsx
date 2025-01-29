import { Produit } from '@/sanity.types';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import PriceView from './PriceView';
import AddToCardButton from './AddToCardButton';
import { urlFor } from '@/sanity/lib/image';

const ProductCard = ({ product, isNew = false }: { product: Produit, isNew?: boolean }) => {
  return (
    <div className='rounded-lg group text-sm overflow-hidden'>
      <div className='bg-gradient-to-t from-zinc-100 via-zinc-200 to-zinc-100 overflow-hidden relative'>
        {product?.images && (
          <Link href={`/product/${product?.slug?.current || ''}`}>
            <div className="relative w-full h-[300px]">
              <Image
                src={urlFor(product?.images[0]).url()}
                alt={product?.nom || 'Product Image'}
                width={500}
                height={500}
                priority
                className={`w-full h-full object-contain transition-all duration-500 ${product?.images[1] ? 'hover:opacity-0' : 'group-hover:scale-95'}`}
              />
              {product?.images[1] && (
                <Image
                  src={urlFor(product?.images[1]).url()}
                  alt={product?.nom || 'Product Image'}
                  width={500}
                  height={500}
                  priority
                  className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-all duration-500 hover:opacity-100"
                />
              )}
            </div>
          </Link>
        )}
        <div className='absolute top-2 left-2 flex space-x-2'>
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
        {(product?.remise ?? 0) > 0 && (
          <div className="absolute top-2 right-2 bg-AccentColor text-white text-xs font-bold px-2 py-1 rounded">
            -{product.remise || 0}%
          </div>
        )}
      </div>
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
