import { cn } from '@/lib/utils';
import React from 'react'

const PriceFormater = ({amount,className}:{amount:number | undefined,className?:string}) => {
    const formatPrice = new Number(amount).toLocaleString('fr-FR', { 
        style: 'currency', 
        currency: 'TND',
        minimumFractionDigits: 0
      });
      
  return (
    <span className={cn('md:text-sm font-semibold text-darkColor text-[10px] ',className)}>
      {formatPrice}
    </span>
  )
}

export default PriceFormater
