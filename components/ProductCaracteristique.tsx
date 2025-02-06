import React from 'react'
import { Produit } from '@/sanity.types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const ProductCaracteristique = ({ product }: { product: Produit }) => {
  const hasBrand = product.brand && product.brand.length > 0
  const hasDiscount = product.remise && product.remise > 0
  const stockStatus = product.stock && product.stock > 0 
    ? `${product.stock} en stock` 
    : 'Hors stock'

  return (
    <Accordion type='single' collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Caractéristiques du produit
        </AccordionTrigger>
        <AccordionContent className='flex flex-col gap-2'>
          {hasBrand && (
            <p className='flex items-center justify-between'>
              Marque: 
              <span className='font-semibold tracking-wide'>
                {product.brand?.[0]?.name || 'Non spécifiée'}
              </span>
            </p>
          )}

          <p className='flex items-center justify-between'>
            Statut: 
            <span className='font-semibold tracking-wide'>
              {product.Status || 'Disponible'}
            </span>
          </p>

          {product.variantes && (
            <p className='flex items-center justify-between'>
              Type: 
              <span className='font-semibold tracking-wide'>
                {product.variantes}
              </span>
            </p>
          )}

          <p className='flex items-center justify-between'>
            Disponibilité: 
            <span className={`font-semibold tracking-wide ${
              product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stockStatus}
            </span>
          </p>

          {hasDiscount && (
            <p className='flex items-center justify-between'>
              Remise: 
              <span className='font-semibold tracking-wide text-red-600'>
                -{product.remise}%
              </span>
            </p>
          )}

        
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ProductCaracteristique