"use client";
import { Loader2, Search, X } from "lucide-react";
import React, { useCallback, useState, useRef, useEffect } from "react";
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

const SearchBar = ({ inline = false }: { inline?: boolean }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      return;
    }
    setIsLoading(true);
    try {
      const query = `*[_type == 'produit' && nom match $search] | order(nom asc)`;
      const params = { search: `*${search}*` };
      const response = await client.fetch<Produit[]>(query, params);
      setProducts(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        fetchProducts();
      } else {
        setProducts([]);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, fetchProducts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (inline) {
    return (
      <div className="relative w-full" ref={searchRef}>
        <div className="relative flex items-center">
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="pl-4 pr-10 py-2 rounded-lg border-gray-300 focus-visible:ring-darkColor/50"
          />
          <button
            className="absolute right-0 top-0 h-full px-3 flex items-center justify-center w-10 rounded-r-lg bg-darkColor text-white hover:bg-darkColor/90 transition-colors"
            type="button"
            onClick={() => search && fetchProducts()}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {showResults && (search || isLoading) && (
          <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-AccentColor mr-2" />
                <span className="text-sm">Recherche en cours...</span>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug?.current}`}
                  className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  <div className="flex-shrink-0 w-16 h-16 relative border border-gray-100 rounded-md overflow-hidden">
                    {product.images?.[0] && (
                      <Image
                        src={urlFor(product.images[0]).url()}
                        alt={product.nom || ""}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{product.nom}</h3>
                    <p className="text-xs text-gray-500 truncate">{product.intro}</p>
                    <PriceView 
                      price={product.prix} 
                      discount={product.remise} 
                      className="text-sm font-semibold mt-1"
                    />
                  </div>
                </Link>
              ))
            ) : search && !isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Aucun produit trouvé pour &quot;{search}&quot;
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog open={showSearch} onOpenChange={setShowSearch}>
      <DialogTrigger asChild>
        <button className="p-1 hover:text-darkColor transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl min-h-[90vh] max-h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="mb-1">Rechercher un produit</DialogTitle>
          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Rechercher un produit"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md py-5 pl-4 pr-10"
              autoFocus
            />
            {search && (
              <X
                className="w-4 h-4 absolute top-1/2 right-11 transform -translate-y-1/2 hover:text-red-500 cursor-pointer transition-colors"
                onClick={() => setSearch("")}
              />
            )}
            <button
              className={`absolute right-0 top-0 h-full px-3 flex items-center justify-center w-10 rounded-tr-md rounded-br-md transition-colors ${
                search ? "bg-darkColor text-white hover:bg-darkColor/90" : "bg-darkColor/10 hover:bg-darkColor/20"
              }`}
              type="submit"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </DialogHeader>
        <div className="w-full h-full overflow-y-auto border-t border-darkColor/20 p-6">
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
            <div className="space-y-4">
              {products.map((product: Produit) => (
                <div
                  key={product._id}
                  className="bg-white overflow-hidden border-b border-darkColor/20 last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex items-center gap-4">
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          priority
                        />
                      )}
                    </Link>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${product?.slug?.current}`}
                          onClick={() => setShowSearch(false)}
                          className="flex-1 min-w-0"
                        >
                          <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-1">
                            {product?.nom}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {product?.intro}
                          </p>
                        </Link>
                        <PriceView
                          price={product?.prix}
                          discount={product?.remise}
                          className="text-sm md:text-md font-semibold ml-4"
                        />
                      </div>

                      <div className="mt-3">
                        <AddToCardButton product={product} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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