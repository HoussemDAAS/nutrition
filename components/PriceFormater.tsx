// PriceFormater.tsx
import { cn } from '@/lib/utils';
import React from 'react'

const PriceFormater = ({ amount, className }: { 
  amount: number | undefined, 
  className?: string 
}) => {
  if (typeof amount === 'undefined') return null;
  
  const formatPrice = new Number(amount).toLocaleString('fr-FR', { 
    style: 'currency', 
    currency: 'TND',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <span className={cn('font-medium text-SecondaryColor', className)}>
      {formatPrice}
    </span>
  )
}

export default PriceFormater