import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface NoProductsProps {
    selectedTab: string;
    className?: string;
}

const NoProducts = ({ selectedTab, className }: NoProductsProps) => {
    return (
        <section 
            className={cn(
                'flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-200 rounded-lg w-full mt-10',
                className
            )}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Aucun produit trouvé pour la catégorie {selectedTab}
                </h2>
            </motion.div>
            <motion.p
                className="text-center text-base text-gray-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
                Nous sommes désolés, mais nous n'avons trouvé aucun produit correspondant 
                à la catégorie{" "}
                <span className="text-base font-semibold text-darkColor">{selectedTab}</span>{" "}
                pour le moment. 
            </motion.p>
            <motion.div
                className='flex items-center text-blue-600 space-x-2 max-w-full'
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
                <Loader2 className='w-4 h-4 animate-spin'/> 
                <span className='text-sm md:text-base'>Les produits seront bientôt de retour en stock</span>
            </motion.div>
            <motion.p
                className='text-sm text-gray-600'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            >
                Veuillez revenir plus tard ou explorer d'autres catégories 
                pour découvrir nos produits de nutrition.
            </motion.p>
        </section>
    );
};

export default NoProducts;
