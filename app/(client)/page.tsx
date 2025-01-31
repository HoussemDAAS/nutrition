import Container from "@/components/Container";
import InfinitePromoBanner from "@/components/InfinitePromoBanner";
import LogoCarousel from "@/components/LogoCarrousel";
import ProductCarousel from "@/components/ProductCarousel";
import Scrollableliste from "@/components/ScrollableList";
import Skeleton from "@/components/Skeleton";
import Sliders from "@/components/Slider";
import TitleSection from "@/components/TitleSection";
import PosterDisplay from "@/components/ui/PosterDisplay";
import { getAllBrands, getAllCategories, getAllSlides } from "@/helpers/query";

export default async function Home() {
  const slidersPromise = getAllSlides();
  const categoriesPromise = getAllCategories();
  const brandsPromise = getAllBrands();

  const [sliders, categories, brands] = await Promise.all([slidersPromise, categoriesPromise, brandsPromise]);

  return (
    <div>
      <section>
        {sliders.length > 0 ? (
          <Sliders sliders={sliders} />
        ) : (
          <Skeleton className="h-80 w-full bg-gray-200" />
        )}
      </section>

      <Container className="py-10">
   
        <section>
          <TitleSection title={"Nouveau Produits"} />
        </section>
        <InfinitePromoBanner />
        <section>
          <ProductCarousel status="Nouveau" />
        </section>
        
        <section>
          <TitleSection title={"Categories"} />
        </section>

        <section>
          {categories.length > 0 ? (
            <Scrollableliste categories={categories} />
          ) : (
            <div className="flex space-x-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-32 rounded-lg bg-gray-200" />
              ))}
            </div>
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
    </div>
  );
}