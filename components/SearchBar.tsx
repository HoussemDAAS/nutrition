"use client";
import { Loader2, Search, X } from "lucide-react";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { client } from "@/sanity/lib/client";

import Link from "next/link";
import { Produit } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceView from "./PriceView";
import AddToCardButton from "./AddToCardButton";

const SearchBar = () => {
  const [search, setSearch] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      return;
    }
    setIsLoading(true);
    try {
      const query = `*[_type == 'produit' && nom match $search] | order(nom asc) `;
      const params = { search: `*${search}*` };
      const response = await client.fetch(query, params);
      setProducts(await response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);
  React.useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, fetchProducts]);

  return (
    <Dialog open={showSearch} onOpenChange={() => setShowSearch(!showSearch)}>
      <DialogTrigger onClick={() => setShowSearch(!showSearch)}>
        <Search className="w-5 h-5 hover:text-darkColor hoverEffect" />
      </DialogTrigger>
      <DialogContent className="max-w-5xl min-h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mb-1">Rechercher un produit</DialogTitle>
          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Rechercher un produit"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md py-5"
            />
            {search && (
              <X
                className="w-4 h-4 absolute top-1/2 right-11 transform -translate-y-1/2 hover:text-red-500 hoverEffect"
                onClick={() => setSearch("")}
              />
            )}
            <button
              className={`absolute right-0 top-0 h-full px-3 flex items-center justify-center w-10  rounded-tr-md rounded-br-md hover:bg-darkColor hover:text-white hoverEffect ${search ? "bg-darkColor text-white" : "bg-darkColor/10"}`}
              type="submit"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </DialogHeader>
        <div className="w-full h-full overflow-y-scroll border border-darkColor/20 rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="flex items-center justify-center gap-2 px-6 py-10"
              >
                <Loader2 className="w-5 h-5 animate-spin text-AccentColor" />
                <p className="text-sm font-semibold text-AccentColor">
                  Recherche en cours...
                </p>
              </motion.div>
            </div>
          ) : products.length > 0 ? (
            products.map((product: Produit) => (
              <div
                key={product._id}
                className="bg-white overflow-hidden border-b border-darkColor/20 last:border-b-0"
              >
                <div className="flex items-center gap-1">
                  <Link
                    href={`/product/${product?.slug?.current}`}
                    className="h-20 w-20 md:w-24 md:h-24 flex-shrink-0 border border-darkColor/10 rounded-md overflow-hidden group"
                    onClick={() => setShowSearch(false)}
                  >
                    {product?.images && (
                      <Image
                        src={urlFor(product?.images[0]).url()}
                        width={200}
                        height={200}
                        alt={product?.nom || "Product Image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all hoverEffect"
                        priority={true}
                      />
                    )}
                  </Link>

                  <div className="px-4 py-2 flex-grow">
                    <div className="flex justify-between items-start">
                    <Link
                      href={`/product/${product?.slug?.current}`}
                      onClick={() => setShowSearch(false)}
                    >
                      <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-1">
                        {product?.nom}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {product?.intro}
                      </p>
                    </Link>
                    <div className="flex items-center gap-5 justify-between">
                    <PriceView
                      price={product?.prix}
                      discount={product?.remise}
                      className="text-sm md:text-md font-semibold"
                    />
                    </div>
                    </div>
                    
                  

                    <div className="w-4/5 md:w-60 mt-3">
                      <AddToCardButton product={product} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 font-semibold tracking-wide">
              {search && !isLoading ? (
                <p className="text-sm font-semibold text-darkColor flex items-center justify-center gap-1">
                  Aucun produit trouvé pour{" "}
                  <span className="font-semibold tracking-wide text-AccentColor">
                    {search}
                  </span>
                </p>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="text-sm font-semibold text-darkColor flex items-center justify-center gap-1"
                >
                  <Search className="w-5 h-5" /> Rechercher un produit
                </motion.div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
