"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useCartStore, { CartItem } from '@/store';
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

interface FormData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    birthdate: string;
    phone: string;
  };
  coupon: string;
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

interface CouponSectionProps {
  coupon: string;
  onChange: (value: string) => void;
  onApply: () => void;
}

interface OrderSummaryProps {
  total: number;
  couponApplied: boolean;
  items: CartItem[];
  onSubmit: () => void;
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      birthdate: '',
      phone: '',
    },
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
    if (orderSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderSuccess]);

  const handleApplyCoupon = () => setCouponApplied(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await client.create({
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
      });
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Échec de la soumission de la commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  if (!isMounted) return null;

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 scroll-smooth"
      >
        <div className="text-center p-6 max-w-2xl mx-4">
          <div className="mb-5">
            <svg className="mx-auto h-14 w-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Merci pour votre commande!</h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            Nous avons bien reçu votre commande et vous contacterons sous peu pour confirmer les détails de livraison.
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Link href="/" legacyBehavior passHref>
              <Button className="bg-AccentColor hover:bg-AccentColor/90 text-sm md:text-base">
                Retour à l&apos;accueil
              </Button>
            </Link>
            <Link href="/orders" legacyBehavior passHref>
              <Button variant="outline" className="text-sm md:text-base">
                Voir mes commandes
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative scroll-smooth">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 min-h-screen p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8"
      >
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="text-AccentColor hover:text-AccentColor/80 flex items-center gap-2 text-sm mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          
          <form onSubmit={(e) => { e.preventDefault(); setShowConfirmation(true); }}>
            <div className="grid lg:grid-cols-3 md:gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Informations de Livraison</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField 
                      label="Prénom *" 
                      value={formData.customer.firstName}
                      onChange={v => setFormData({...formData, customer: {...formData.customer, firstName: v}})}
                    />
                    <InputField 
                      label="Nom *" 
                      value={formData.customer.lastName}
                      onChange={v => setFormData({...formData, customer: {...formData.customer, lastName: v}})}
                    />
                  </div>

                  <InputField 
                    label="Email *" 
                    type="email"
                    value={formData.customer.email}
                    onChange={v => setFormData({...formData, customer: {...formData.customer, email: v}})}
                  />

                  <InputField 
                    label="Adresse *" 
                    value={formData.customer.address}
                    onChange={v => setFormData({...formData, customer: {...formData.customer, address: v}})}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField 
                      label="Ville *" 
                      value={formData.customer.city}
                      onChange={v => setFormData({...formData, customer: {...formData.customer, city: v}})}
                    />
                    <InputField 
                      label="Date de naissance *" 
                      type="date"
                      value={formData.customer.birthdate}
                      onChange={v => setFormData({...formData, customer: {...formData.customer, birthdate: v}})}
                    />
                  </div>

                  <InputField 
                    label="Téléphone *" 
                    type="tel"
                    value={formData.customer.phone}
                    onChange={v => setFormData({...formData, customer: {...formData.customer, phone: v}})}
                  />

                  <CouponSection 
                    coupon={formData.coupon}
                    onChange={v => setFormData({...formData, coupon: v})}
                    onApply={handleApplyCoupon}
                  />

                  <TermsCheckbox />
                </div>
              </div>

              {/* Desktop Order Summary */}
              <div className="lg:col-span-1 mt-6 lg:mt-0 hidden md:block">
                <OrderSummary 
                  total={total}
                  couponApplied={couponApplied}
                  items={items}
                  onSubmit={() => setShowConfirmation(true)}
                />
              </div>
            </div>

            {/* Mobile Order Summary */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
              <OrderSummary 
                total={total}
                couponApplied={couponApplied}
                items={items}
                onSubmit={() => setShowConfirmation(true)}
              />
            </div>

            <ConfirmationDialog 
              open={showConfirmation}
              onClose={() => setShowConfirmation(false)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Components
const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', value, onChange }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    <Input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg focus:ring-2 focus:ring-AccentColor text-sm md:text-base"
    />
  </div>
);

const CouponSection: React.FC<CouponSectionProps> = ({ coupon, onChange, onApply }) => (
  <Accordion type="single" collapsible>
    <AccordionItem value="coupon">
      <AccordionTrigger className="text-AccentColor hover:no-underline py-2 text-sm md:text-base">
        Ajouter un code promo
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="flex gap-2">
          <Input
            placeholder="Entrez votre code promo"
            value={coupon}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 focus:ring-2 focus:ring-AccentColor text-sm"
          />
          <Button 
            onClick={onApply} 
            className="bg-AccentColor hover:bg-AccentColor/90 text-sm"
          >
            Appliquer
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const TermsCheckbox = () => (
  <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
    <Checkbox
      id="terms"
      required
      className="mt-1 focus:ring-2 focus:ring-AccentColor"
    />
    <label htmlFor="terms" className="text-sm text-gray-600">
      J&apos;accepte les termes et conditions *
    </label>
  </div>
);

const OrderSummary: React.FC<OrderSummaryProps> = ({ total, couponApplied, items, onSubmit }) => (
  <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
    <h2 className="text-lg md:text-xl font-semibold mb-3">Récapitulatif</h2>
    <div className="space-y-2">
      <div className="flex justify-between text-sm md:text-base">
        <span>Sous-total</span>
        <PriceFormater amount={total} />
      </div>
      {couponApplied && (
        <div className="flex justify-between text-green-600 text-sm md:text-base">
          <span>Réduction</span>
          <PriceFormater amount={total * 0.1} />
        </div>
      )}
      <Separator className="my-1 md:my-2" />
      <div className="flex justify-between font-bold text-base md:text-lg">
        <span>Total</span>
        <PriceFormater amount={couponApplied ? total * 0.9 : total} />
      </div>
      <Button
        type="submit"
        disabled={items.length === 0}
        className="w-full mt-3 bg-AccentColor hover:bg-AccentColor/90 text-sm md:text-base"
        onClick={onSubmit}
      >
        Confirmer la commande
      </Button>
    </div>
  </div>
);

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, onSubmit, submitting }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="rounded-lg max-w-[90%] md:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-lg">Confirmer la commande</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-gray-600">Êtes-vous sûr de vouloir passer cette commande?</p>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="px-4 py-2 text-sm md:text-base"
          >
            Annuler
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={submitting}
            className="bg-AccentColor hover:bg-AccentColor/90 px-4 py-2 text-sm md:text-base"
          >
            {submitting ? 'Traitement...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);