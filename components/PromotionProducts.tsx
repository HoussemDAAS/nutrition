// components/PromotionProducts.tsx
"use client";
import { Produit, Category } from '@/sanity.types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Clock, Zap } from 'lucide-react';
import ProductCard from './ProductCard';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import PriceFormater from './PriceFormater';

interface PromotionProductsProps {
  products: Produit[];
  categories: Category[];
}

const PromotionProducts = ({ products: initialProducts, categories }: PromotionProductsProps) => {
  const [selectedSort, setSelectedSort] = useState('prix-asc');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('24:59:59');
  const modalRef = useRef<HTMLDivElement>(null);

  // Filtered categories with search
  const filteredCategories = useMemo(() => 
    categories.filter(c => 
      c.title?.toLowerCase().includes(categorySearch.toLowerCase())
    ), 
    [categories, categorySearch]
  );

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const [sortField, sortDirection] = selectedSort.split('-');
    
    return initialProducts
      .filter(product => 
        selectedCategories.length === 0 ||
        product.categorie?.some(cat => 
          selectedCategories.includes(cat._ref)
        )
      )
      .sort((a, b) => {
        const aValue = a[sortField as keyof Produit] || '';
        const bValue = b[sortField as keyof Produit] || '';
        
        if (sortField === 'prix') {
          return sortDirection === 'asc' 
            ? Number(aValue) - Number(bValue) 
            : Number(bValue) - Number(aValue);
        }
        return sortDirection === 'asc' 
          ? String(aValue).localeCompare(String(bValue)) 
          : String(bValue).localeCompare(String(aValue));
      });
  }, [initialProducts, selectedSort, selectedCategories]);

  // Countdown timer
  useEffect(() => {
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

  // Mobile filter handling
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileOpen]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

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
              <span className="font-medium">{filteredProducts.length} produits en promotion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4 w-full">
          <button
            className="md:hidden px-4 py-2 bg-[#DA1D3C] text-white rounded-lg flex items-center gap-2"
            onClick={() => setIsMobileOpen(true)}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
          
          <div className="flex flex-wrap gap-2 flex-1">
            {selectedCategories.map(categoryId => {
              const category = categories.find(c => c._id === categoryId);
              return (
                <div key={categoryId} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="text-sm text-[#0F2E4E]">{category?.title}</span>
                  <button 
                    onClick={() => toggleCategory(categoryId)}
                    className="text-gray-500 hover:text-[#DA1D3C]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 hover:bg-gray-50 rounded-lg">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent className="border-gray-200 shadow-lg">
            <SelectItem value="_createdAt-desc">Récent (A-Z)</SelectItem>
            <SelectItem value="prix-asc">Prix croissant</SelectItem>
            <SelectItem value="prix-desc">Prix décroissant</SelectItem>
            <SelectItem value="nom-asc">Nom (A-Z)</SelectItem>
            <SelectItem value="nom-desc">Nom (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-white z-50 p-4 shadow-xl"
            ref={modalRef}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-[#0F2E4E]">Filtres</h2>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="text-gray-500 hover:text-[#DA1D3C]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0F2E4E]">Catégories</h3>
                <Input
                  placeholder="Rechercher"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                <div className="h-64 overflow-y-auto space-y-2">
                  {filteredCategories.map(category => (
                    <label key={category._id} className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => toggleCategory(category._id)}
                        className="h-5 w-5 text-[#DA1D3C] border-gray-300 rounded focus:ring-[#DA1D3C]/50"
                      />
                      <span className="text-base text-gray-800">{category.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <div className="hidden md:block w-full mb-8">
        <Accordion type="multiple" defaultValue={['categories']}>
          <AccordionItem value="categories">
            <AccordionTrigger className="text-lg text-[#DA1D3C] uppercase">
              Filtrer par catégorie
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-2 space-y-4">
                <Input
                  placeholder="Rechercher des catégories"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="mb-3"
                />
                <div className="h-64 overflow-y-auto space-y-2">
                  {filteredCategories.map(category => (
                    <label key={category._id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => toggleCategory(category._id)}
                        className="h-4 w-4 text-[#DA1D3C] border-gray-300 rounded focus:ring-[#DA1D3C]/50"
                      />
                      <span className="text-sm text-gray-800">{category.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Products Grid */}
      
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <AnimatePresence>
    {filteredProducts.length === 0 ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-full py-12 text-center space-y-6"
      >
        <div className="max-w-md mx-auto">
          <svg
            className="w-24 h-24 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Aucune promotion disponible
          </h3>
          <p className="mt-2 text-gray-500">
            Aucun produit ne correspond à vos filtres actuels. Essayez de modifier vos sélections.
          </p>
        </div>
      </motion.div>
    ) : (
      filteredProducts.map((product: Produit) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          layout
        >
          <ProductCard product={product} />
          {product.remise && (
            <div className="mt-2 text-center">
              <span className="text-red-600 font-bold text-lg">
                <PriceFormater amount={product.prix} />
              </span>
              <span className="ml-2 text-sm text-gray-500">
                Économisez <PriceFormater amount={product.remise} />
              </span>
            </div>
          )}
        </motion.div>
      ))
    )}
  </AnimatePresence>
</div>

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