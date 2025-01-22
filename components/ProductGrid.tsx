/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from "react";
import HomeTapbar from "./HomeTapbar";
import { productType } from "@/constants";
import { client } from "@/sanity/lib/client";
import { Produit } from "@/sanity.types";
import ProductCard from "./ProductCard";
import NoProducts from "./NoProducts";
import { AnimatePresence, motion} from "motion/react";
import { Loader2 } from "lucide-react";
const ProductGrid = () => {
  const [selectedTab, setSelectedTab] = React.useState(
    productType?.[0]?.value || ""
  );
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const query = `*[_type == 'produit' && variantes == $variant] | order(_createdAt desc) `;
  const params = { variant: selectedTab };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);
  return (
    <div className="mt-10 flex flex-col items-center">
      <HomeTapbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100
        rounded-lg w-full mt-10">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full">
            { products.map((product: Produit) => (
             <AnimatePresence  key={product._id}>
               <motion.div layout initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProductCard product={product} />
              </motion.div>
             </AnimatePresence>
            ))
            }
          </div>
        ) : (
         
          <NoProducts  selectedTab={selectedTab}/>

        )}
      </>
       
         
      )}
    </div>
  );
};

export default ProductGrid;
