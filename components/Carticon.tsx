"use client";
import { useState } from 'react';
import useCartStore from '@/store';
import { ShoppingBag } from 'lucide-react';
import CartModel from './CartModel'; // Import CartModel

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the visibility of the CartModel
  const { items } = useCartStore();

  // Toggle the cart modal visibility
  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div onClick={toggleCart} className="group relative cursor-pointer">
        <ShoppingBag className='h-5 w-5 group-hover:text-darkColor hoverEffect' />
        <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-darkColor text-xs text-white font-semibold'>
          {items.length ? items.length : 0}
        </span>
      </div>

      {/* Conditionally render the CartModel */}
      {isOpen && <CartModel />}
    </div>
  );
};

export default CartIcon;
