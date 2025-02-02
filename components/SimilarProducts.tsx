// components/SimilarProducts.tsx
import ProductCard from "@/components/ProductCard";
import { Produit } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const SimilarProducts = async ({ 
  categoryId, 
  currentProductId 
}: { 
  categoryId: string;
  currentProductId: string;
}) => {
  const SIMILAR_PRODUCTS_QUERY = defineQuery(`
      *[
        _type == "produit" && 
        _id != $currentProductId && 
        $categoryId in categorie[]._ref
      ] | order(_createdAt desc)[0...3] {
        ...,
        images[] { ..., asset-> },
        brand[]-> { ..., image { ..., asset-> } },
        categorie[]-> { _id, name }
      }
    `);

  try {
    const { data: similarProducts } = await sanityFetch({
      query: SIMILAR_PRODUCTS_QUERY,
      params: { 
        categoryId, 
        currentProductId 
      }
    });

    if (!similarProducts?.length) return null;

    return (
      <section className="mt-16 border-t pt-12">
        <h3 className="text-2xl font-bold mb-8">Produits Similaires</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similarProducts
            .filter((product: Produit) => product._id !== currentProductId)
            .slice(0, 4)
            .map((product: Produit) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                isNew={product.Status === "Nouveau"}
              />
            ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading similar products:", error);
    return null;
  }
};

export default SimilarProducts;