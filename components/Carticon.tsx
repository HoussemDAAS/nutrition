"use client"
import dynamic from "next/dynamic";
import useCartStore from "@/store";
import { useEffect, useState } from "react";

const CartModel = dynamic(() => import("./CartModel"), { ssr: false });

const CartIcon = () => {
  const { items, isCartOpen, openCart, closeCart } = useCartStore();
  const [animatePulse, setAnimatePulse] = useState(false);
  const color = isCartOpen ? "#0F2E4E" : "#1f8bd8"; // More vibrant blue shades
  const hasItems = items.length > 0;

  // Trigger pulse animation when items change
  useEffect(() => {
    if (!hasItems) return;
    setAnimatePulse(true);
    const timer = setTimeout(() => setAnimatePulse(false), 500);
    return () => clearTimeout(timer);
  }, [items.length]);

  return (
    <div className="relative">
      <button
        onClick={isCartOpen ? closeCart : openCart}
        aria-label="Shopping cart"
        className={`relative p-2 transition-all duration-300 hover:scale-110 ${
          animatePulse ? "animate-pulse" : ""
        }`}
      >
        <div className="relative">
          <svg
            width="40"
            height="40"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            {/* Shopping cart icon */}
            <path
              d="M5 7.5H27.5L25 22H7L5 7.5Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="fill-current/10" // Subtle background fill
            />
            {/* Wheel */}
            <circle cx="9.5" cy="25.5" r="2" fill={color} />
            <circle cx="22.5" cy="25.5" r="2" fill={color} />
            {/* Handle */}
            <path
              d="M11 10V6.5C11 5.11929 12.1193 4 13.5 4H18.5C19.8807 4 21 5.11929 21 6.5V10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Item count badge */}
          {hasItems && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm">
              {items.length}
            </div>
          )}
        </div>
      </button>

      {isCartOpen && <CartModel onClose={closeCart} />}
    </div>
  );
};

export default CartIcon;