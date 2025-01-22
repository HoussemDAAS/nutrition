/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from 'react'
import HomeTapbar from './HomeTapbar'
import { productType } from '@/constants';
import { set } from 'sanity';
import { client } from '@/sanity/lib/client';

const ProductGrid = () => {
    const [selectedTab, setSelectedTab] = React.useState(productType?.[0]?.value || '');
    const [products, setProducts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
      
    const query =`*[_type == 'produit' && variantes == $variant] | order(_createdAt desc) `
    const params={variant: selectedTab};
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try{
           const response = await client.fetch(query, params);
           setProducts(await response);
        }catch(error){
          console.error(error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);
  return (
    <div className='mt-10 flex flex-col items-center'>
      <HomeTapbar selectedTab={selectedTab} onTabSelect={setSelectedTab}/>
    </div>
  )
}

export default ProductGrid
