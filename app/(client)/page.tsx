import Container from "@/components/Container"
import HomerBanner from "@/components/HomerBanner";
import ProductGrid from "@/components/ProductGrid";
import Sliders from "@/components/Slider";
import {  getAllSlides } from "@/helpers/query";


export default async  function Home (){
    const sliders = await getAllSlides();
  return (
   <div>
      <Sliders sliders={sliders}/>
    <Container className="py-10">
    
      <HomerBanner/>
      <ProductGrid/>

    </Container>
  
   </div>
  );
}
