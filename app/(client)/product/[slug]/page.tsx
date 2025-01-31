import AddToCardButton from "@/components/AddToCardButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCaracteristique from "@/components/ProductCaracteristique";
import { getProductBySlug } from "@/helpers/query";
import { BoxIcon, ListOrderedIcon, LucideMessageCircleQuestion, Share2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
    const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }
  return (
    <Container className="py-10 flex flex-col md:flex-row gap-8 md:gap-12">
      {product?.images && <ImageView images={product?.images} />}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {product?.nom}
          </h2>
          <PriceView
            price={product?.prix}
            discount={product?.remise}
            className="text-lg font-bold"
          />
        </div>
        {product?.stock && (
          <p
            className={`w-fit p-2.5 text-sm text-center font-semibold rounded-lg ${product?.stock === 0 ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"}`}
          >
            {product?.stock === 0 ? "En rupture de stock" : "Disponible"}
          </p>
        )}
        <p className="text-sm text-gray-600 tracking-wide">{product?.intro}</p>
        <div className="flex items-center gap-2.5 lg:gap-5">
          <AddToCardButton
            product={product}
            className="bg-darkColor/80 text-white  hover:bg-darkColor hoverEffect"
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
<div className="mt-5 border-t border-gray-200 pt-5 text-sm space-y-2">
  <h3 className="text-xl font-semibold mt-5">Description :</h3>
  <p className="text-sm text-gray-600">{product?.description}</p>
</div>


      </div>
    </Container>
  );
};

export default SingleProductPage;


// import AddToCardButton from "@/components/AddToCardButton";
// import Container from "@/components/Container";
// import ImageView from "@/components/ImageView";
// import PriceView from "@/components/PriceView";
// import ProductCaracteristique from "@/components/ProductCaracteristique";
// import { getProductBySlug } from "@/helpers/query";
// import { BoxIcon, ListOrderedIcon, LucideMessageCircleQuestion, Share2Icon } from "lucide-react";
// import { notFound } from "next/navigation";

// // import { urlFor } from "@/sanity/lib/image";
// // import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// // export async function generateMetadata({
// //   params,
// // }: {
// //   params: { slug: string };
// // }): Promise<Metadata> {
// //   // Properly await params first
// //   const { slug } = await params;
// //   const product = await getProductBySlug(slug);
  
// //   if (!product) return {
// //     title: "Produit non trouvé | Nutrition Hub",
// //     description: "Produit non disponible"
// //   };

// //   const mainImage = product.images?.[0] 
// //     ? urlFor(product.images[0]).width(1200).height(630).url() 
// //     : '/default-product-image.jpg';

// //   return {
// //     title: `${product.nom} | Nutrition Hub`,
// //     description: product.description?.substring(0, 160) || 'Découvrez ce produit de qualité supérieure',
// //     openGraph: {
// //       title: product.nom,
// //       description: product.description?.substring(0, 160) || 'Découvrez ce produit de qualité supérieure',
// //       images: [
// //         {
// //           url: mainImage,
// //           width: 1200,
// //           height: 630,
// //           alt: product.nom,
// //         },
// //       ],
// //     },
// //     twitter: {
// //       card: 'summary_large_image',
// //       title: product.nom,
// //       description: product.description?.substring(0, 160) || 'Découvrez ce produit de qualité supérieure',
// //       images: [mainImage],
// //     },
// //   };
// // }

// const SingleProductPage = async ({ params }: { params: { slug: string } }) => {
//   // Properly await params first

//   const { slug } = params;
//   const product = await getProductBySlug(slug);

//   if (!product) {
//     return notFound();
//   }

//   // // Structured data for SEO
//   // const jsonLd = {
//   //   '@context': 'https://schema.org',
//   //   '@type': 'Product',
//   //   name: product.nom,
//   //   image: product.images?.map((image: SanityImageSource) => urlFor(image).width(800).url()),
//   //   description: product.description,
//   //   sku: product._id,
//   //   brand: {
//   //     '@type': 'Brand',
//   //     name: 'Nutrition Hub'
//   //   },
//   //   offers: {
//   //     '@type': 'Offer',
//   //     url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.slug}`, // Use destructured slug
//   //     priceCurrency: 'TND',
//   //     price: product.prix,
//   //     availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
//   //     itemCondition: 'NewCondition'
//   //   }
//   // };

//   return (
//     <Container className="py-6 md:py-10">
//       {/* <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       /> */}
      
//       <div className="flex flex-col md:flex-row gap-6 md:gap-10">
//         <ImageView 
//           images={product.images || []} 
//           productName={product.nom}
//           className="w-full md:w-1/2"
//         />

//         <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-6">
//           <header className="space-y-2">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//               {product.nom}
//             </h1>
//             <PriceView
//               price={product.prix}
//               discount={product.remise}
//               className="text-lg md:text-xl"
//             />
//             <StockStatus stock={product.stock} />
//           </header>

//           <div className="flex items-center gap-3 justify-center">
//             <AddToCardButton
//               product={product}
//               className="bg-darkColor/80 text-white hover:bg-darkColor hoverEffect"
//             />
//           </div>

//           <ProductCaracteristique product={product} />
//           <ServiceFeatures />

//           <div className="grid md:grid-cols-2 gap-4">
//             <InfoCard 
//               title="Livraison gratuite"
//               text="Livraison gratuite pour les commandes de plus de 300 TND"
//             />
//             <InfoCard
//               title="Optimisation nutritionnelle"
//               text="Conseils experts pour une nutrition sportive efficace"
//             />
//           </div>

//           <section className="border-t border-gray-200 pt-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900">Description</h2>
//             <div className="prose max-w-none text-gray-600">
//               {product.description}
//             </div>
//           </section>
//         </div>
//       </div>
//     </Container>
//   );
// };

// // Sub-components with proper TypeScript typing
// const StockStatus = ({ stock }: { stock?: number }) => (
//   <p className={`w-fit px-3 py-1.5 text-sm font-medium rounded-md ${
//     stock === 0 
//       ? "text-red-600 bg-red-50" 
//       : "text-green-600 bg-green-50"
//   }`}>
//     {stock === 0 ? "En rupture de stock" : "Disponible"}
//   </p>
// );

// const ServiceFeatures = () => (
//   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-gray-200 pb-6">
//     {[
//       { icon: <BoxIcon className="w-5 h-5" />, text: "Verifier le produit" },
//       { icon: <LucideMessageCircleQuestion className="w-5 h-5" />, text: "Poser une question" },
//       { icon: <ListOrderedIcon className="w-5 h-5" />, text: "Livraison & Retour" },
//       { icon: <Share2Icon className="w-5 h-5" />, text: "Partager" },
//     ].map((feature, index) => (
//       <button
//         key={index}
//         className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-md transition-colors"
//         aria-label={feature.text}
//       >
//         <span className="text-gray-600">{feature.icon}</span>
//         <span className="text-sm text-center font-medium text-gray-700">
//           {feature.text}
//         </span>
//       </button>
//     ))}
//   </div>
// );

// interface InfoCardProps {
//   title: string;
//   text: string;
// }

// const InfoCard = ({ title, text }: InfoCardProps) => (
//   <div className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
//     <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
//     <p className="text-sm text-gray-600">{text}</p>
//   </div>
// );

// export default SingleProductPage;