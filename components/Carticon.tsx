// CartIcon.tsx
"use client";
import { useState } from 'react';
import useCartStore from '@/store';
import { ShoppingBag } from 'lucide-react';
import dynamic from 'next/dynamic';

const CartModel = dynamic(
  () => import('./CartModel'),
  { ssr: false }
);

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCartStore();

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="group relative cursor-pointer">
        <ShoppingBag className='h-5 w-5 group-hover:text-darkColor hoverEffect' />
        <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-darkColor text-xs text-white font-semibold'>
          {items.length || 0}
        </span>
      </div>

      {isOpen && <CartModel onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default CartIcon;