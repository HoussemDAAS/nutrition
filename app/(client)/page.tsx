import Container from "@/components/Container"
import HomerBanner from "@/components/HomerBanner";
import ProductGrid from "@/components/ProductGrid";
import Scrollableliste from "@/components/ScrollableList";
import Sliders from "@/components/Slider";
import TitleAcceuil from "@/components/TitleAcceuil";

import {  getAllCategories, getAllSlides } from "@/helpers/query";


export default async  function Home (){
    const sliders = await getAllSlides();
    const categories = await getAllCategories();
  return (
   <div>
      <Sliders sliders={sliders}/>

    <Container className="py-10">
      <TitleAcceuil title={"Nos Brands"} subtitle={"Découvrez nos marques sélectionnées pour répondre aux besoins des passionnés de fitness et de nutrition sportive."} />
      <Scrollableliste categories={categories}/>
      <HomerBanner/>
      <ProductGrid/>

    </Container>
  
   </div>
  );
}
