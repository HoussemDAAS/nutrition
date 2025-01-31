/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Brand, Produit } from '@/sanity.types';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, X } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BrandsProductsProps {
  brands: Brand[];
  slug: string; 
}

const BrandProducts = ({ brands, slug }: BrandsProductsProps) => {
  const [currentslug, setCurrentSlug] = React.useState(slug);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredBrands, setFilteredBrands] = React.useState<Brand[]>(brands);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Produit[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([slug]);
  const [selectedSort, setSelectedSort] = React.useState('nom-asc');

  const fetchProducts = async (brandSlugs: string[]) => {
    try {
      setIsLoading(true);
  
      if (brandSlugs.length === 0) {
        setProducts([]);
        return;
      }

      const [sortField, sortDirection] = selectedSort.split('-');
      const query = `*[_type == 'produit' && 
        ${brandSlugs
          .map((slug, index) => 
            `references(*[_type == 'brand' && slug.current == $slug${index}]._id)`
          ).join(" && ")}
      ] | order(${sortField} ${sortDirection})`;

      const params = brandSlugs.reduce<Record<string, string>>((acc, slug, index) => {
        acc[`slug${index}`] = slug;
        return acc;
      }, {});

      const data = await client.fetch(query, params);
      setProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    setFilteredBrands(
      brands.filter((brand) =>
        brand?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    fetchProducts(selectedBrands);
  }, [searchTerm, brands, selectedBrands, selectedSort]);

  const handleBrandSelection = (brandSlug: string) => {
    setSelectedBrands((prev) => 
      prev.includes(brandSlug) 
        ? prev.filter(s => s !== brandSlug) 
        : [...prev, brandSlug]
    );
  };

  React.useEffect(() => {
    if (selectedBrands.length === 0) {
      setSelectedBrands([slug]);
    }
  }, [selectedBrands, slug]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {/* Sidebar Section */}
      <div className="flex flex-col md:min-w-78">
        {/* Desktop Filters */}
        <div className="hidden md:block w-64">
          <Accordion type="single" collapsible={false} defaultValue="brands">
            <AccordionItem value="brands">
              <AccordionTrigger className="text-left text-lg text-AccentColor tracking-wide uppercase">
                Marques
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2">
                  <Input
                    placeholder="Recherche"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3 w-full"
                  />
                  <div className="h-[calc(100vh-250px)]">
                    {filteredBrands.map((brand) => (
                      <label key={brand._id} className="flex items-center space-x-2 py-1.5">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                          checked={selectedBrands.includes(brand.slug?.current || '')}
                          onChange={() => handleBrandSelection(brand.slug?.current || '')}
                        />
                        <span className="text-sm text-gray-800">{brand.title || "Marque inconnue"}</span>
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
          className="md:hidden px-4 py-2 bg-AccentColor text-white rounded-lg flex items-center gap-2"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <X className="w-4 h-4" />
          Filtres
        </button>

        {isMobileFilterOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-50 shadow-lg"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold">Filtres</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <Input
                placeholder="Recherche"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3 w-full"
              />
              <div className="max-h-64 overflow-y-auto">
                {filteredBrands.map((brand) => (
                  <label key={brand._id} className="flex items-center space-x-2 py-1.5">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                      checked={selectedBrands.includes(brand.slug?.current || '')}
                      onChange={() => handleBrandSelection(brand.slug?.current || '')}
                    />
                    <span className="text-sm text-gray-800">{brand.title || "Marque inconnue"}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-gray-300 self-stretch"></div>

      {/* Products Section */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-lg font-medium text-gray-700">
            {products.length} {products.length === 1 ? 'résultat' : 'résultats'}
          </h2>
          
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 hover:bg-gray-50 rounded-lg focus:ring-2 focus:ring-AccentColor/50">
              <SelectValue placeholder={<span className="text-gray-500">Trier par</span>} />
            </SelectTrigger>
            <SelectContent className="border-gray-200 shadow-md rounded-lg">
              <SelectItem value="nom-asc" className="text-sm hover:bg-gray-50">
                Nom (A-Z)
              </SelectItem>
              <SelectItem value="nom-desc" className="text-sm hover:bg-gray-50">
                Nom (Z-A)
              </SelectItem>
              <SelectItem value="prix-asc" className="text-sm hover:bg-gray-50">
                Prix ↑
              </SelectItem>
              <SelectItem value="prix-desc" className="text-sm hover:bg-gray-50">
                Prix ↓
              </SelectItem>
              <SelectItem value="_createdAt-asc" className="text-sm hover:bg-gray-50">
                Récent
              </SelectItem>
              <SelectItem value="_createdAt-desc" className="text-sm hover:bg-gray-50">
                Ancien
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
            <motion.div
              className="flex items-center space-x-2 text-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-semibold">Chargement...</span>
            </motion.div>
          </div>
        ) : (
          <>
            {products?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full">
                {products.map((product: Produit) => (
                  <AnimatePresence key={product._id}>
                    <motion.div layout initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>
            ) : (
              <NoProducts selectedTab={currentslug} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrandProducts;