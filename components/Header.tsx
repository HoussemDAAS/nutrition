import HeaderMenu from './HeaderMenu';
import Container from './Container';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import Carticon from './Carticon';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBrands, getAllCategories } from '@/helpers/query'; // Ensure correct import

const Header = async () => {
  // Fetch categories data
  const categories = await getAllCategories();
  const brands = await getAllBrands();

  return (
    <header className="bg-white border-b border-b-gray-300 py-4 sticky top-0 z-50 shadow-sm md:py-5">
      <Container className="flex items-center justify-between gap-7 text-lightColor">
        {/* Left Section */}
        <div className="w-auto md:w-1/3 flex items-center justify-start">
          {/* Mobile: show MobileMenu */}
          <div className="md:hidden">
            <MobileMenu categories={categories} brands={brands} />
          </div>
          {/* Desktop: show full header menu */}
          <div className="hidden md:block">
            <HeaderMenu categories={categories} brands={brands} />
          </div>
        </div>

        {/* Center Section: Logo centered */}
        <div className="w-auto md:w-1/3 flex items-center justify-center">
          <Link href={'/'} className="flex items-center justify-center h-14 md:h-16">
            <Image
              src={'/logo.png'}
              alt="logo"
              width={100} 
              height={100}
              className="w-[80px] h-auto md:w-[120px]" 
            />
          </Link>
        </div>

        {/* Right Section */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          {/* On mobile, hide SearchBar */}
        
            <SearchBar />
     
          <Carticon />
        </div>
      </Container>
    </header>
  );
};

export default Header;
