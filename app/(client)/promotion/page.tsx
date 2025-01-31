import Container from '@/components/Container';

import { getPromotionProducts } from '@/helpers/query';
import React from 'react'
import TitleAcceuil from '@/components/TitleAcceuil';
import PromotionProducts from '@/components/PromotionProducts';

const PromotionPage = async () => {
  const products = await getPromotionProducts();

  return (
    <Container className='py-10'>
      <TitleAcceuil 
        title="Promotions en cours" 
        subtitle="Découvrez nos offres spéciales et économisez sur vos produits préférés" 
      />
      <PromotionProducts products={products} />
    </Container>
  )
}

export default PromotionPage