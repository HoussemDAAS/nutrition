
import { Produit } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast'
import QuantityButtons from "./QuantityButtons";
import PriceFormater from "./PriceFormater";
import useCartStore from "@/store";

interface AddToCardButtonProps {
  product: Produit;
  className?: string;
}
const AddToCardButton = ({ product, className }: AddToCardButtonProps) => {
  const { addItem, getItemCount } = useCartStore();

  const itemCount = getItemCount(product?._id);
  console.log(itemCount);
  return (
    <div className="w-full h-12 items-center">
      {itemCount ? (
        <div className="w-full text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quantité</span>
            <QuantityButtons product={product}/>
          </div>
          <div className="flex items-center justify-between border-t border-t-gray-300 pt-1">
            <span className="text-xs font-semibold">Total: </span>
            <PriceFormater amount={product?.prix ? product?.prix * itemCount : 0} />
          </div>
        </div>
      ) : (
        <Button
          className={cn(
            "w-full bg-transparent text-darkColor shadow-none border border-darkColor/30 font-semibold tracking-wide hover:bg-darkColor hover:text-white flex items-center justify-center transition-transform duration-500 transform hover:scale-105",
            className
          )}
          
          onClick={() => {
            addItem(product);
            toast.success(`${product?.nom?.substring(0, 15)}... a été ajouté au panier`);
          }}
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Ajouter au panier
        </Button>
      )}
    </div>
  );
};

export default AddToCardButton;
