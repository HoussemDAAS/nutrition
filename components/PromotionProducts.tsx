/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { Produit } from '@/sanity.types';
import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Clock, Zap } from 'lucide-react';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import PriceFormater from './PriceFormater';

interface PromotionProductsProps {
  products: Produit[];
}

const PromotionProducts = ({ products: initialProducts }: PromotionProductsProps) => {
  const [selectedSort, setSelectedSort] = React.useState('prix-asc');
  const [products, setProducts] = React.useState<Produit[]>(initialProducts);
  const [timeRemaining, setTimeRemaining] = React.useState('24:59:59');

  // Countdown timer effect (example)
  React.useEffect(() => {
    const timer = setInterval(() => {
      const endDate = new Date('2024-12-31T23:59:59');
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const sortProducts = () => {
      const [sortField, sortDirection] = selectedSort.split('-');
      return [...initialProducts].sort((a, b) => {
        // @ts-ignore
        const aValue = a[sortField] || '';
        // @ts-ignore
        const bValue = b[sortField] || '';
        
        if (sortField === 'prix') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return sortDirection === 'asc' 
          ? String(aValue).localeCompare(String(bValue)) 
          : String(bValue).localeCompare(String(aValue));
      });
    };

    setProducts(sortProducts());
  }, [selectedSort, initialProducts]);

  return (
    <div className="w-full">
      {/* Promotion Header */}
      <div className="bg-gradient-to-r from-AccentColor/10 to-red-100 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-AccentColor mb-2">Promotions</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Temps restant: {timeRemaining}</span>
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-red-500" />
              <span className="font-medium">{products.length} produits en promotion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sorting + Results */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-lg font-medium text-gray-700">
          {products.length} {products.length === 1 ? 'offre spéciale' : 'offres spéciales'}
        </h2>
        
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 hover:bg-gray-50 rounded-lg focus:ring-2 focus:ring-AccentColor/50">
            <SelectValue placeholder={<span className="text-gray-500">Trier par</span>} />
          </SelectTrigger>
          <SelectContent className="border-gray-200 shadow-md rounded-lg">
            <SelectItem value="prix-asc" className="text-sm hover:bg-gray-50">
              Prix croissant
            </SelectItem>
            <SelectItem value="prix-desc" className="text-sm hover:bg-gray-50">
              Prix décroissant
            </SelectItem>
            <SelectItem value="nom-asc" className="text-sm hover:bg-gray-50">
              Nom (A-Z)
            </SelectItem>
            <SelectItem value="nom-desc" className="text-sm hover:bg-gray-50">
              Nom (Z-A)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {products?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full">
          {products.map((product: Produit) => (
            <AnimatePresence key={product._id}>
              <motion.div 
                layout 
                initial={{ opacity: 0.2, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative group"
              >
                {/* Promotion Badge */}
                <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                  -{product.prix ? Math.round(((product.remise || 0) / product.prix) * 100) : 0}%
                </div>

                {/* Original Price */}
                {product.remise && (
                  <div className="absolute top-2 left-2 line-through text-gray-400 text-sm">
                    <PriceFormater amount={(product.prix ?? 0) + (product.remise ?? 0)} />
                  </div>
                )}

                <ProductCard product={product} />
                
                {/* Discount Price */}
                <div className="mt-2 text-center">
                  <span className="text-red-600 font-bold text-lg">
                    <PriceFormater amount={product.prix} />
                  </span>
                  {product.remise && (
                    <span className="ml-2 text-sm text-gray-500">
                      Économisez <PriceFormater amount={product.remise} />
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProducts selectedTab="promotions" />
      )}

      {/* Sales Progress Bar */}
      <div className="mt-12 bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Objectif de vente atteint</span>
          <span className="text-sm text-gray-600">75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-AccentColor h-2.5 rounded-full" 
            style={{ width: '75%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PromotionProducts;