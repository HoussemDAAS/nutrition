import AddToCardButton from "@/components/AddToCardButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCaracteristique from "@/components/ProductCaracteristique";
import { getProductBySlug } from "@/helpers/query";
import { BoxIcon, Heart, ListOrderedIcon, LucideMessageCircleQuestion, Share2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  console.log(slug);
  const product = await getProductBySlug(slug);
  console.log(product);
  if (!product) {
    return notFound();
  }
  return (
    <Container className="py-10 flex flex-col md:flex-row gap-10">
      {product?.images && <ImageView images={product?.images} />}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
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
          <button className=" border-2 border-darkColor/30 text-darkColor/60 px-2.5 py-1.5 rounded-md  hover:bg-darkColor hover:border-darkColor hover:text-white hoverEffect">
            <Heart className="w-5 h-5" />
          </button>
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


      </div>
    </Container>
  );
};

export default SingleProductPage;
