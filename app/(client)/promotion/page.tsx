// app/promotions/page.tsx
import { Suspense } from 'react';
import Container from '@/components/Container';
import TitleAcceuil from '@/components/TitleAcceuil';
import PromotionProducts from '@/components/PromotionProducts';
import Loading from '@/components/Loading';
import { getPromotionProducts, getAllCategories } from '@/helpers/query';

export const dynamic = 'force-dynamic';

const PromotionPage = async () => {
  const [products, categories] = await Promise.all([
    getPromotionProducts(),
    getAllCategories()
  ]);

  return (
    <Container className='py-10'>
      <TitleAcceuil 
        title="Promotions en cours" 
        subtitle="Découvrez nos offres spéciales et économisez sur vos produits préférés" 
      />
      <Suspense fallback={<Loading />}>
        <PromotionProducts products={products} categories={categories} />
      </Suspense>
    </Container>
  )
}

export default PromotionPage;