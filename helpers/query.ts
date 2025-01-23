import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity"

export const getProductBySlug = async (slug: string) => {

const PRODUCT_BY_SLUG_Query= defineQuery(`*[_type == 'produit' && slug.current == $slug] | order(nom asc)[0]`);
 try {
    const product = await sanityFetch({
        query: PRODUCT_BY_SLUG_Query,
    params: { slug },});
    return product?.data || null;
 } catch (error) {
    console.error('Error fetching product by slug:', error);
 }
}