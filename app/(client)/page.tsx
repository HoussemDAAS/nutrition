import Container from "@/components/Container";
import Gamme from "@/components/Gamme";
import InfinitePromoBanner from "@/components/InfinitePromoBanner";
import LogoCarousel from "@/components/LogoCarrousel";
import ProductCarousel from "@/components/ProductCarousel";
import Scrollableliste from "@/components/ScrollableList";
import Skeleton from "@/components/Skeleton";
import Sliders from "@/components/Slider";
import TitleSection from "@/components/TitleSection";
import PosterDisplay from "@/components/ui/PosterDisplay";
import ScrollToTop from "@/components/ScrollToTop";
import { getAllBrands, getAllCategories, getAllSlides } from "@/helpers/query";
import { client } from "@/sanity/lib/client";

export default async function Home() {
  // Fetch data in parallel
  const slidersPromise = getAllSlides();
  const categoriesPromise = getAllCategories();
  const brandsPromise = getAllBrands();

  const [sliders, categories, brands] = await Promise.all([
    slidersPromise,
    categoriesPromise,
    brandsPromise,
  ]);

  // Fetch promotional products
  const promoProducts = await client.fetch(
    `*[_type == "produit" && Status == "Promotion"] | order(_createdAt desc)[0...3]`
  );

  return (
    <div>
      {/* Slider Section */}
      <section>
        {sliders.length > 0 ? (
          <Sliders sliders={sliders} />
        ) : (
          <Skeleton className="h-80 w-full bg-gray-200" />
        )}
      </section>

      <Container className="py-10">
        {/* Infinite Promo Banner Section */}
        <section className="mb-10">
          <InfinitePromoBanner products={promoProducts} />
        </section>

        {/* New Products Section */}
        <section className="mb-10">
          <TitleSection title="Nouveau Produits" />
          <ProductCarousel status="Nouveau" />
        </section>

        {/* Categories Section */}
        <section className="mb-10">
          <TitleSection title="Categories" />
          {categories.length > 0 ? (
            <Scrollableliste categories={categories} />
          ) : (
            <div className="flex space-x-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-32 rounded-lg bg-gray-200"
                />
              ))}
            </div>
          )}
        </section>

        {/* Exclusive Packs Section */}
        <section className="mb-10">
          <TitleSection title="Packs Exclusifs" />
          <ProductCarousel variant="Packs Exclusifs" />
        </section>

        {/* Poster Display Section */}
        <section className="mb-10">
          <PosterDisplay />
        </section>

        {/* Gamme Section */}
        <section className="mb-10">
          <TitleSection title="Nos Gammes" />
          <Gamme />
        </section>

        {/* Brands Section */}
        <section className="mb-10">
          <TitleSection title="Marques" />
          {brands.length > 0 ? (
            <LogoCarousel Brands={brands} />
          ) : (
            <div className="flex space-x-4 overflow-hidden animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 w-48 bg-gray-200 rounded-lg" />
              ))}
            </div>
          )}
        </section>
      </Container>

      {/* Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
}
