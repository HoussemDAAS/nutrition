import React from 'react'
import Title from './Title'

const HomerBanner = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <Title classname='text-3xl md:text-4xl text-center font-bold'>Bienvenue chez Nutrition bizerte</Title>
    <h4 className='text-center text-lg md:text-xl text-lightColor mt-5 font-medium'>Votre partenaire pour une alimentation équilibrée et saine</h4>
    <p className='text-center text-sm md:text-sm text-lightColor/80 mt-2 max-w-[480px] mx-auto '>Découvrez notre large gamme de produits bio, compléments alimentaires, et superaliments pour répondre à vos besoins en nutrition. Améliorez votre bien-être dès aujourd&apos;hui !</p>
    </div>
  )
}

export default HomerBanner
