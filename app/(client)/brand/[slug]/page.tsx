import Container from '@/components/Container';


import { getAllBrands} from '@/helpers/query';
import { notFound } from 'next/navigation';
import React from 'react'
import BrandProducts from '@/components/Brandproduct';
import TitleAcceuil from '@/components/TitleAcceuil';

const BrandPage = async({params}:{params:Promise<{slug:string}>}) => {
    const { slug } = await params;
    const brand = await getAllBrands();

  if (!brand) {
    return notFound();
  }

  return (
    <Container className='py-10'>
     <TitleAcceuil title={`la Marque  ${slug}`} subtitle={''} />
     <BrandProducts brands={brand}  slug={slug}/>
    </Container>
  )
}

export default BrandPage
