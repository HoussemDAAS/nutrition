"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import useCartStore from '@/store';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { Toaster } from 'sonner';
import Loading from '@/components/Loading';
import { SuccessView } from '@/components/chekout/SuccessView';
import { InputField } from '@/components/chekout/InputField';
import { CouponSection } from '@/components/chekout/CouponSection';
import { TermsCheckbox } from '@/components/chekout/TermsCheckbox';
import { OrderSummary } from '@/components/chekout/OrderSummary';
import { ConfirmationDialog } from '@/components/chekout/ConfirmationDialog';


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
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setSubmitting(true);
    const transaction = client.transaction();
    
    try {
      // Create order in Sanity
      const order = await client.create({
        _type: 'command',
        ...formData,
        reference: `CMD-${Date.now()}`,
        items: items.map(item => ({
          _key: Math.random().toString(36).substr(2, 9),
          _type: 'orderItem',
          gout: item.product.selectedFlavor || '', 
          product: { _type: 'reference', _ref: item.product._id },
          quantity: item.quantity,
          price: item.product.prix,
          images: item.product.images 
        })),
        total: couponApplied ? total * 0.9 : total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Update stock
      items.forEach(item => {
        transaction.patch(item.product._id, patch => 
          patch.dec({ stock: item.quantity })
        );
      });

      // Send confirmation email
      await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: order.reference,
          customer: formData.customer,
          items: items.map(item => ({
            product: {
              nom: item.product.nom,
              prix: item.product.prix
            },
            gout: item.product.selectedFlavor,
            quantity: item.quantity,
            price: item.product.prix
          })),
          total: couponApplied ? total * 0.9 : total
        })
      });

      await transaction.commit();
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

  if (orderSuccess) return <SuccessView />;

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
                    onChange={(v: string) =>
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
                    onChange={(v: string) =>
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
                  onChange={(v: string) =>
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
                  onChange={(v: string) =>
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
onChange={(v: string) => {
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
                  onChange={(v: string) => setFormData({ ...formData, coupon: v })}
                  onApply={handleApplyCoupon}
                />

                <TermsCheckbox
                  checked={formData.termsAccepted}
                  onChange={(checked: boolean) =>
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