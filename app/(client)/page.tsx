import Container from "@/components/Container";
import Gamme from "@/components/Gamme";
import LogoCarousel from "@/components/LogoCarrousel";
import ProductCarousel from "@/components/ProductCarousel";
import Scrollableliste from "@/components/ScrollableList";
import Skeleton from "@/components/Skeleton";
import Sliders from "@/components/Slider";
import TitleSection from "@/components/TitleSection";
import ScrollToTop from "@/components/ScrollToTop";
import { getAllBrands, getAllCategories, getAllSlides } from "@/helpers/query";
import ProductCarousel3D from "@/components/ProductCarousel3D";
import { Suspense } from "react";

// Skeleton component for carousels
const CarouselSkeleton = () => (
  <div className="flex gap-4 overflow-hidden py-4">
    {[...Array(4)].map((_, i) => (
      <Skeleton
        key={i}
        className="h-[400px] w-[300px] rounded-xl bg-gray-200"
      />
    ))}
  </div>
);

export default async function Home() {
  // Fetch data in parallel
  const [sliders, categories, brands] = await Promise.all([
    getAllSlides(),
    getAllCategories(),
    getAllBrands(),
  ]);

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
        {/* Promo Section */}
        <section className="mb-10">
          <TitleSection title="Nos Promo" />
          <Suspense fallback={<CarouselSkeleton />}>
            <ProductCarousel3D status="Promotion" />
          </Suspense>
        </section>

        {/* Categories Section */}
        <section className="mb-10">
          <TitleSection title="Categories" />
          {categories.length > 0 ? (
            <Scrollableliste categories={categories} />
          ) : (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-32 rounded-lg bg-gray-200"
                />
              ))}
            </div>
          )}
        </section>

        {/* New Products Section */}
        <section className="mb-10">
          <TitleSection title="Nouveau Produits" />
          <Suspense fallback={<CarouselSkeleton />}>
            <ProductCarousel3D status="Nouveau" />
          </Suspense>
        </section>

        {/* Exclusive Packs Section */}
        <section className="mb-10">
          <TitleSection title="Packs Exclusifs" />
          <Suspense fallback={<CarouselSkeleton />}>
            <ProductCarousel3D variant="Packs Exclusifs" />
          </Suspense>
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
            <div className="flex gap-4 overflow-hidden animate-pulse">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-48 bg-gray-200 rounded-lg"
                />
              ))}
            </div>
          )}
        </section>
      </Container>

      <ScrollToTop />
    </div>
  );
}