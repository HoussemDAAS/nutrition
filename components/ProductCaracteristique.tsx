import React from 'react'
import { Produit } from '@/sanity.types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
const ProductCaracteristique = ({product }: {product:Produit}) => {
  return (
   <Accordion type='single' collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>
        {product?.nom} : Caracteristiques
      </AccordionTrigger>
      <AccordionContent className='flex flex-col gap-2' >
        <p className='flex items-center justify-between'>Brand : <span className='font-semibold tracking-wide'>Pas spécifié</span></p>
        <p className='flex items-center justify-between'>Année sortie : <span className='font-semibold tracking-wide'>2025</span></p>
        <p className='flex items-center justify-between'>Type : <span className='font-semibold tracking-wide'>{product?.variantes}</span></p>
        <p className='flex items-center justify-between'>Stock : <span className='font-semibold tracking-wide'>{product?.stock ? 'Disponible' : 'Indisponible'}</span></p>
        <p className='flex items-center justify-between'>Intro : <span className='font-semibold tracking-wide'>{product?.variantes}</span></p>
      </AccordionContent>
    </AccordionItem>
   </Accordion>
  )
}

export default ProductCaracteristique
