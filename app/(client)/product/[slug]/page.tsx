/* eslint-disable @typescript-eslint/ban-ts-comment */
import AddToCardButton from "@/components/AddToCardButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import Image from "next/image";
import ProductCaracteristique from "@/components/ProductCaracteristique";
import { getProductBySlug } from "@/helpers/query";

import { BoxIcon, ListOrderedIcon, LucideMessageCircleQuestion, Share2Icon } from "lucide-react";
import { notFound } from "next/navigation";
// import React, { useState } from "react";

import { PortableText } from '@portabletext/react'
import SanityImage from "@/components/SanityImage";
import SimilarProducts from "@/components/SimilarProducts";
import FlavorSelector from "@/components/FlavorSelector";
import { Suspense } from "react";
import Loading2 from "@/app/(client)/product/[slug]/loading";
// import ProductVariants from "@/components/ProductVariants";
import { Metadata } from 'next';
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Produit } from "@/sanity.types";

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } =await params;

  const product = await getProductBySlug(slug);

  // SEO Optimized French keywords for Tunisia
  const keywords = [
    'nutrition sportive',
    'compléments alimentaires Tunisie',
    'protéines musculation',
    'achat produits fitness',
    product.nom,
    ...(product.gouts || []),
    'livraison rapide Tunisie',
    'meilleur prix nutrition sportive'
  ];

  return {
    title: `${product.nom} | Nutrition Sportive Tunisie - ${product.brand?.[0]?.name || 'House Protein'}`,
    description: product.intro || `Achetez ${product.nom} en Tunisie - ${product.variantes}. Livraison rapide, prix compétitifs et qualité garantie.`,
    openGraph: {
      type: 'website',
      locale: 'fr_TN',
      siteName: 'Bizerte Nutrition',
      title: product.nom,
      description: product.intro || `Produit de nutrition sportive ${product.nom} disponible en Tunisie`,
      images: product.images?.map((image: SanityImageSource) => ({
        url: urlFor(image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: `${product.nom} - Nutrition Sportive Tunisie`,
      })),
    },
    alternates: {
      canonical: `https://houseprotein.tn/produit/${product.slug.current}`,
    },
    keywords,
    twitter: {
      card: 'summary_large_image',
      site: '@BizerteNutrition',
    },
  };
}

// Add structured data for Google
function ProductStructuredData({ product }: { product: Produit }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nom,
    image: product.images?.map((image: SanityImageSource) => urlFor(image).url()),
    description: product.intro,
    brand: {
      '@type': 'Brand',
      name: product.brand?.[0]?._ref || 'House Protein'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TND',
      price: product.prix,
        // @ts-ignore
        availability: (product?.stock ?? 0) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      
      url: `https://bizerte-nutrition.tn/produit/${product?.slug?.current}`,
      seller: {
        '@type': 'Organization',
        name: 'Bizerte Nutrition',
        url: 'https://bizerte-nutrition.tn'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
const SingleProductPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
    // console.log('Image asset:', product.description.find((item: { _type: string; }) => item._type === 'image')?.asset)
    // const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  if (!product) {
    return notFound();
  }
  return (
  
    <Suspense fallback={<Loading2 />}>
      <ProductStructuredData product={product} />
    <Container className="py-10 flex flex-col gap-8 ">
      <div className="py-10 flex flex-col md:flex-row gap-8 md:gap-12">
      {product?.images && <ImageView images={product?.images} productName={product?.noms}  />}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {product?.nom}
          </h2>
          {product.brand && product.brand[0]?.image && (
            <div className="mb-3">
              <Image
                src={product.brand[0].image.asset.url}
                alt={product.brand[0].name || "Brand logo"}
                width={product.brand[0].image.asset.metadata?.dimensions?.width || 80}
                height={product.brand[0].image.asset.metadata?.dimensions?.height || 40}
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          )}
         <PriceView
            price={product?.prix}
            discount={product?.remise}
            className="text-lg font-bold"
          />
        </div>
        {/* {product.variants && (
          <ProductVariants 
            variants={product.variants}
            onVariantChange={setSelectedVariant}
          />
        )} */}
      
        {product?.stock && (
          <p
            className={`w-fit p-2.5 text-sm text-center font-semibold rounded-lg ${product?.stock === 0 ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"}`}
          >
            {product?.stock === 0 ? "En rupture de stock" : "Disponible"}
          </p>
        )}
        <p className="text-sm text-gray-600 tracking-wide">{product?.intro}</p>
        <div className="flex items-center gap-2.5 lg:gap-5">
        {product.gouts?.length > 0 && <FlavorSelector flavors={product.gouts} />}
          <AddToCardButton
            product={product}
            className="bg-AccentColor/80 text-white  hover:bg-AccentColor hoverEffect border-AccentColor/30 "
          />
          {/* <button className=" border-2 border-darkColor/30 text-darkColor/60 px-2.5 py-1.5 rounded-md  hover:bg-darkColor hover:border-darkColor hover:text-white hoverEffect">
            <Heart className="w-5 h-5" />
          </button> */}
        </div>
        <ProductCaracteristique product={product}/>
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

      </div>
      </div>
      {product.categorie && product.categorie.length > 0 && (
    <div className=" w-full">
      <SimilarProducts 
        categoryId={product.categorie[0]._id} 
        currentProductId={product._id} 
      />
    </div>
  )}
   
    </Container>
  
    </Suspense>
    
  );
};

export default SingleProductPage;

