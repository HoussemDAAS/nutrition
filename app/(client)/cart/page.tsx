"use client";
import CartEmpty from "@/components/CartEmpty";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import PriceFormater from "@/components/PriceFormater";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { urlFor } from "@/sanity/lib/image";
import { Separator } from "@radix-ui/react-separator";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { ShoppingBag, Trash, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import useCartStore from "@/store";

const CartPage = () => {
  const [isClient, setIsClient] = React.useState(false);
  const {
    DeleteItem,
    getTotalPrice,
    getSubTotalPrice,
    clearCart,
    getGroupedItems,
    getItemCount,
  } = useCartStore();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }

  const cartProducts = getGroupedItems();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 pb-32 md:pb-10"
    >
      <Container>
        {cartProducts.length ? (
          <>
            <div className="flex items-center gap-2 py-5 px-2 md:px-0">
              <ShoppingBag className="w-6 h-6" />
              <h1 className="text-2xl font-semibold">Mon Panier</h1>
            </div>
            <div className="grid lg:grid-cols-3 md:gap-8">
              {/* Product List */}
              <div className="lg:col-span-2">
                <div className="border bg-white rounded-md divide-y">
                  {cartProducts?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="p-3 md:p-4 flex flex-col md:flex-row gap-4 items-start"
                      >
                        {/* Image Section */}
                        <Link
                          href={`product/${product?.slug?.current}`}
                          className="w-full md:w-40 flex-shrink-0"
                        >
                          {product?.images && (
                            <div className="relative aspect-square rounded-md overflow-hidden border">
                              <Image
                                src={urlFor(product?.images[0]).url()}
                                alt={product?.nom || "Product Image"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 160px"
                              />
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 w-full min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h2 className="font-semibold text-lg md:text-base line-clamp-2">
                                {product?.nom}
                              </h2>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {product?.intro}
                              </p>
                            </div>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Trash
                                    className="w-5 h-5 text-gray-400 hover:text-red-600 ml-2 flex-shrink-0"
                                    onClick={() => {
                                      DeleteItem(product?._id);
                                      toast.success(
                                        `${product?.nom?.substring(0, 15)}... supprimé du panier`
                                      );
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="bg-red-600 p-2 text-white text-sm rounded-md">
                                  Supprimer du panier
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Variant:</span>{" "}
                              <span className="text-AccentColor">
                                {product?.variantes}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Status:</span>{" "}
                              <span className={product?.stock ? "text-green-600" : "text-red-600"}>
                                {product?.stock ? "Disponible" : "Indisponible"}
                              </span>
                            </p>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <PriceFormater
                              amount={(product?.prix as number) * itemCount}
                              className="font-bold text-lg text-primary"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="m-4 font-medium hover:bg-red-600"
                  variant={"destructive"}
                  onClick={clearCart}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Vider le panier
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
  <div className="bg-white rounded-lg p-6 border shadow-md 
                  fixed bottom-0 left-0 w-full z-40 lg:static">
    <h2 className="text-xl font-semibold mb-4">
      Coordonnées de Livraison
    </h2>
    <div className="space-y-4">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <PriceFormater amount={getSubTotalPrice()} />
      </div>
      <div className="flex justify-between">
        <span>Discount</span>
        <PriceFormater amount={getSubTotalPrice() - getTotalPrice()} />
      </div>
      <Separator />
      <div className="flex justify-between">
        <span>Total</span>
        <PriceFormater amount={getTotalPrice()} className="text-lg font-bold text-black" />
      </div>
      <Link href="/checkout" passHref>
        <Button className="w-full mt-6 transition-transform transform hover:scale-105" variant="default">
          Commander
        </Button>
      </Link>
    </div>
  </div>
</div>
            </div>
          </>
        ) : (
          <CartEmpty />
        )}
      </Container>
    </motion.div>
  );
};

export default CartPage;