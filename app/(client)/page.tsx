import Container from "@/components/Container";
import HomerBanner from "@/components/HomerBanner";
import LogoCarousel from "@/components/LogoCarrousel";
import ProductGrid from "@/components/ProductGrid";
import Scrollableliste from "@/components/ScrollableList";
import Skeleton from "@/components/Skeleton";
import Sliders from "@/components/Slider";
import TitleAcceuil from "@/components/TitleAcceuil";
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
          <TitleAcceuil
            title={"Nos Catégories"}
            subtitle={
              "Ne manquez pas cette opportunité à un tarif spécial uniquement pour cette semaine."
            }
          />
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
          <TitleAcceuil
            title={"Brands populaires"}
            subtitle={
              "Découvrer les marques les plus populaires de la semaine."
            }
          />
        </section>
        <section>
         <LogoCarousel Brands={brands} />
        </section>

        {/* Static Sections */}
        <HomerBanner />
        <ProductGrid />
      </Container>
    </div>
  );
}
