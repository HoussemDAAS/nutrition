import { Produit } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore from "@/store";
import toast from "react-hot-toast";
interface QuantityButtonsProps {
  product: Produit;
  className?: string;
  borderStyle?: string;
}
const QuantityButtons = ({
  product,
  className,
  borderStyle,
}: QuantityButtonsProps) => {
  const { addItem, getItemCount, removeItem } = useCartStore();
  const isOutOfStock = product?.stock === 0;
  const itemCount = getItemCount(product._id);
  const handleRemoveproduct = () => {
    removeItem(product._id);
    toast.error(`${product?.nom?.substring(0, 15)}... a été supprimé du panier`);
  };
  return (
    <div className={cn("flex items-center gap-2 text-base pb-1", className)}>
      <Button variant="outline" size="icon" className="w-6 h-6" onClick={handleRemoveproduct}
      disabled={itemCount === 0 || isOutOfStock}> 
        <Minus className={borderStyle} />
      </Button>
      <span className="font-semibold w-8 text-center text-darkColor">
        {itemCount}
      </span>
      <Button variant="outline" size="icon" className="w-6 h-6"
      onClick={() => {
        addItem(product);
        toast.success(
          `${product?.nom?.substring(0, 15)}... a été ajouté au panier`
        );
      }}>
        <Plus
          className={borderStyle}
          
        />
      </Button>
    </div>
  );
};

export default QuantityButtons;
