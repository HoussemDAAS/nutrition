import Container from '@/components/Container';
import Title from '@/components/Title';
import CategoryProducts from '@/components/CategoryProducts';
import { getAllCategories,} from '@/helpers/query';
import { notFound } from 'next/navigation';
import React from 'react'


const CategoriePage = async({params}:{params:Promise<{slug:string}>}) => {
    const { slug } = await params;
    const categorie = await getAllCategories();

  if (!categorie) {
    return notFound();
  }

  return (
    <Container className='py-10'>
      
     <Title classname='text-xl'>
      Découvrez nos <span className='text-AccentColor capitalize tracking-wide'>{slug} </span>
     </Title>
     <CategoryProducts categories={categorie}  slug={slug}/>
    </Container>
  )
}

export default CategoriePage
