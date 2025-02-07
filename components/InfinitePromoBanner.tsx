// components/InfinitePromoBanner.tsx
"use client";
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Produit } from '@/sanity.types';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import PriceView from './PriceView';
import { urlFor } from '@/sanity/lib/image';

const InfinitePromoBanner = ({ products }: { products: Produit[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % products.length);
    }, 7000);

    return () => clearInterval(timeoutRef.current as NodeJS.Timeout);
  }, [products.length]);

  if (!products.length) return null;

  return (
    <section className="relative overflow-hidden shadow-xl my-16 lg:my-24 w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-darkColor/20 via-darkColor/20 to-darkColor/30" />
      
      <div className="relative w-full px-4 py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-[#0F2E4E] mb-4 tracking-tighter"
          >
            Offres Spéciales
            <span className="text-[#DA1D3C]"> Nutrition</span>
            <span className="text-[#0F2E4E]/80">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg lg:text-xl text-[#0F2E4E]/90 font-medium max-w-2xl mx-auto"
          >
            Découvrez nos programmes nutritionnels premium à des prix exceptionnels
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[600px] lg:h-[700px] w-full">
          <AnimatePresence initial={false} mode='wait'>
            {products.map((product, index) => (
              currentSlide === index && (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 p-6"
                >
                  {/* Image Container */}
                  <div className="relative w-full lg:w-1/2 h-96 lg:h-full bg-white/20 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="relative h-full w-full">
                      <Image
                        src={product.images?.[0] ? urlFor(product.images[0]).width(1200).url() : '/placeholder.jpg'}
                        alt={product.nom || 'Product image'}
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {product.remise && (
                      <div className="absolute top-6 right-6 bg-white text-[#DA1D3C] px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                        -{product.remise}%
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl lg:text-4xl font-extrabold text-[#0F2E4E]"
                    >
                      {product.nom}
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg lg:text-xl text-[#0F2E4E]/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    >
                      {product.intro}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8"
                    >
                      <PriceView 
                        price={product.prix} 
                        discount={product.remise}
                        className="text-3xl font-bold text-[#DA1D3C]"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-10"
                    >
                      <Link
                        href={`/product/${product.slug?.current}`}
                        className="inline-flex items-center gap-3 bg-[#DA1D3C] hover:bg-[#DA1D3C]/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#DA1D3C]/20"
                      >
                        <span>Commencer maintenant</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-[#0F2E4E] w-8 scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F2E4E]/10 to-transparent" />
      </div>
    </section>
  );
};

export default InfinitePromoBanner;