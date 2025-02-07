import Container from '@/components/Container';

import CategoryProducts from '@/components/CategoryProducts';
import { getAllBrands, getAllCategories,} from '@/helpers/query';
import { notFound } from 'next/navigation';
import React from 'react'
import TitleAcceuil from '@/components/TitleAcceuil';


const CategoriePage = async({params}:{params:Promise<{slug:string}>}) => {
    const { slug } = await params;
    const categorie = await getAllCategories();
    const brands  = await getAllBrands();
  if (!categorie) {
    return notFound();
  }

  return (
    <Container className='py-10'>
      
    <TitleAcceuil title={`Nos ${slug}`} subtitle={''} />
     <CategoryProducts categories={categorie}  slug={slug} brands={brands} />
    </Container>
  )
}

export default CategoriePage
