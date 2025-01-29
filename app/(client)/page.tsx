import Container from "@/components/Container";
// import HomerBanner from "@/components/HomerBanner";
import LogoCarousel from "@/components/LogoCarrousel";
import ProductCarousel from "@/components/ProductCarousel";
// import ProductGrid from "@/components/ProductGrid";
import Scrollableliste from "@/components/ScrollableList";
import Skeleton from "@/components/Skeleton";
import Sliders from "@/components/Slider";
import TitleSection from "@/components/TitleSection";
import PosterDisplay from "@/components/ui/PosterDisplay";
 // Reusable skeleton loader

import { getAllBrands, getAllCategories, getAllSlides } from "@/helpers/query";

export default async function Home() {
  // Fetch data concurrently
  const slidersPromise = getAllSlides();
  const categoriesPromise = getAllCategories();
  const brandsPromise = getAllBrands();

  const [sliders, categories, brands] = await Promise.all([slidersPromise, categoriesPromise, brandsPromise]);

  return (
    <div>
      {/* Sliders Section */}
      <section>
        {sliders.length > 0 ? (
          <Sliders sliders={sliders} />
        ) : (
          <Skeleton className="h-80 w-full bg-gray-200" />
        )}
      </section>

      <Container className="py-10">
        {/* Title Section */}
        <section>
         <TitleSection title={"Nouveau Produits"} />
          
        </section>
        <section>
       <ProductCarousel status="Nouveau"  />
        </section>
        <section>
         <TitleSection title={"Categories"} />
          
        </section>

        {/* Scrollable List Section */}
        <section>
          {categories.length > 0 ? (
            <Scrollableliste categories={categories} />
          ) : (
            <Skeleton className="h-100 w-full bg-gray-500" />
          )}
        </section>
        <section>
        <TitleSection title={"Packs Exclusifs"} />
        </section>
        <section>
       <ProductCarousel variant={"Packs Exclusifs"} />
        </section>
        <section>
        <TitleSection title={"Promotion"} />
        </section>
      <PosterDisplay />
        <section>
        <TitleSection title={"Marques"} />
        </section>
        <section>
         <LogoCarousel Brands={brands} />
        </section>
      </Container>
    </div>
  );
}
