import AddToCardButton from "@/components/AddToCardButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCaracteristique from "@/components/ProductCaracteristique";
import { getProductBySlug } from "@/helpers/query";
import { BoxIcon, ListOrderedIcon, LucideMessageCircleQuestion, Share2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// Import your Sanity product type

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  
  if (!product) return {};
  
  const mainImage = product.images?.[0] ? urlFor(product.images[0]).width(1200).height(630).url() : '';

  return {
    title: `${product.nom} | Nutrition Hub`,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: product.nom,
      description: product.description?.substring(0, 160),
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: product.nom,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.nom,
      description: product.description?.substring(0, 160),
      images: [mainImage],
    },
  };
}

const SingleProductPage = async ({ params }: { params: { slug: string } }) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nom,
    image: product.images?.map((image: SanityImageSource) => urlFor(image).width(800).url()),
    description: product.description,
    sku: product._id,
    brand: {
      '@type': 'Brand',
      name: 'Nutrition Hub'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.slug}`,
      priceCurrency: 'TND',
      price: product.prix,
      availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
      itemCondition: 'NewCondition'
    }
  };

  return (
    <Container className="py-6 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <ImageView 
          images={product.images || []} 
          productName={product.nom}
          className="w-full md:w-1/2"
        />

        <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-6">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.nom}
            </h1>
            <PriceView
              price={product.prix}
              discount={product.remise}
              className="text-lg md:text-xl"
            />
            <StockStatus stock={product.stock} />
          </header>

          <div className="flex items-center gap-3 justify-center">
            <AddToCardButton
              product={product}
              className="bg-darkColor/80 text-white hover:bg-darkColor hoverEffect"
            />
          </div>

          <ProductCaracteristique product={product} />
          <ServiceFeatures />

          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard 
              title="Livraison gratuite"
              text="Livraison gratuite pour les commandes de plus de 300 TND"
            />
            <InfoCard
              title="Optimisation nutritionnelle"
              text="Conseils experts pour une nutrition sportive efficace"
            />
          </div>

          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Description</h2>
            <div className="prose max-w-none text-gray-600">
              {product.description}
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
};

// Sub-components with proper TypeScript typing
const StockStatus = ({ stock }: { stock?: number }) => (
  <p className={`w-fit px-3 py-1.5 text-sm font-medium rounded-md ${
    stock === 0 
      ? "text-red-600 bg-red-50" 
      : "text-green-600 bg-green-50"
  }`}>
    {stock === 0 ? "En rupture de stock" : "Disponible"}
  </p>
);

const ServiceFeatures = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-gray-200 pb-6">
    {[
      { icon: <BoxIcon className="w-5 h-5" />, text: "Verifier le produit" },
      { icon: <LucideMessageCircleQuestion className="w-5 h-5" />, text: "Poser une question" },
      { icon: <ListOrderedIcon className="w-5 h-5" />, text: "Livraison & Retour" },
      { icon: <Share2Icon className="w-5 h-5" />, text: "Partager" },
    ].map((feature, index) => (
      <button
        key={index}
        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-md transition-colors"
        aria-label={feature.text}
      >
        <span className="text-gray-600">{feature.icon}</span>
        <span className="text-sm text-center font-medium text-gray-700">
          {feature.text}
        </span>
      </button>
    ))}
  </div>
);

interface InfoCardProps {
  title: string;
  text: string;
}

const InfoCard = ({ title, text }: InfoCardProps) => (
  <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);

export default SingleProductPage;