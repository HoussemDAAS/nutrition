/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const BannierePromoInfinie = () => {
  const ref = useRef(null);
  const [tempsRestant, setTempsRestant] = useState('14j 00:00:00');

  // Date de fin ajustée
  const [dateFin] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const maintenant = new Date();
      const difference = dateFin.getTime() - maintenant.getTime();
      
      const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
      const heures = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secondes = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTempsRestant(
        `${jours}j ${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [dateFin]);

  // Suggestions de photos :
  const imagesSuggestions = [
    "/whey-protein-isole.jpg", // Pot de whey isolée avec fond de gym
    "/pack-supplements.jpg", // Collection de suppléments alignés
    "/athlete-training.jpg", // Athlète en plein effort
    "/nutrition-coach.jpg" // Coach montrant un plan nutritionnel
  ];

  return (
    <section className="relative py-12 overflow-hidden" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Arrière-plan avec image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imagesSuggestions[2]} // Choisir l'image appropriée
            alt="Nouveaux produits"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2E4E] to-[#0F2E4E]/90" />
        </div>

        {/* Contenu recentré */}
        <div className="relative z-10 flex flex-col items-center text-center rounded-3xl p-8 overflow-hidden">
          {/* Titres */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="space-y-6 mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#DA1D3C]">
              Nouveau Site Web ! 🚀
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Offres spéciales de lancement - Ne manquez pas ça !
            </p>
          </motion.div>

          {/* Compte à rebours centré */}
          <motion.div
            className="bg-[#DA1D3C]/20 p-6 rounded-2xl mb-8 w-full max-w-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex items-center justify-center gap-4">
              <HorlogeIcon className="h-8 w-8 text-[#DA1D3C]" />
              <div className="font-mono text-2xl font-bold text-[#DA1D3C]">
                {tempsRestant}
              </div>
            </div>
          </motion.div>

          {/* Bouton CTA */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mb-12"
          >
            <Link
              href="/promotion"
              className="flex items-center gap-3 bg-[#DA1D3C] text-white px-10 py-5 rounded-xl font-bold text-xl shadow-xl hover:bg-[#DA1D3C]/90 transition-all"
            >
              Voir les offres <ArrowRight className="h-6 w-6" />
            </Link>
          </motion.div>

          {/* Avantages avec icônes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
              <TruckIcon className="h-8 w-8 text-[#DA1D3C] mb-2" />
              <span className="text-gray-200">Livraison Express</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
              <DumbbellIcon className="h-8 w-8 text-[#DA1D3C] mb-2" />
              <span className="text-gray-200">Coaching Gratuit</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
              <BookIcon className="h-8 w-8 text-[#DA1D3C] mb-2" />
              <span className="text-gray-200">Guide Nutrition</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
              <HeadsetIcon className="h-8 w-8 text-[#DA1D3C] mb-2" />
              <span className="text-gray-200">Support 24/7</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Icônes personnalisées
const HorlogeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM12 9v4m-3-3h6m3 0h2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3" />
  </svg>
);

const DumbbellIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const BookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const HeadsetIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h3a2 2 0 002-2v-4a2 2 0 00-2-2h-3m-5 0H6a2 2 0 00-2 2v4a2 2 0 002 2h3m5-10V7m0 0h3M9 7h3m0 0V7" />
  </svg>
);

export default BannierePromoInfinie;