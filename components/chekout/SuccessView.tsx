"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const SuccessView = () => (
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