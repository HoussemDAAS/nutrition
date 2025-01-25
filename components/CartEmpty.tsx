/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const CartEmpty = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component renders only after mounting on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering until the client has mounted
  }

  return (
    <div className="py-10 md:py-20 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full flex items-center justify-center flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-48 h-48 mx-auto relative"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <img
            src="/shopping.png"
            alt="Empty cart"

            className="drop-shadow-lg object-contain"
          />
          <motion.div className="absolute -top-1 -right-1 bg-AccentColor rounded-full p-2"
          animate={{ x: [0, -10, 10, 0], y: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
            <ShoppingCart size={24} className="text-white" />
          </motion.div>
        </motion.div>
        <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-AccentColor text-center mt-4">
                Votre panier est vide
            </h2>
            <p className="text-gray-500 text-center mt-2">
                Vous n&apos;avez pas encore ajouté de produits à votre panier
            </p>
        </div>
        <Link href={"/"}
        className="block bg-darkColor/5 border border-darkColor/20
        text-center py-2.5 rounded-full text-sm font-semibold
        tracking-wide hover:border-darkColor hover:bg-darkColor
        hover:text-white hoverEffect w-full mt-4">
         Découvrir nos produits
        </Link>
      </motion.div>

    </div>
  );
};

export default CartEmpty;
