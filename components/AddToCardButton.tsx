"use client";
import { Produit } from "@/sanity.types";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import QuantityButtons from "./QuantityButtons";
import PriceFormater from "./PriceFormater";
import useCartStore from "@/store";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface AddToCardButtonProps {
  product: Produit;
  className?: string;
}

const AddToCardButton = ({ product, className }: AddToCardButtonProps) => {
  const { addItem, getItemCount, openCart } = useCartStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const itemCount = getItemCount(product?._id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(
      `${product?.nom?.substring(0, 15)}... a été ajouté au panier`
    );
    setShowConfirmation(true);
  };
  useEffect(() => {
    if (itemCount === 0) {
      setShowConfirmation(false);
    }
  }, [itemCount]);
  return (
    <div className="w-full h-12 items-center">
      {itemCount ? (
        <div className="w-full text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quantité</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t border-t-gray-300 pt-1">
            <span className="text-xs font-semibold">Total: </span>
            <PriceFormater
              amount={product?.prix ? product?.prix * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <>
          <Button
            className={cn(
              "w-full bg-transparent text-darkColor shadow-none border border-darkColor/30 font-semibold tracking-wide hover:bg-darkColor hover:text-white flex items-center justify-center transition-transform duration-500 transform hover:scale-105",
              className
            )}
            onClick={handleAddToCart} // Use the handler function here
          >
            <div className="hidden md:block">
              <svg
                className="w-4 h-4 mr-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M10 21h4m-4-4h4"
                ></path>
              </svg>
            </div>
            Ajouter au panier
          </Button>
        
        </>
      )}
        {showConfirmation && (
            <ConfirmationDialog
              onClose={() => setShowConfirmation(false)}
              onViewCart={() => {
                setShowConfirmation(false);
                openCart();
              }}
            />
          )}
    </div>
  );
};
const ConfirmationDialog = ({
  onClose,
  onViewCart,
}: {
  onClose: () => void;
  onViewCart: () => void;
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <motion.div
      ref={dialogRef}
      className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 transition-all duration-300 origin-bottom text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="flex justify-center mb-4"
      >
        <CheckCircle className="w-12 h-12 text-green-500" />
      </motion.div>
      <h3 className="text-lg font-semibold mb-4">Article ajouté avec succès !</h3>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full sm:flex-1"
        >
          Poursuivre l&apos;achat
        </Button>
        <Button
          onClick={onViewCart}
          className="w-full sm:flex-1 bg-AccentColor hover:bg-AccentColor/90"
        >
          Voir le panier
        </Button>
      </div>
    </motion.div>
  </div>
  );
};

export default AddToCardButton;
