// lib/stockMutations.ts
import { CartItem } from '@/store';
import { createClient } from '@sanity/client';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

export async function updateProductStock(items: CartItem[]) {
  const transaction = writeClient.transaction();
  
  items.forEach(item => {
    transaction.patch(item.product._id, patch => 
      patch.dec({
        stock: item.quantity
      })
    );
  });

  try {
    await transaction.commit();
    return true;
  } catch (error) {
    console.error('Stock update failed:', error);
    return false;
  }
}