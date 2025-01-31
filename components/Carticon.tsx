"use client";
import { ShoppingBag } from 'lucide-react';
import dynamic from 'next/dynamic';
import useCartStore from '@/store';

const CartModel = dynamic(
  () => import('./CartModel'),
  { ssr: false }
);

const CartIcon = () => {
  const { items, isCartOpen, openCart, closeCart } = useCartStore();

  return (
    <div className="relative">
      <div 
        onClick={isCartOpen ? closeCart : openCart} 
        className="group relative cursor-pointer"
      >
        <ShoppingBag className='h-5 w-5 group-hover:text-darkColor hoverEffect' />
        <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-darkColor text-xs text-white font-semibold'>
          {items.length || 0}
        </span>
      </div>

      {isCartOpen && <CartModel onClose={closeCart} />}
    </div>
  );
};

export default CartIcon;