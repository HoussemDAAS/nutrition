"use client";
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Props {
    title: string;
    subtitle: string;
}

const TitleAcceuil = ({ title, subtitle }: Props) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  const svgVariants = {
    hidden: { rotate: 0 },
    visible: { rotate: 360, transition: { duration: 2.5, repeat: Infinity, ease: "linear" } } // Increased duration to 2
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="flex flex-col gap-2 py-5"
    >
      <div className="flex items-center gap-2">
        <motion.svg
          className="w-6 h-6 text-AccentColor"
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          initial="hidden"
          animate={controls}
          variants={svgVariants}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 4v16m8-8H4'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 4l16 16'
          />
        </motion.svg>
        <h2 className='text-2xl md:text-3xl font-bold text-darkColor uppercase tracking-wider '>{title}</h2>
      </div>
      <p className='text-sm md:text-md text-gray-600'>{subtitle}</p>
    </motion.div>
  );
};

export default TitleAcceuil;
