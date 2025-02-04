
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
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
import { Toaster } from 'sonner';
import Loading from '@/components/Loading';

interface FormData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  coupon: string;
  termsAccepted: boolean;
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  error?: string;
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
  isValid: boolean;
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

interface TermsCheckboxProps {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      phone: '',
    },
    coupon: '',
    termsAccepted: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { getGroupedItems, getTotalPrice, clearCart } = useCartStore();
  const items = getGroupedItems();
  const total = getTotalPrice();

  // Replace useMemo with direct calculation
  const isFormComplete = (
    formData.customer.firstName.trim() !== '' &&
    formData.customer.lastName.trim() !== '' &&
    formData.customer.email.trim() !== '' &&
    formData.customer.address.trim() !== '' &&
    formData.customer.city.trim() !== '' &&
    formData.customer.phone.trim() !== '' &&
    formData.termsAccepted
  );

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    setIsLoading(false);
    if (orderSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderSuccess]);

  if (!isMounted || isLoading) {
    return <Loading />;
  }
  // This validateForm function will still set error messages if you need them.
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { firstName, lastName, email, address, city, phone } = formData.customer;
  
    // Name validation (no numbers, special characters allowed for accents)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = 'Le prénom ne doit pas contenir de chiffres';
    }
  
    if (!lastName.trim()) {
      newErrors.lastName = 'Le nom de famille est requis';
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName = 'Le nom ne doit pas contenir de chiffres';
    }
  
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Format d'email invalide";
    }
  
    if (!address.trim()) newErrors.address = "L'adresse est requise";
  
    // City validation (same as name)
    if (!city.trim()) {
      newErrors.city = 'La ville est requise';
    } else if (!nameRegex.test(city)) {
      newErrors.city = 'La ville ne doit pas contenir de chiffres';
    }
  
    // Phone validation (exactly 8 digits)
    const phoneRegex = /^\d{8}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Le numéro doit contenir exactement 8 chiffres';
    }
  
    if (!formData.termsAccepted) {
      newErrors.terms = 'Vous devez accepter les termes et conditions';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyCoupon = () => {
    if (formData.coupon === 'DISCOUNT10') {
      setCouponApplied(true);
      toast.success('Code promo appliqué avec succès');
    } else {
      setCouponApplied(false);
      toast.error('Code promo invalide');
    }
  };

  // Compute if the form is complete.

  // This function will be triggered when the form is submitted (via pressing Enter on a field)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    setShowConfirmation(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // (Double-check in case the dialog is somehow confirmed while form is incomplete.)
    if (!isFormComplete) {
      toast.error('Veuillez remplir tous les champs requis et accepter les conditions.');
      return;
    }
    setSubmitting(true);

    try {
      await client.create({
        _type: 'command',
        ...formData,
        items: items.map(item => ({
          _key: Math.random().toString(36).substr(2, 9),
          _type: 'orderItem',
          gout: item.product.selectedFlavor || '', 
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
      toast.success('Commande passée avec succès!');
    } catch (error) {
      console.error('Échec de la commande:', error);
      toast.error('Échec de la commande. Veuillez réessayer.');
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
      <Toaster position="top-center" richColors />
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

          {/* The form itself */}
          <form onSubmit={handleFormSubmit}>
            <div className="grid lg:grid-cols-3 md:gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Informations de Livraison</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Prénom *"
                      value={formData.customer.firstName}
                      onChange={v =>
                        setFormData({
                          ...formData,
                          customer: { ...formData.customer, firstName: v },
                        })
                      }
                      error={errors.firstName}
                    />
                    <InputField
                      label="Nom *"
                      value={formData.customer.lastName}
                      onChange={v =>
                        setFormData({
                          ...formData,
                          customer: { ...formData.customer, lastName: v },
                        })
                      }
                      error={errors.lastName}
                    />
                  </div>

                  <InputField
                    label="Email *"
                    type="email"
                    value={formData.customer.email}
                    onChange={v =>
                      setFormData({
                        ...formData,
                        customer: { ...formData.customer, email: v },
                      })
                    }
                    error={errors.email}
                  />

                  <InputField
                    label="Adresse *"
                    value={formData.customer.address}
                    onChange={v =>
                      setFormData({
                        ...formData,
                        customer: { ...formData.customer, address: v },
                      })
                    }
                    error={errors.address}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Ville *"
                      value={formData.customer.city}
                      onChange={v =>
                        setFormData({
                          ...formData,
                          customer: { ...formData.customer, city: v },
                        })
                      }
                      error={errors.city}
                    />
                   <InputField
  label="Téléphone *"
  type="tel"
  value={formData.customer.phone}
  onChange={v => {
    // Allow only numbers
    const numericValue = v.replace(/\D/g, '');
    // Limit to 8 characters
    const truncatedValue = numericValue.slice(0, 8);
    setFormData({
      ...formData,
      customer: { ...formData.customer, phone: truncatedValue },
    });
  }}
  error={errors.phone}
/>
                  </div>

                  <CouponSection
                    coupon={formData.coupon}
                    onChange={v => setFormData({ ...formData, coupon: v })}
                    onApply={handleApplyCoupon}
                  />

                  <TermsCheckbox
                    checked={formData.termsAccepted}
                    onChange={(checked) =>
                      setFormData({ ...formData, termsAccepted: checked })
                    }
                    error={errors.terms}
                  />
                </div>
              </div>

              {/* Desktop Order Summary */}
              <div className="lg:col-span-1 mt-6 lg:mt-0 hidden md:block">
                <OrderSummary
                  total={total}
                  couponApplied={couponApplied}
                  items={items}
                  onSubmit={() => {
                    if (!isFormComplete) {
                      toast.error('Veuillez remplir tous les champs requis et accepter les conditions.');
                    } else {
                      setShowConfirmation(true);
                    }
                  }}
                  isValid={isFormComplete}
                />
              </div>
            </div>

            {/* Mobile Order Summary */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
              <OrderSummary
                total={total}
                couponApplied={couponApplied}
                items={items}
                onSubmit={() => {
                  if (!isFormComplete) {
                    toast.error('Veuillez remplir tous les champs requis et accepter les conditions.');
                  } else {
                    setShowConfirmation(true);
                  }
                }}
                isValid={isFormComplete}
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

const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', value, onChange, error }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    <Input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg focus:ring-2 focus:ring-AccentColor text-sm md:text-base"
    />
    {error && (
      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">
        {error}
      </motion.p>
    )}
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
          <Button onClick={onApply} className="bg-AccentColor hover:bg-AccentColor/90 text-sm">
            Appliquer
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, error, onChange }) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
      <Checkbox
        id="terms"
        checked={checked}
        // Use onCheckedChange instead of onChange for proper behavior.
        onCheckedChange={(checked) => onChange(!!checked)}
        className="mt-1 focus:ring-2 focus:ring-AccentColor"
      />
      <label htmlFor="terms" className="text-sm text-gray-600">
        J&apos;accepte les termes et conditions *
      </label>
    </div>
    {error && (
      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1">
        {error}
      </motion.p>
    )}
  </div>
);

const OrderSummary: React.FC<OrderSummaryProps> = ({ total, couponApplied, items, onSubmit, isValid }) => (
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
        type="button"
        disabled={items.length === 0 || !isValid}
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
          <Button variant="outline" onClick={onClose} className="px-4 py-2 text-sm md:text-base">
            Annuler
          </Button>
          <Button onClick={onSubmit} disabled={submitting} className="bg-AccentColor hover:bg-AccentColor/90 px-4 py-2 text-sm md:text-base">
            {submitting ? 'Traitement...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
