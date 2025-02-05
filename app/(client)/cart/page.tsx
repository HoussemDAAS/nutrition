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
    window.scrollTo(0, 0); // Add scroll to top
  }, []);

  if (!isClient) {
    return <Loading />;
  }

  const cartProducts = getGroupedItems();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 pb-24 md:pb-10"
    >
      <Container>
        {cartProducts.length ? (
          <>
            <div className="flex items-center gap-2 py-4 px-2 md:px-0">
              <ShoppingBag className="w-5 h-5 text-AccentColor" />
              <h1 className="text-xl font-semibold">Mon Panier</h1>
            </div>
            
            <div className="grid lg:grid-cols-3 md:gap-4">
              {/* Product List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  {cartProducts?.map(({ product }) => {
                    const slug = String(product?.slug);


                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="p-2.5 flex gap-2.5 items-start border-b last:border-b-0"
                      >
                        {/* Image Section */}
                        <Link
                href={`/product/${slug}`}
                

                          className="w-16 h-16 flex-shrink-0"
                        >
                          <div className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-100">
                            <Image
                              src={product?.images ? urlFor(product.images[0]).url() : '/placeholder-image.png'}
                              alt={product?.nom || "Product Image"}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h2 className="font-medium text-sm line-clamp-2">
                                {product?.nom}
                              </h2>
                              {product.selectedFlavor && (
  <p className="text-sm text-gray-500">Parfum: {product.selectedFlavor}</p>
)}
                              <div className="mt-1 space-y-0.5">
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {product?.intro}
                                </p>
                                <p className="text-[0.7rem] text-AccentColor font-medium">
                                  {product?.variantes}
                                </p>
                              </div>
                            </div>
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Trash
                                    className="w-4 h-4 text-gray-300 hover:text-red-600 ml-1 transition-colors"
                                    onClick={() => {
                                      DeleteItem(product?._id);
                                      toast.success(
                                        `${product?.nom?.substring(0, 12)}... supprimé`
                                      );
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="bg-red-600 px-2 py-1 text-white text-xs rounded">
                                  Supprimer
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div className="mt-1.5 flex items-center justify-between">
                            <PriceFormater
                              amount={(product?.prix as number) * itemCount}
                              className="font-semibold text-sm"
                            />
                            <QuantityButtons 
                              product={product} 
                              className="gap-1"
                              borderStyle="w-3 h-3"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-2 py-3">
                  <Button
                    className="w-full text-xs h-8"
                    variant={"destructive"}
                    onClick={clearCart}
                  >
                    <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
                    Vider le panier
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-3 shadow-lg fixed bottom-0 left-0 w-full z-40 border-t lg:static lg:border-t-0 lg:mt-4">
                  <h2 className="text-base font-semibold mb-2">Récapitulatif</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <PriceFormater amount={getSubTotalPrice()} />
                    </div>
                    <div className="flex justify-between text-AccentColor">
                      <span>Réduction:</span>
                      <PriceFormater amount={getSubTotalPrice() - getTotalPrice()} />
                    </div>
                    <Separator className="my-1.5" />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <PriceFormater 
                        amount={getTotalPrice()} 
                        className="text-base" 
                      />
                    </div>
                    <Link href="/checkout" passHref>
                      <Button className="w-full mt-3 text-sm h-9 bg-AccentColor hover:bg-AccentColor/90">
                        Commander maintenant
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