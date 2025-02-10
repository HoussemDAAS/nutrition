// components/PromoBanner.tsx
"use client";
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Produit } from '@/sanity.types';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import PriceView from './PriceView';
import { urlFor } from '@/sanity/lib/image';

const PromoBanner = ({ products }: { products: Produit[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % products.length);
    }, 7000);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [products.length]);

  if (!products.length) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <AnimatePresence mode='wait'>
          {products.map((product, index) => (
            currentSlide === index && (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                {/* Image Container */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-l"
                >
                  <Image
                    src={urlFor(product.images?.[0]).width(1200).url()}
                    alt={product.nom}
                    fill
                    className="object-contain object-center"
                    priority
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-[#DA1D3C] text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
                    -{product.remise}%
                  </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-6 text-center lg:text-left">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl lg:text-5xl font-bold text-[#0F2E4E]"
                  >
                    PROMOTIONS<span className='text-AccentColor'>.</span>
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-AccentColor/90"
                  >
                    Économisez jusqu&apos;à 50% sur nos meilleurs produits
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <h3 className="text-3xl font-bold text-[#0F2E4E]">
                      {product.nom}
                    </h3>
                    
                    <PriceView
                      price={product.prix}
                      discount={product.remise}
                      className="text-xl text-[#DA1D3C] font-bold"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      href={`/promotion`}
                      className="inline-flex items-center gap-3 bg-[#0F2E4E] hover:bg-[#1A446B] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 group"
                    >
                      <span>Voir l&apos;offre</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-12">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-[#DA1D3C]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;