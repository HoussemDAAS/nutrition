import { Produit } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import PriceView from './PriceView'
import AddToCardButton from './AddToCardButton'

const ProductCard = ({ product }: { product: Produit }) => {
  // Calculate discount percentage
 

  return (
    <div className='rounded-lg group text-sm overflow-hidden'>
      <div className='bg-gradient-to-t from-zinc-100 via-zinc-200 to-zinc-100 overflow-hidden relative'>
        {product?.images &&
          <Link href={`/product/${product?.slug?.current || ''}`}>
            <Image
              src={urlFor(product?.images[0]).url()}
              alt={product?.nom || 'Product Image'}
              width={500}
              height={500}
              priority
              className='w-full h-[300px] object-contain overflow-hidden transition-all duration-500 hoverEffect group-hover:scale-95'
            />
          </Link>}
        <div className='absolute top-0 right-2 z-50'/>
        {product?.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            En rupture de stock
          </div>
        )}
        {(product?.remise ?? 0) > 0 && (
          <div className="absolute top-2 left-2 bg-AccentColor text-white text-xs font-bold px-2 py-1 rounded">
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
  )
}

export default ProductCard
