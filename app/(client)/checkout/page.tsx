"use client";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import PriceFormater from "@/components/PriceFormater";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import React from "react";


const CheckoutPage = () => {
  const [isClient, setIsClient] = React.useState(false);
  const { getTotalPrice, getSubTotalPrice } = useCartStore();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 pb-52 md:pb-10"
    >
      <Container>
        <div className="flex items-center gap-2 py-5">
          <ShoppingBag className="text-AccentColor w-6 h-6" />
          <h1 className="text-2xl font-semibold text-gray-800">Commander</h1>
        </div>
        <div className="grid lg:grid-cols-3 md:gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations de livraison</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-AccentColor focus:border-AccentColor sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-AccentColor focus:border-AccentColor sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <Input
                  id="address"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-AccentColor focus:border-AccentColor sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ville
                  </label>
                  <Input
                    id="city"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-AccentColor focus:border-AccentColor sm:text-sm"
                  />
                </div>
                
              </div>
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                  Date de naissance
                </label>
                <Input
                  id="birthday"
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-AccentColor focus:border-AccentColor sm:text-sm"
                />
              </div>
            
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Numéro de téléphone
                </label>
                <Input
                  id="phoneNumber"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-AccentColor focus:border-AccentColor sm:text-sm"
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Input
                    id="terms"
                    type="checkbox"
                    className="focus:ring-AccentColor h-4 w-4 text-AccentColor border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    J&apos;accepte les termes et conditions
                  </label>
                </div>
              </div>
              <Accordion className="mt-6" type="single" collapsible>
                <AccordionItem value="coupon">
                  <AccordionTrigger className="focus:ring-AccentColor text-AccentColor">
                    Ajouter un coupon
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-4 flex gap-2">
                      <Input
                        id="coupon"
                        type="text"
                        placeholder="Code coupon"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-AccentColor focus:border-AccentColor sm:text-sm"
                      />
                      <Button
                        className="transition-transform transform hover:scale-105 hover:shadow-lg text-white bg-AccentColor"
                        variant="default"
                      >
                        Appliquer
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </div>
          <div className="lg:col-span-1">
            <div className="hidden md:inline-block w-full bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Récapitulatif de la commande</h2>
              <div className="space-y-6">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <PriceFormater amount={getSubTotalPrice()} />
                </div>
                <div className="flex justify-between">
                  <span>Réduction</span>
                  <PriceFormater amount={getSubTotalPrice() - getTotalPrice()} />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <PriceFormater amount={getTotalPrice()} />
                </div>
              </div>
              <Button
                className="w-full mt-6 transition-transform transform hover:scale-105 hover:shadow-lg text-white bg-AccentColor"
                variant="default"
              >
                Passer la commande
              </Button>
            </div>
          </div>
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2 shadow-sm">
            <div className="p-4 rounded-t-lg border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Récapitulatif de la commande</h2>
              <div className="space-y-6">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <PriceFormater amount={getSubTotalPrice()} />
                </div>
                <div className="flex justify-between">
                  <span>Réduction</span>
                  <PriceFormater amount={getSubTotalPrice() - getTotalPrice()} />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <PriceFormater
                    amount={getTotalPrice()}
                    className="text-lg font-bold text-black"
                  />
                </div>
                <Button
                  className="w-full mt-6 transition-transform transform hover:scale-105 hover:shadow-lg text-white bg-AccentColor"
                  variant="default"
                >
                  Passer la commande
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default CheckoutPage;
