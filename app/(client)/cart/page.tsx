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
      className="bg-gray-50 pb-52 md:mpb-10"
    >
      <Container>
        {cartProducts.length ? (
          <>
            <div className="flex items-center gap-2 py-5">
              <ShoppingBag className="" />
              <h1 className="text-2xl text-semibold">Mon Panier</h1>
            </div>
            <div className="grid lg:grid-cols-3 md:gap-8 ">
              <div className="lg:col-span-2 rounded-lg">
                <div className="border bg-white rounded-md">
                  {cartProducts?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="border-b p-2.5 last:border-b-0
                      flex items-center justify-center gap-5"
                      >
                        <div
                          className="flex flex-1 items-center gap-2 h-36 
                      md:h-44"
                        >
                          {product?.images && (
                            <Link
                              className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden"
                              href={`product/${product?.slug?.current}`}
                            >
                              <Image
                                src={urlFor(product?.images[0]).url()}
                                alt={product?.nom || "Product Image"}
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 overflow-hidden hoverEffect"
                              />
                            </Link>
                          )}
                          <div className="flex flex-1 items-start flex-col justify-between py-2 md:py-1">
                            <div className="space-y-1.5">
                              <h2 className="font-semibold line-clamp-1">
                                {product?.nom}
                              </h2>
                              <p className="line-clamp-1 text-sm text-gray-500 font-medium">
                                {product?.intro}
                              </p>
                              <p className="text-sm capitalize">
                                Variant :{" "}
                                <span className="font-semibold text-AccentColor">
                                  {product?.variantes}
                                </span>
                              </p>
                              <p className="text-sm capitalize">
                                Status :{" "}
                                <span className="font-semibold">
                                  {product?.stock
                                    ? "Disponible"
                                    : "Indisponible"}
                                </span>
                              </p>
                            </div>

                            <div className="text-gray-500 py-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Trash
                                      className="w-4 h-4 md:w-5 md:h-5 hover:text-red-600 hoverEffect"
                                      onClick={() => {
                                        DeleteItem(product?._id);
                                        toast.success(
                                          ` ${product?.nom?.substring(0, 15)}... a été supprimé du panier`
                                        );
                                      }}
                                    />
                                    <TooltipContent className=" bg-red-600 p-1 rounded-md text-white text-sm">
                                      Supprimé du panier
                                    </TooltipContent>
                                  </TooltipTrigger>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div
                            className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5
                          md:p-1"
                          >
                            <PriceFormater
                              amount={(product?.prix as number) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    className="m-5 font-medium hover:bg-red-600 hoverEffect"
                    variant={"destructive"}
                    onClick={clearCart}
                  >
                    <TrashIcon className="w-4 h-4 mr-0.5" />
                    Vider le panier
                  </Button>
                </div>
                <div className=" md:hidden inline-block w-full bg-white rounded-lg p-6 border space-y-4 mt-2 ">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={"/banner.png"}
                      alt={"banner"}
                      width={500}
                      height={500}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-4 text-darkColor">
                    Notre Engagement
                  </h2>
                  <div className="flex flex-row gap-3">
                    <Image
                      src={"/badge.png"}
                      alt={"banner"}
                      width={500}
                      height={500}
                      className="w-[70px] h-auto object-contain"
                    />
                    <p className="text-sm text-gray-600 ">
                      La satisfaction de nos clients est au centre de nos
                      préoccupations C&apos;est pour cette raison que nous
                      offrons un service de qualité !
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="hidden md:inline-block w-full bg-white rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-4">
                    Coordonnées de Livraison
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtoal</span>
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
                        className="w-full mt-6 transition-transform transform hover:scale-105 hover:shadow-lg"
                        variant="default"
                      >
                        Commander
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:inline-block w-full bg-white rounded-lg p-6 border space-y-4 mt-2 ">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={"/banner.png"}
                      alt={"banner"}
                      width={500}
                      height={500}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-4 text-darkColor">
                    Notre Engagement
                  </h2>
                  <div className="flex flex-row gap-3">
                    <Image
                      src={"/badge.png"}
                      alt={"banner"}
                      width={500}
                      height={500}
                      className="w-[70px] h-auto object-contain"
                    />
                    <p className="text-sm text-gray-600 ">
                      La satisfaction de nos clients est au centre de nos
                      préoccupations C&apos;est pour cette raison que nous
                      offrons un service de qualité !
                    </p>
                  </div>
                </div>
              </div>
              {/* order for mobile devices */}
              <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                <div className="p-4 rounded-lg border mx-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Coordonnées de Livraison
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtoal</span>
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
                        className="w-full mt-6 transition-transform transform hover:scale-105 hover:shadow-lg"
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
          <>
            <CartEmpty />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default CartPage;
