"use client";
import React from "react";
import Container from "@/components/Container";
import { motion } from "motion/react";

const AboutPage = () => {
  // Define container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delays each child animation for a cascading effect
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  // Define individual text animations
  const textVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Define heading animations
  const headingVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants} // Apply animation to the container
    >
      <Container className="max-w-6xl lg:px-8 py-12">
        {/* Animated heading */}
        <motion.h1
          className="text-4xl font-extrabold text-darkColor mb-6 text-center lg:text-left"
          variants={headingVariants}
        >
          À propos de House Protein
        </motion.h1>

        {/* Animated text sections */}
        <motion.p
          className="mb-6 text-lg text-gray-700 leading-relaxed"
          variants={textVariants}
        >
          Bienvenue chez <strong>House Protein</strong>, votre boutique de référence pour la <strong>nutrition sportive</strong> à <strong>Bizerte, Tunisie</strong>. Depuis <strong>2018</strong>, nous nous engageons à fournir des produits de qualité supérieure pour répondre aux besoins des sportifs, des amateurs de fitness et des professionnels à travers toute la Tunisie.
        </motion.p>
        <motion.p
          className="mb-6 text-lg text-gray-700 leading-relaxed"
          variants={textVariants}
        >
          Notre large sélection de produits inclut des <strong>protéines en poudre</strong>, de la <strong>créatine</strong>, des <strong>compléments alimentaires</strong> pour la musculation et des formules pré-entraînement. Tous nos produits sont soigneusement sélectionnés pour garantir une performance optimale, soutenir vos objectifs de fitness et améliorer votre récupération musculaire.
        </motion.p>
        <motion.p
          className="mb-6 text-lg text-gray-700 leading-relaxed"
          variants={textVariants}
        >
          Chez <strong>House Protein</strong>, notre priorité est votre succès. Que vous cherchiez à <strong>gagner en muscle</strong>, à <strong>perdre du poids</strong>, ou à améliorer vos performances sportives, nous avons les solutions adaptées. Faites confiance à notre expertise pour transformer votre passion en résultats concrets. Découvrez dès aujourd’hui pourquoi nous sommes le choix numéro un en <strong>nutrition sportive en Tunisie</strong>.
        </motion.p>
      </Container>
    </motion.div>
  );
};

export default AboutPage;
