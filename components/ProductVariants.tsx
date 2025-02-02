// components/ProductVariants.tsx
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Variant {
  size: string;
  flavor: string;
  price: number;
  stock: number;
}

interface ProductVariantsProps {
  variants: Variant[];
  onVariantChange: (variant: Variant) => void;
}

const ProductVariants = ({ variants, onVariantChange }: ProductVariantsProps) => {
  const [selectedSize, setSelectedSize] = useState(variants[0]?.size);
  const [selectedFlavor, setSelectedFlavor] = useState(variants[0]?.flavor);

  const availableSizes = Array.from(new Set(variants.map(v => v.size)));
  const availableFlavors = Array.from(new Set(variants.map(v => v.flavor)));

  const currentVariant = variants.find(v => 
    v.size === selectedSize && v.flavor === selectedFlavor
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Conditionnement</h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map(size => (
            <Button
              key={size}
              variant={selectedSize === size ? 'default' : 'outline'}
              onClick={() => {
                setSelectedSize(size);
                const newVariant = variants.find(v => 
                  v.size === size && v.flavor === selectedFlavor
                );
                if (newVariant) onVariantChange(newVariant);
              }}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Goût</h3>
        <div className="flex flex-wrap gap-2">
          {availableFlavors.map(flavor => (
            <Button
              key={flavor}
              variant={selectedFlavor === flavor ? 'default' : 'outline'}
              onClick={() => {
                setSelectedFlavor(flavor);
                const newVariant = variants.find(v => 
                  v.size === selectedSize && v.flavor === flavor
                );
                if (newVariant) onVariantChange(newVariant);
              }}
            >
              {flavor}
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Stock disponible: {currentVariant?.stock ?? 0} unités
        </p>
      </div>
    </div>
  );
};

export default ProductVariants;