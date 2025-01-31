import Container from '@/components/Container';

import CategoryProducts from '@/components/CategoryProducts';
import { getAllCategories,} from '@/helpers/query';
import { notFound } from 'next/navigation';
import React from 'react'
import TitleAcceuil from '@/components/TitleAcceuil';


const CategoriePage = async({params}:{params:Promise<{slug:string}>}) => {
    const { slug } = await params;
    const categorie = await getAllCategories();

  if (!categorie) {
    return notFound();
  }

  return (
    <Container className='py-10'>
      
    <TitleAcceuil title={`Nos ${slug}`} subtitle={''} />
     <CategoryProducts categories={categorie}  slug={slug}/>
    </Container>
  )
}

export default CategoriePage
