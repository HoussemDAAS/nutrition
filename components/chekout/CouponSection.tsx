"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CouponSectionProps {
  coupon: string;
  onChange: (value: string) => void;
  onApply: () => void;
}

export const CouponSection = ({ 
  coupon, 
  onChange, 
  onApply 
}: CouponSectionProps) => (
  <Accordion type="single" collapsible>
    <AccordionItem value="coupon">
      <AccordionTrigger className="text-AccentColor hover:no-underline py-2 text-sm md:text-base">
        Ajouter un code promo
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="flex gap-2">
          <Input
            placeholder="Entrez votre code promo"
            value={coupon}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 focus:ring-2 focus:ring-AccentColor text-sm"
          />
          <Button onClick={onApply} className="bg-AccentColor hover:bg-AccentColor/90 text-sm">
            Appliquer
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);