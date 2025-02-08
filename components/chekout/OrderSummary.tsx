"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PriceFormater from "@/components/PriceFormater";
import { CartItem } from "@/store";

interface OrderSummaryProps {
  total: number;
  couponApplied: boolean;
  items: CartItem[];
  onSubmit: () => void;
  isValid: boolean;
}

export const OrderSummary = ({ 
  total, 
  couponApplied, 
  items, 
  onSubmit, 
  isValid 
}: OrderSummaryProps) => (
  <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
    <h2 className="text-lg md:text-xl font-semibold mb-3">Récapitulatif</h2>
    <div className="space-y-2">
      <div className="flex justify-between text-sm md:text-base">
        <span>Sous-total</span>
        <PriceFormater amount={total} />
      </div>
      {couponApplied && (
        <div className="flex justify-between text-green-600 text-sm md:text-base">
          <span>Réduction</span>
          <PriceFormater amount={total * 0.1} />
        </div>
      )}
      <Separator className="my-1 md:my-2" />
      <div className="flex justify-between font-bold text-base md:text-lg">
        <span>Total</span>
        <PriceFormater amount={couponApplied ? total * 0.9 : total} />
      </div>
      <Button
        type="button"
        disabled={items.length === 0 || !isValid}
        className="w-full mt-3 bg-AccentColor hover:bg-AccentColor/90 text-sm md:text-base"
        onClick={onSubmit}
      >
        Confirmer la commande
      </Button>
    </div>
  </div>
);