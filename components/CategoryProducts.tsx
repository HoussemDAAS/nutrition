"use client";
import { Category, Produit } from '@/sanity.types';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, X } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';

interface CategoryProductsProps {
  categories: Category[]; // Array of categories
  slug: string; // Current category slug for filtering products
}

const CategoryProducts = ({ categories, slug }: CategoryProductsProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentslug, setCurrentSlug] = React.useState(slug);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>(categories);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Produit[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([slug]); // Track selected categories by slug

  // Fetch products based on the selected category slugs
  const fetchProducts = async (categorySlugs: string[]) => {
    try {
      setIsLoading(true);
  
      // If no categories are selected, don't fetch products
      if (categorySlugs.length === 0) {
        setProducts([]);
        return;
      }
  
      // Create a GROQ query where products need to reference all selected categories
      const query = `*[_type == 'produit' && 
        ${categorySlugs
          .map((slug, index) => {
            return `references(*[_type == 'category' && slug.current == $slug${index}]._id)`;
          })
          .join(" && ")}
      ] | order(nom asc)`;
  
      // Dynamically pass the slugs as parameters
      const params = categorySlugs.reduce<Record<string, string>>((acc, slug, index) => {
        acc[`slug${index}`] = slug;
        return acc;
      }, {});
  
      const data = await client.fetch(query, params);
      setProducts(data);
      console.log('Fetched products:', data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update filtered categories based on search term
  React.useEffect(() => {
    setFilteredCategories(
      categories.filter((category) =>
        category?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    fetchProducts(selectedCategories); // Fetch products when categories change
  }, [searchTerm, categories, selectedCategories]);

  // Handle category selection and deselection
  const handleCategorySelection = (categorySlug: string) => {
    setSelectedCategories((prevState) => {
      if (prevState.includes(categorySlug)) {
        // If the category is already selected, remove it
        return prevState.filter((slug) => slug !== categorySlug);
      } else {
        // If the category is not selected, add it
        return [...prevState, categorySlug];
      }
    });
  };

  // When no categories are selected, show products from the default slug
  React.useEffect(() => {
    if (selectedCategories.length === 0) {
      setSelectedCategories([slug]);
    }
  }, [selectedCategories, slug]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {/* Sidebar Section */}
      <div className="flex flex-col md:min-w-78">
        {/* Desktop Filters */}
        <div className="hidden md:block w-64">
          <Accordion type="single" collapsible={false}>
            <AccordionItem value="categories">
              <AccordionTrigger className="text-left text-lg text-AccentColor tracking-wide uppercase">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2">
                  <Input
                    placeholder="Recherche"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3 w-full"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <label key={category._id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                          checked={selectedCategories.includes(category.slug?.current || '')}
                          onChange={() => handleCategorySelection(category.slug?.current || '')}
                        />
                        <span className="text-sm text-gray-800">{category.title || "Unnamed Category"}</span>
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
          className="md:hidden px-4 py-2 bg-AccentColor text-white rounded-lg"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          Filter
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
              <h2 className="text-lg font-bold">Filter</h2>
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
                {filteredCategories.map((category) => (
                  <label key={category._id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                      checked={selectedCategories.includes(category.slug?.current || '')}
                      onChange={() => handleCategorySelection(category.slug?.current || '')}
                    />
                    <span className="text-sm text-gray-800">{category.title || "Unnamed Category"}</span>
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
            <motion.div
              className="flex items-center space-x-2 text-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-semibold">Loading...</span>
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

export default CategoryProducts;
