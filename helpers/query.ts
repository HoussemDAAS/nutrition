import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity"

export const getProductBySlug = async (slug: string) => {
   const PRODUCT_BY_SLUG_Query = defineQuery(`
     *[_type == "produit" && slug.current == $slug][0] {
       ...,
       gouts,
       description[] {
    ...,
    _type == "image" => {
      ...,
      asset-> {
        ...,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  },
       images[] { ..., asset-> },
       categorie[]-> { _id, name, "slug": slug.current },
       brand[]-> { 
         _id, 
         name, 
         "slug": slug.current,
         image { ..., asset-> } 
       },
       "slug": slug.current
     }
   `);
 
   try {
     const result = await sanityFetch({ query: PRODUCT_BY_SLUG_Query, params: { slug } });
     return result?.data || null;
   } catch (error) {
     console.error('Error fetching product:', error);
     return null;
   }
 };
export const getProductCategorieBySlug = async (slug: string) => {
   const CATEGORIE_BY_SLUG_QUERY=defineQuery(`*[_type == 'categorie' && slug.current == $slug] | order(nom asc)[0]`);
   try {
      
      const categorie = await sanityFetch({
          query: CATEGORIE_BY_SLUG_QUERY,
      params: { slug },});
      return categorie?.data || null;
  
   } catch (error) {
      console.log("error fetching categorie product by slug", error);
   }
}
export const getAllCategories = async () => {
const CATEGORIES_QUERY=defineQuery(`*[_type == 'category'] | order(title asc)`);

try {
   
const categories = await sanityFetch({
    query: CATEGORIES_QUERY,
});
return categories?.data || [];
} catch (error) {
   
console.log(error);
return [];
}


}
export const getAllBrands = async () => {
   const CATEGORIES_QUERY=defineQuery(`*[_type == 'brand'] | order(title asc)`);
   
   try {
      
   const categories = await sanityFetch({
       query: CATEGORIES_QUERY,
   });
   return categories?.data || [];
   } catch (error) {
      
   console.log(error);
   return [];
   }
   
   
   }

   export const getPromotionProducts = async () => {
      const PROMOTION_QUERY = defineQuery(`
       *[_type == 'produit' && variantes == "Promotion"] | order(nom asc)
      `);
    
      try {
        const products = await sanityFetch({
          query: PROMOTION_QUERY,
        });
        return products?.data || [];
      } catch (error) {
        console.error('Error fetching promotion products:', error);
        return [];
      }
    }
   export const getAllSlides = async () => {
      const CATEGORIES_QUERY=defineQuery(`*[_type == 'slider'] | order(title asc)`);
      
      try {
         
      const categories = await sanityFetch({
          query: CATEGORIES_QUERY,
      });
      return categories?.data || [];
      } catch (error) {
         
      console.log(error);
      return [];
      }
      
      
      }