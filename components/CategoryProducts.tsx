"use client";
import { Category, Produit } from '@/sanity.types';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'motion/react';
import { Filter, Loader2, X } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CategoryProductsProps {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: CategoryProductsProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>(categories);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Produit[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([slug]);
  const [selectedSort, setSelectedSort] = React.useState('nom-asc');

  const fetchProducts = async (categorySlugs: string[]) => {
    try {
      setIsLoading(true);
      
      const [sortField, sortDirection] = selectedSort.split('-');
      let query = `*[_type == 'produit']`;
      
      if (categorySlugs.length > 0) {
        query += `[${categorySlugs
          .map((slug, index) => 
            `references(*[_type == 'category' && slug.current == $slug${index}]._id)`
          ).join(" && ")}]`;
      }

      query += ` | order(${sortField} ${sortDirection})`;

      const params = categorySlugs.reduce<Record<string, string>>((acc, slug, index) => {
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
    setFilteredCategories(
      categories.filter(category =>
        category?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    fetchProducts(selectedCategories);
  }, [searchTerm, categories, selectedCategories, selectedSort]);

  const handleCategorySelection = (categorySlug: string) => {
    setSelectedCategories(prev => 
      prev.includes(categorySlug) 
        ? prev.filter(slug => slug !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const getCategoryTitle = (slug: string) => {
    return categories.find(c => c.slug?.current === slug)?.title || 'Unnamed Category';
  };

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {/* Filters Section */}
      <div className="flex flex-col md:min-w-78">
        <div className="hidden md:block w-64">
          <Accordion type="single" collapsible={false} defaultValue="categories">
            <AccordionItem value="categories">
              <AccordionTrigger className="text-left text-lg text-AccentColor tracking-wide uppercase">
                Catégories
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2">
                  {/* Filter Chips */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedCategories.map(slug => (
                        <div 
                          key={slug}
                          className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
                        >
                          <span>{getCategoryTitle(slug)}</span>
                          <button 
                            onClick={() => handleCategorySelection(slug)}
                            className="ml-1 text-gray-500 hover:text-AccentColor"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Input
                    placeholder="Recherche"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3 w-full"
                  />
                  <div className="h-[calc(100vh-250px)] overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <label key={category._id} className="flex items-center space-x-2 py-1.5 hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-AccentColor border-gray-300 rounded focus:ring-AccentColor/50"
                          checked={selectedCategories.includes(category.slug?.current || '')}
                          onChange={() => handleCategorySelection(category.slug?.current || '')}
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

        {/* Mobile Filters */}
        <button
          className="md:hidden px-4 py-2 bg-AccentColor text-white rounded-lg flex items-center gap-2"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <Filter className="w-4 h-4" />
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
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCategories.map(slug => (
                    <div 
                      key={slug}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{getCategoryTitle(slug)}</span>
                      <button 
                        onClick={() => handleCategorySelection(slug)}
                        className="ml-1 text-gray-500 hover:text-AccentColor"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <Input
                placeholder="Recherche"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3 w-full"
              />
              <div className="max-h-64 overflow-y-auto">
                {filteredCategories.map((category) => (
                  <label key={category._id} className="flex items-center space-x-2 py-1.5 hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-AccentColor border-gray-300 rounded focus:ring-AccentColor/50"
                      checked={selectedCategories.includes(category.slug?.current || '')}
                      onChange={() => handleCategorySelection(category.slug?.current || '')}
                    />
                    <span className="text-sm text-gray-800">{category.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Products Section */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-lg font-medium text-gray-700">
            {products.length} {products.length === 1 ? 'résultat' : 'résultats'}
          </h2>
          
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 hover:bg-gray-50 rounded-lg focus:ring-2 focus:ring-AccentColor/50">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 shadow-md rounded-lg">
              <SelectItem value="nom-asc">Nom (A-Z)</SelectItem>
              <SelectItem value="nom-desc">Nom (Z-A)</SelectItem>
              <SelectItem value="prix-asc">Prix ↑</SelectItem>
              <SelectItem value="prix-desc">Prix ↓</SelectItem>
              <SelectItem value="_createdAt-asc">Récent</SelectItem>
              <SelectItem value="_createdAt-desc">Ancien</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg">
            <motion.div
              className="flex items-center space-x-2 text-AccentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-semibold">Chargement...</span>
            </motion.div>
          </div>
        ) : products?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full">
            {products.map((product) => (
              <AnimatePresence key={product._id}>
                <motion.div layout initial={{ opacity: 0.2 }} animate={{ opacity: 1 }}>
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProducts selectedTab="aucun" />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;