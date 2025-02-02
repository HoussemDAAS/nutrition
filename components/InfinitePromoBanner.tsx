// components/InfinitePromoBanner.tsx
"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Produit } from '@/sanity.types';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import PriceView from './PriceView';

const InfinitePromoBanner = ({ products }: { products: Produit[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // @ts-nocheck
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-rotate featured products
  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(timeoutRef.current as NodeJS.Timeout);
  }, [products.length]);

  // Scroll to current slide
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * currentSlide,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  if (!products.length) return null;

  return (
    <section className="relative overflow-hidden rounded-md bg-gradient-to-br from-[#a4c3e2] via-[#398fe6] to-[#144585] py-16 my-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 ">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#0F2E4E] mb-4 uppercase"
          >
            Promotions
            <span className='text-AccentColor'>.</span>
          </motion.h2>
          <p className="text-xl text-[#DA1D3C] font-medium">
            Économisez jusqu&apos;à 50% sur nos meilleurs produits
          </p>
        </div>

        {/* Products Carousel */}
        <div 
          ref={carouselRef}
          className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar pb-8"
        >
          {products.map((product) => (
            <motion.div 
              key={product._id}
              className="flex-shrink-0 w-full px-4 snap-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:grid md:grid-cols-2 gap-8 h-auto min-h-[400px]">
                {/* Product Image */}
                <div className="relative h-64 md:h-full">
                  <Image
                    src={product.images?.[0] ? urlFor(product.images[0]).width(1200).url() : '/placeholder.jpg'}
                    alt={product.nom || 'Product image'}
                    fill
                    className="object-contain p-6"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {product.remise && (
                    <div className="absolute top-4 right-4 bg-[#DA1D3C] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
                      -{product.remise}%
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                  <h3 className="text-2xl font-bold text-[#0F2E4E]">
                    {product.nom}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 text-base">
                    {product.intro}
                  </p>
                  
                  <div className="mt-4">
                    <PriceView 
                      price={product.prix} 
                      discount={product.remise}
                      className="text-xl font-semibold text-[#0F2E4E]"
                    />
                  </div>

                  <Link
                    href={`/product/${product.slug?.current}`}
                    className="mt-6 inline-flex items-center gap-2 bg-[#DA1D3C] text-white px-6 py-3 rounded-lg w-fit hover:bg-[#c21834] transition-colors group"
                  >
                    <span>Voir l&apos;offre</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-[#DA1D3C] w-6' 
                  : 'bg-[#0F2E4E]/20 hover:bg-[#0F2E4E]/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent" />
      </div>
    </section>
  );
};

export default InfinitePromoBanner;