import Container from "@/components/Container";
import HomerBanner from "@/components/HomerBanner";
import ProductGrid from "@/components/ProductGrid";
import Scrollableliste from "@/components/ScrollableList";
import Skeleton from "@/components/Skeleton";
import Sliders from "@/components/Slider";
import TitleAcceuil from "@/components/TitleAcceuil";
 // Reusable skeleton loader

import { getAllCategories, getAllSlides } from "@/helpers/query";

export default async function Home() {
  // Fetch data concurrently
  const slidersPromise = getAllSlides();
  const categoriesPromise = getAllCategories();

  const [sliders, categories] = await Promise.all([slidersPromise, categoriesPromise]);

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

        {/* Static Sections */}
        <HomerBanner />
        <ProductGrid />
      </Container>
    </div>
  );
}
