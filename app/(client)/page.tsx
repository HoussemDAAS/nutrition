import Container from "@/components/Container"
import HomerBanner from "@/components/HomerBanner";
import ProductGrid from "@/components/ProductGrid";


export default function Home() {
  return (
   <div>
    <Container className="py-10">
      <HomerBanner/>
      <ProductGrid/>

    </Container>
  
   </div>
  );
}
