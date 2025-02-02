"use client";
import dynamic from "next/dynamic";
import useCartStore from "@/store";

const CartModel = dynamic(() => import("./CartModel"), { ssr: false });

const CartIcon = () => {
  const { items, isCartOpen, openCart, closeCart } = useCartStore();

  // Set default color to #DA1D3C, change to #0F2E4E when the cart is open (clicked/selected)
  const color = isCartOpen ? "#0F2E4E" : "#DA1D3C";

  return (
    <div className="relative">
      <div onClick={isCartOpen ? closeCart : openCart} className="cursor-pointer">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bag Body */}
          <path
            d="M4 10 H28 L26 28 H6 L4 10 Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bag Handle */}
          <path
            d="M10 10 V6 C10 4.89543 10.8954 4 12 4 H20 C21.1046 4 22 4.89543 22 6 V10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Centered Item Count */}
          <text
            x="16"
            y="19"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize="10"
            fontWeight="bold"
          >
            {items.length || 0}
          </text>
        </svg>
      </div>

      {isCartOpen && <CartModel onClose={closeCart} />}
    </div>
  );
};

export default CartIcon;
