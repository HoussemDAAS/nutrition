"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useCartStore from '@/store';
import PriceFormater from '@/components/PriceFormater';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';



export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      birthdate: '',
      phone: '',
    },
    agreed: false,
    coupon: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  
  const { getGroupedItems, getTotalPrice, clearCart } = useCartStore();
  const items = getGroupedItems();
  const total = getTotalPrice();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleApplyCoupon = () => {
    setCouponApplied(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const command = {
        _type: 'command',
        ...formData,
        items: items.map(item => ({
          _key: Math.random().toString(36).substr(2, 9),
          _type: 'orderItem',
          product: { _type: 'reference', _ref: item.product._id },
          quantity: item.quantity,
          price: item.product.prix,
        })),
        total: couponApplied ? total * 0.9 : total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await client.create(command);
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Order submission failed. Please try again.');
    } finally {
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const MobileHeader = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white p-4 border-b flex items-center z-50 shadow-sm">
      <button 
        onClick={() => router.back()}
        className="text-AccentColor hover:text-blue-700 flex items-center gap-2 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour
      </button>
    </div>
  );

  if (!isMounted) return null;

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center p-8 max-w-2xl">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Merci pour votre commande!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Nous avons bien reçu votre commande et vous contacterons sous peu pour confirmer les détails de livraison.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" legacyBehavior passHref>
              <Button className="bg-AccentColor hover:bg-blue-700">
                Retour à l&apos;accueil
              </Button>
            </Link>
            <Link href="/orders" legacyBehavior passHref>
              <Button variant="outline">
                View Your Orders
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <MobileHeader />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 min-h-screen p-4 md:p-8 pt-20 md:pt-8"
      >
        <form onSubmit={(e) => { e.preventDefault(); setShowConfirmation(true); }} className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Informations de Livraison</h2>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Prénom *</label>
                    <Input
                      required
                      value={formData.customer.firstName}
                      onChange={(e) => setFormData({
                        ...formData,
                        customer: {...formData.customer, firstName: e.target.value}
                      })}
                      className="focus:ring-2 focus:ring-AccentColor"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Nom *</label>
                    <Input
                      required
                      value={formData.customer.lastName}
                      onChange={(e) => setFormData({
                        ...formData,
                        customer: {...formData.customer, lastName: e.target.value}
                      })}
                      className="focus:ring-2 focus:ring-AccentColor"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2">Email *</label>
                  <Input
                    required
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      customer: {...formData.customer, email: e.target.value}
                    })}
                    className="focus:ring-2 focus:ring-AccentColor"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block mb-2">Adresse *</label>
                  <Input
                    required
                    value={formData.customer.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      customer: {...formData.customer, address: e.target.value}
                    })}
                    className="focus:ring-2 focus:ring-AccentColor"
                  />
                </div>

                {/* City & Birthdate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Ville *</label>
                    <Input
                      required
                      value={formData.customer.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        customer: {...formData.customer, city: e.target.value}
                      })}
                      className="focus:ring-2 focus:ring-AccentColor"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Date de naissance *</label>
                    <Input
                      type="date"
                      required
                      value={formData.customer.birthdate}
                      onChange={(e) => setFormData({
                        ...formData,
                        customer: {...formData.customer, birthdate: e.target.value}
                      })}
                      className="focus:ring-2 focus:ring-AccentColor"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2">Téléphone *</label>
                  <Input
                    required
                    type="tel"
                    value={formData.customer.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      customer: {...formData.customer, phone: e.target.value}
                    })}
                    className="focus:ring-2 focus:ring-AccentColor"
                  />
                </div>

                {/* Coupon */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="coupon">
                    <AccordionTrigger className="text-AccentColor hover:no-underline">
                      Ajouter un code promo
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="flex gap-3">
                        <Input
                          placeholder="Entrez votre code promo"
                          value={formData.coupon}
                          onChange={(e) => setFormData({
                            ...formData,
                            coupon: e.target.value
                          })}
                          className="focus:ring-2 focus:ring-AccentColor"
                        />
                        <Button 
                          onClick={handleApplyCoupon}
                          className="bg-AccentColor hover:bg-blue-700"
                        >
                          Appliquer
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreed}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      agreed: !!checked
                    })}
                    className="focus:ring-2 focus:ring-AccentColor"
                  />
                  <label htmlFor="terms" className="text-sm leading-none">
                    J&apos;accepte les termes et conditions *
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <PriceFormater amount={total} />
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction</span>
                      <PriceFormater amount={total * 0.1} />
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <PriceFormater amount={couponApplied ? total * 0.9 : total} />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={!formData.agreed || items.length === 0}
                  className="w-full mt-6 bg-AccentColor hover:bg-blue-700"
                >
                  Confirmer la commande
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Order Summary */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total:</span>
                <PriceFormater 
                  amount={couponApplied ? total * 0.9 : total}
                  className="text-lg font-bold"
                />
              </div>
              <Button 
                className="w-full bg-AccentColor hover:bg-blue-700"
                onClick={() => setShowConfirmation(true)}
              >
                Confirmer
              </Button>
            </div>
          </div>

          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la commande</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>Êtes-vous sûr de vouloir passer cette commande?</p>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'En cours...' : 'Confirmer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </form>
      </motion.div>
    </div>
  );
}