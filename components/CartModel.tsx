"use client";

import React, {  useEffect, useState } from "react";
import useCartStore from "@/store";
import Image from "next/image";
import PriceFormater from "./PriceFormater";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const CartModel = () => {
  const {
    getTotalPrice,
    getGroupedItems,
    getItemCount,
    DeleteItem,
  } = useCartStore();

  const cartProducts = getGroupedItems();
  const [showCart, setShowCart] = useState(true);

  useEffect(() => {
    setShowCart(true);
  }, [cartProducts]);
  return (
    <>
      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white/80 shadow-xl transition-transform duration-500 ${showCart ? "translate-x-0" : "translate-x-full"} md:hidden`}
      >
        <motion.div className="bg-white w-72 h-full p-6 border-l border-gray-300 flex flex-col gap-4">
          {/* Close Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={() => setShowCart(false)}>
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          {!cartProducts.length ? (
            <div>
                
                Cart is empty</div>
          ) : (
            <div className="flex flex-col gap-4 overflow-y-auto flex-1">
              {cartProducts.map(({ product }, index) => {
                const itemCount = getItemCount(product?._id);

                return (
                  <div key={index} className="flex gap-3">
                    <Image
                      src={product?.images ? urlFor(product.images[0]).url() || "" : ""}
                      alt={product?.nom || "Product Image"}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                    <div className="flex flex-col w-full justify-between">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">{product.nom}</h3>
                        <PriceFormater
                          amount={(product?.prix as number) * itemCount}
                          className="font-medium text-base"
                        />
                      </div>
                      <div className="text-sm text-gray-500">available</div>
                      <div className="flex justify-between items-center text-sm">
                        <span>{itemCount}</span>
                        <button
                          className="text-red-500 hover:underline text-sm"
                          onClick={() => {
                            DeleteItem(product?._id);
                            toast.success(`${product?.nom?.substring(0, 15)}... removed`);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cart Footer */}
          <div className="mt-auto">
            <div className="flex items-center justify-between font-semibold text-sm">
              <span>Total</span>
              <PriceFormater
                amount={getTotalPrice()}
                className="text-base font-bold text-black"
              />
            </div>
            <div className="flex gap-3 mt-3">
              <Link href={"/cart"} className="w-full">
                <Button className="w-full">View Cart</Button>
              </Link>

              <Link href={"/checkout"} className="w-full">
                <Button className="w-full bg-AccentColor">Checkout</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Desktop Cart (fixed position) */}
      <div className="w-max absolute p-3 rounded-md shadow-lg bg-white top-12 right-0 flex flex-col gap-4 z-20 max-w-[85vw] sm:max-w-[350px] hidden md:block">
        {!cartProducts.length ? (
          <div className="text-center p-5">pas de produit</div>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <div className="flex flex-col gap-6 max-h-60 overflow-y-auto">
              {cartProducts.map(({ product }, index) => {
                const itemCount = getItemCount(product?._id);

                return (
                  <div key={index} className="flex gap-3">
                    <Image
                      src={product?.images ? urlFor(product.images[0]).url() || "" : ""}
                      alt={product?.nom || "Product Image"}
                      width={100}
                      height={100}
                      quality={90}
                      className="object-cover rounded-md"
                    />
                    <div className="flex flex-col justify-between w-full gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-sm font-semibold">{product.nom}</h3>
                        <div className="p-1 bg-gray-50 rounded-sm">
                          <PriceFormater
                            amount={(product?.prix as number) * itemCount}
                            className="font-medium text-base"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">available</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{itemCount}</span>
                        <button
                          className="text-red-500 hover:underline text-sm font-semibold"
                          onClick={() => {
                            DeleteItem(product?._id);
                            toast.success(`${product?.nom?.substring(0, 15)}... a été supprimé du panier`);
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="flex items-center justify-between font-semibold text-sm">
                <span>Total</span>
                <span>
                  <PriceFormater
                    amount={getTotalPrice()}
                    className="text-base font-bold text-black"
                  />
                </span>
              </div>
              <div className="flex justify-between text-sm gap-3 mt-3">
                <Link href={"/cart"} className="w-full">
                  <Button className="w-full">View Cart</Button>
                </Link>

                <Link href={"/checkout"} className="w-full">
                  <Button className="w-full bg-AccentColor">Checkout</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartModel;
