import { Suspense } from 'react';
import Container from '@/components/Container';
import TitleAcceuil from '@/components/TitleAcceuil';
import PromotionProducts from '@/components/PromotionProducts';
import Loading from '@/components/Loading';
import { getPromotionProducts } from '@/helpers/query';

// Add this export to opt-out of static rendering
export const dynamic = 'force-dynamic';

const PromotionPage = async () => {
  const products = await getPromotionProducts();

  return (
    <Container className='py-10'>
      <TitleAcceuil 
        title="Promotions en cours" 
        subtitle="Découvrez nos offres spéciales et économisez sur vos produits préférés" 
      />
      <Suspense fallback={<Loading />}>
        <PromotionProducts products={products} />
      </Suspense>
    </Container>
  )
}

export default PromotionPage;