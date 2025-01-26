import React from 'react'
import PriceFormater from './PriceFormater';
import { cn } from '@/lib/utils';
interface props{
    price:number | undefined;
    discount:number |undefined;
    className?:string;
}
const PriceView = ({price,discount,className}:props) => {
  return (
    <div className='flex justify-between items-start gap-3  '>
     <PriceFormater amount={price} className={className}/>
     {price && discount && 
     <PriceFormater amount={price + (price * discount / 100)} className={cn('line-through font-medium text-zinc-500',className)}/>}
    </div>
  )
}

export default PriceView
