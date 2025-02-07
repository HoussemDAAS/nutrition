import Container from '@/components/Container';


import { getAllBrands, getAllCategories} from '@/helpers/query';
import { notFound } from 'next/navigation';
import React from 'react'
import BrandProducts from '@/components/Brandproduct';
import TitleAcceuil from '@/components/TitleAcceuil';

const BrandPage = async({params}:{params:Promise<{slug:string}>}) => {
  const { slug } = await params;
  const brands = await getAllBrands();
  const categories = await getAllCategories(); // Add categories fetch

  if (!brands) return notFound();

  return (
    <Container className='py-10'>
      <TitleAcceuil title={`la Marque ${slug}`} subtitle={''} />
      <BrandProducts 
        brands={brands} 
        categories={categories} // Pass categories to component
        slug={slug}
      />
    </Container>
  )
}

export default BrandPage
