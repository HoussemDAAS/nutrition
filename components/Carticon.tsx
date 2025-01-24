"use client";
import useCartStore from '@/store'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Carticon = () => {
  const {items} = useCartStore();  
  return (
    <Link href={'/cart'}className='group relative'>
      <ShoppingBag className='h-5 w-5 group-hover:text-darkColor hoverEffect'/>
      <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-darkColor text-xs text-white font-semibold'>{items.length ? items.length : 0}</span>
    </Link>
  )
}

export default Carticon
