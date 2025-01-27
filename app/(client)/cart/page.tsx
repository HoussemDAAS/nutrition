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
      className="bg-gray-50 pb-52 md:pb-10"
    >
      <Container>
        {cartProducts.length ? (
          <>
            <div className="flex items-center gap-2 py-5">
              <ShoppingBag />
              <h1 className="text-2xl font-semibold">Mon Panier</h1>
            </div>
            <div className="grid lg:grid-cols-3 md:gap-8">
              {/* Product List */}
              <div className="lg:col-span-2 rounded-lg">
                <div className="border bg-white rounded-md">
                  {cartProducts?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="border-b p-2.5 last:border-b-0 flex flex-wrap items-center justify-between gap-5"
                      >
                        <div className="flex flex-1 items-center gap-2 h-auto">
                          {product?.images && (
                            <Link
                              href={`product/${product?.slug?.current}`}
                              className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden"
                            >
                              <Image
                                src={urlFor(product?.images[0]).url()}
                                alt={product?.nom || "Product Image"}
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-32 md:w-40 h-32 md:h-40 object-cover rounded-md"
                              />
                            </Link>
                          )}
                          <div className="flex flex-col flex-1 gap-2">
                            <h2 className="font-semibold line-clamp-1">
                              {product?.nom}
                            </h2>
                            <p className="line-clamp-1 text-sm text-gray-500">
                              {product?.intro}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Variant:</span>{" "}
                              <span className="font-semibold text-AccentColor">
                                {product?.variantes}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Status:</span>{" "}
                              <span className="font-semibold">
                                {product?.stock
                                  ? "Disponible"
                                  : "Indisponible"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-between gap-2">
                          <PriceFormater
                            amount={(product?.prix as number) * itemCount}
                            className="font-bold text-lg"
                          />
                          <QuantityButtons product={product} />
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Trash
                                className="w-5 h-5 hover:text-red-600 cursor-pointer"
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
                    );
                  })}
                  <Button
                    className="m-5 font-medium hover:bg-red-600"
                    variant={"destructive"}
                    onClick={clearCart}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Vider le panier
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 border">
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
                      <PriceFormater
                        amount={getSubTotalPrice() - getTotalPrice()}
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total</span>
                      <PriceFormater
                        amount={getTotalPrice()}
                        className="text-lg font-bold text-black"
                      />
                    </div>
                    <Link href="/checkout" passHref>
                      <Button
                        className="w-full mt-6 transition-transform transform hover:scale-105"
                        variant="default"
                      >
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
