import Container from '@/components/Container';
import Title from '@/components/Title';

import { getAllBrands} from '@/helpers/query';
import { notFound } from 'next/navigation';
import React from 'react'
import BrandProducts from '@/components/Brandproduct';

const BrandPage = async({params}:{params:Promise<{slug:string}>}) => {
    const { slug } = await params;
    const brand = await getAllBrands();

  if (!brand) {
    return notFound();
  }

  return (
    <Container className='py-10'>
     <Title classname='text-xl'>
      Découvrez nos <span className='text-AccentColor capitalize tracking-wide'>{slug} </span>
     </Title>
     <BrandProducts brands={brand}  slug={slug}/>
    </Container>
  )
}

export default BrandPage
