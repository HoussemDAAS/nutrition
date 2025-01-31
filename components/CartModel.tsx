/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useRef, useEffect } from "react";
import useCartStore from "@/store";
import Image from "next/image";
import PriceFormater from "./PriceFormater";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
};

interface CartModelProps {
  onClose: () => void;
}

const CartModel = ({ onClose }: CartModelProps) => {
  const { getTotalPrice, getGroupedItems, getItemCount, DeleteItem } = useCartStore();
  const cartProducts = getGroupedItems();
  const mobileCartRef = useRef<HTMLDivElement>(null);
  const desktopCartRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside both carts
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const isOutsideMobile = mobileCartRef.current && 
        !mobileCartRef.current.contains(e.target as Node);
      const isOutsideDesktop = desktopCartRef.current && 
        !desktopCartRef.current.contains(e.target as Node);
      
      if (isOutsideMobile && isOutsideDesktop) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <>
      {/* Mobile Cart */}
      <div
        ref={mobileCartRef}
        className="fixed inset-y-0 right-0 z-50 bg-white shadow-xl md:hidden w-[85vw] max-w-sm"
      >
        <div className="h-full flex flex-col p-4 border-l border-gray-200">
          <div className="flex justify-between items-center pb-3 mb-3 border-b">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {cartProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <X className="w-10 h-10 mb-2" />
              <p>Panier vide</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cartProducts.map(({ product }, index) => {
                  const itemCount = getItemCount(product?._id);
                  return (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={product?.images?.[0] ? urlFor(product.images[0]).url() : ""}
                          alt={product?.nom || "Product Image"}
                          fill
                          className="object-cover rounded-md"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{product.nom}</h3>
                        <div className="text-sm text-gray-500 mb-1">In Stock</div>
                        <div className="flex justify-between items-center">
                          <PriceFormater
                            amount={(product?.prix || 0) * itemCount}
                            className="text-base font-medium"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                              x{itemCount}
                            </span>
                            <button
                              className="text-red-500 hover:text-red-600 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                DeleteItem(product?._id);
                                toast.success(`${product?.nom?.substring(0, 15)}... removed`);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <PriceFormater
                    amount={getTotalPrice()}
                    className="text-lg font-bold"
                  />
                </div>
                <div className="grid gap-2">
                  <Link href="/cart" onClick={onClose}>
                    <Button className="w-full" variant="outline">
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={onClose}>
                    <Button className="w-full bg-AccentColor hover:bg-AccentColor/90">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Cart */}
      <div
        ref={desktopCartRef}
        className="absolute top-14 right-0 bg-white rounded-lg shadow-xl border w-96 hidden md:block z-30"
      >
        <div className="p-4 max-h-[70vh] flex flex-col">
          {/* Similar content structure as mobile */}
          {/* ... */}
        </div>
      </div>
    </>
  );
};

export default CartModel;