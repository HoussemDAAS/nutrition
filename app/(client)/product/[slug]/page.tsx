import AddToCardButton from "@/components/AddToCardButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCaracteristique from "@/components/ProductCaracteristique";
import { getProductBySlug } from "@/helpers/query";
import { BoxIcon, ListOrderedIcon, LucideMessageCircleQuestion, Share2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { PortableText } from '@portabletext/react'
import SanityImage from "@/components/SanityImage";
import SimilarProducts from "@/components/SimilarProducts";
import FlavorSelector from "@/components/FlavorSelector";
import BrandImage from "@/components/BrandImage";

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const SingleProductPage = async ({ params,searchParams }: PageProps) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  // Get selected flavor from URL params
  const flavorParam = searchParams && searchParams.flavor ? searchParams.flavor : "";

  const selectedFlavor = Array.isArray(flavorParam) 
    ? flavorParam[0] 
    : flavorParam || product.gouts?.[0] || '';

  return (
    <Container className="py-10 flex flex-col gap-8">
      <div className="py-10 flex flex-col md:flex-row gap-8 md:gap-12">
        {product?.images && (
          <ImageView images={product.images} productName={product.nom} />
        )}

        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {product.nom}
            </h2>
            
            {product.brand?.[0]?.image && (
              <div className="mb-3">
           <BrandImage
                  image={product.brand[0].image}
                  alt={product.brand[0].name || "Brand logo"}
                  width={product.brand[0].image.asset.metadata?.dimensions?.width}
                  height={product.brand[0].image.asset.metadata?.dimensions?.height}
                />
              </div>
            )}

            <PriceView
              price={product.prix}
              discount={product.remise}
              className="text-lg font-bold"
            />
          </div>

          {product.stock !== undefined && (
            <p className={`w-fit p-2.5 text-sm text-center font-semibold rounded-lg ${
              product.stock === 0 ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"
            }`}>
              {product.stock === 0 ? "En rupture de stock" : "Disponible"}
            </p>
          )}

          {product.intro && (
            <p className="text-sm text-gray-600 tracking-wide">{product.intro}</p>
          )}

{product.gouts?.length > 0 && (
            <FlavorSelector
              flavors={product.gouts}
              selectedFlavor={selectedFlavor}
            />
          )}


          <div className="flex items-center gap-2.5 lg:gap-5">
            <AddToCardButton
              product={product}
              selectedFlavor={selectedFlavor}
              className="bg-AccentColor/80 text-white hover:bg-AccentColor hoverEffect border-AccentColor/30"
            />
          </div>

          <ProductCaracteristique product={product} />

          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-gray-200 py-5 -mt-2">
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <BoxIcon  className="w-5 h-5"/>
            <p>Verifier le produit</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <LucideMessageCircleQuestion  className="w-5 h-5"/>
            <p>Ask a question</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <ListOrderedIcon  className="w-5 h-5"/>
            <p>Delivery and return</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <Share2Icon  className="w-5 h-5"/>
            <p>Share</p>
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-5">
  <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue rounded-md hoverEffect flex-1">
    <p className="text-base font-semibold text-darkColor">Livraison gratuite</p>
    <p className="text-sm text-gray-500">Livraison gratuite pour les commandes de plus de 300 TND</p>
  </div>
  <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue rounded-md hoverEffect flex-1">
    <p className="text-base font-semibold text-darkColor">Optimisation nutritionnelle</p>
    <p className="text-sm text-gray-500">Découvrez nos conseils pour une nutrition sportive efficace</p>
  </div>
</div>

          {product.description && (
            <div className="mt-5 border-t border-gray-200 pt-5">
              <h3 className="text-2xl font-bold mb-6 text-darkColor">Description :</h3>
              <div className="prose prose-lg max-w-none text-gray-700">
                <PortableText
                  value={product.description}
                  components={{
                    types: {
                      image: ({ value }) => (
                        <div className="my-8">
                          <SanityImage value={value} />
                        </div>
                      )
                    },
                    block: {
                      h2: ({ children }) => <h2 className="text-xl font-bold my-6 text-darkColor">{children}</h2>,
                      normal: ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-darkColor pl-4 my-6 italic text-gray-600">
                          {children}
                        </blockquote>
                      )
                    },
                    list: {
                      bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                      number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
                    },
                    marks: {
                      strong: ({ children }) => <strong className="font-semibold text-darkColor">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      link: ({ value, children }) => (
                        <a
                          href={value?.href}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      )
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {product.categorie?.length > 0 && (
        <div className="w-full">
          <SimilarProducts 
            categoryId={product.categorie[0]._id} 
            currentProductId={product._id} 
          />
        </div>
      )}
    </Container>
  );
};

export default SingleProductPage;