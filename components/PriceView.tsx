// PriceView.tsx
import React from 'react'
import PriceFormater from './PriceFormater';
import { cn } from '@/lib/utils';

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  if (!price) return null;

  const originalPrice = discount ? price / (1 - discount / 100) : null;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <PriceFormater 
          amount={price} 
          className={cn('text-xl font-bold', {
            'text-SecondaryColor': discount
          })}
        />
        {discount && (
          <span className="bg-[#DA1D3C]/10 text-[#DA1D3C] px-2 py-1 rounded-md text-sm">
            -{discount}%
          </span>
        )}
      </div>
      
      {originalPrice && (
        <PriceFormater 
          amount={originalPrice}
          className="text-sm text-zinc-400 line-through"
        />
      )}
    </div>
  )
}

export default PriceView