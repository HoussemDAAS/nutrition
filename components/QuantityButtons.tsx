import { Produit } from '@/sanity.types'
import React from 'react'
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
interface QuantityButtonsProps {
     product:Produit ;
 className?:string;
 borderStyle?:string;
    }
const QuantityButtons = ({product,className,borderStyle}:QuantityButtonsProps) => {
    const itemCount = 4;
  return (
    <div className={cn('flex items-center gap-2 text-base pb-1',className)}>
      <Button  variant="outline" size='icon' className='w-6 h-6'><Minus className={borderStyle} /></Button>
      <span className='font-semibold w-8 text-center text-darkColor'>{itemCount}</span>
      <Button variant="outline" size='icon' className='w-6 h-6'><Plus className={borderStyle} /></Button>
    </div>
  )
}

export default QuantityButtons
