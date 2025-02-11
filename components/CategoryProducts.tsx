/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CategoryProducts.tsx
"use client";
import { Brand, Category, Produit } from '@/sanity.types';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Loader2, X } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CategoryProductsProps {
  categories: Category[];
  brands: Brand[];
  slug: string;
}

const CategoryProducts = ({ categories, brands, slug }: CategoryProductsProps) => {
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([slug]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sort, setSort] = useState('nom-asc');
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when modal is open
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

  const filteredCategories = categories.filter(c => 
    c.title?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredBrands = brands.filter(b => 
    b.title?.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [sortField, sortDir] = sort.split('-');
      
      let query = `*[_type == "produit"`;
      const params: Record<string, any> = {};

      if (selectedCategories.length > 0) {
        query += ` && references(*[_type == "category" && slug.current in $categories]._id)`;
        params.categories = selectedCategories;
      }

      if (selectedBrands.length > 0) {
        query += ` && references(*[_type == "brand" && slug.current in $brands]._id)`;
        params.brands = selectedBrands;
      }

      query += `] | order(${sortField} ${sortDir})`;
      
      const data = await client.fetch(query, params);
      setProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedBrands, sort]);

  const toggleCategory = (slug: string) => 
    setSelectedCategories(prev => prev.includes(slug) 
      ? prev.filter(s => s !== slug) 
      : [...prev, slug]
    );

  const toggleBrand = (slug: string) => 
    setSelectedBrands(prev => prev.includes(slug) 
      ? prev.filter(s => s !== slug) 
      : [...prev, slug]
    );

  return (
    <Suspense fallback={<Loader2 />}>
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {/* Desktop Filters */}
      <div className="hidden md:block w-64">
        <Accordion type="multiple" defaultValue={['categories', 'brands']}>
          <AccordionItem value="categories">
            <AccordionTrigger className="text-lg text-[#DA1D3C] uppercase">
              Catégories
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-2 space-y-4">
                <Input
                  placeholder="Rechercher"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="mb-3"
                />
                <div className="h-64 overflow-y-auto space-y-2">
                  {filteredCategories.map(c => (
                    <label key={c._id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c.slug?.current || '')}
                        onChange={() => toggleCategory(c.slug?.current || '')}
                        className="h-4 w-4 text-[#DA1D3C] border-gray-300 rounded focus:ring-[#DA1D3C]/50"
                      />
                      <span className="text-sm text-gray-800">{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brands">
            <AccordionTrigger className="text-lg text-[#DA1D3C] uppercase">
              Marques
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-2 space-y-4">
                <Input
                  placeholder="Rechercher"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="mb-3"
                />
                <div className="h-64 overflow-y-auto space-y-2">
                  {filteredBrands.map(b => (
                    <label key={b._id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.slug?.current || '')}
                        onChange={() => toggleBrand(b.slug?.current || '')}
                        className="h-4 w-4 text-[#DA1D3C] border-gray-300 rounded focus:ring-[#DA1D3C]/50"
                      />
                      <span className="text-sm text-gray-800">{b.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Mobile Filters */}
      <button
        className="md:hidden px-4 py-2 bg-[#DA1D3C] text-white rounded-lg flex items-center gap-2"
        onClick={() => setIsMobileOpen(true)}
      >
        <Filter className="w-4 h-4" />
        Filtres
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-white z-50 p-4 shadow-xl"
            ref={modalRef}
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#0F2E4E]">Filtres</h2>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="text-gray-500 hover:text-[#DA1D3C]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-6 h-[calc(100vh-120px)] overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0F2E4E]">Catégories</h3>
                <Input
                  placeholder="Rechercher"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                <div className="h-48 overflow-y-auto space-y-2">
                  {filteredCategories.map(c => (
                    <label key={c._id} className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c.slug?.current || '')}
                        onChange={() => toggleCategory(c.slug?.current || '')}
                        className="h-5 w-5 text-[#DA1D3C] border-gray-300 rounded focus:ring-[#DA1D3C]/50"
                      />
                      <span className="text-base text-gray-800">{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0F2E4E]">Marques</h3>
                <Input
                  placeholder="Rechercher"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                />
                <div className="h-48 overflow-y-auto space-y-2">
                  {filteredBrands.map(b => (
                    <label key={b._id} className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.slug?.current || '')}
                        onChange={() => toggleBrand(b.slug?.current || '')}
                        className="h-5 w-5 text-[#DA1D3C] border-gray-300 rounded focus:ring-[#DA1D3C]/50"
                      />
                      <span className="text-base text-gray-800">{b.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategories.map(slug => {
            const category = categories.find(c => c.slug?.current === slug);
            return (
              <div key={slug} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm text-[#0F2E4E]">{category?.title}</span>
                <button 
                  onClick={() => toggleCategory(slug)}
                  className="text-gray-500 hover:text-[#DA1D3C]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {selectedBrands.map(slug => {
            const brand = brands.find(b => b.slug?.current === slug);
            return (
              <div key={slug} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm text-[#0F2E4E]">{brand?.title}</span>
                <button 
                  onClick={() => toggleBrand(slug)}
                  className="text-gray-500 hover:text-[#DA1D3C]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Sorting and Results */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-lg font-medium text-[#0F2E4E]">
            {products.length} {products.length === 1 ? 'résultat' : 'résultats'}
          </h2>
          
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 hover:bg-gray-50 rounded-lg">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 shadow-lg">
            <SelectItem value="_createdAt-desc">Récent (A-Z)</SelectItem>
              <SelectItem value="nom-asc">Nom (A-Z)</SelectItem>
              <SelectItem value="nom-desc">Nom (Z-A)</SelectItem>
              <SelectItem value="prix-asc">Prix croissant</SelectItem>
              <SelectItem value="prix-desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {products.map(product => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProducts selectedTab={''} />
        )}
      </div>
    </div>
    </Suspense>
  );
};

export default CategoryProducts;