import HeaderMenu from './HeaderMenu';
import Container from './Container';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import Carticon from './Carticon';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBrands, getAllCategories } from '@/helpers/query';

const Header = async () => {
  const categories = await getAllCategories();
  const brands = await getAllBrands();

  return (
    <header className="bg-white  border-b-gray-300 sticky top-0 z-50 shadow-sm">
      {/* Top Row - Logo, Search, Cart */}
      <Container className="flex items-center justify-between py-4 md:py-5">
        {/* Logo - Left */}
        <div className="flex items-center">
          {/* Mobile Menu Button - only on mobile */}
          <div className="mr-4 md:hidden">
            <MobileMenu categories={categories} brands={brands} />
          </div>
          
          <Link href={'/'} className="flex items-center h-14 md:h-16">
            <Image
              src={'/logo.png'}
              alt="logo"
              width={120}
              height={60}
              className="w-[80px] h-auto md:w-[120px]"
              priority
            />
          </Link>
        </div>

        {/* Search Bar - Center (stretching) */}
        <div className="hidden md:flex flex-1 mx-8 max-w-2xl">
          <SearchBar inline />
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-4">
          {/* Mobile Search */}
          <div className="md:hidden">
            <SearchBar />
          </div>
{/*           
          <Carticon /> */}
        </div>
      </Container>

      {/* Bottom Row - Desktop Menu (right aligned) */}
      <div className="hidden md:block  py-3 bg-lightColor">
      <Container className="flex items-center justify-between">
          <HeaderMenu categories={categories} brands={brands} />
          <div className="ml-4">
            <Carticon />
          </div>
        </Container>
      </div>

      {/* Mobile Menu - Bottom Row */}
      <div className="md:hidden  border-gray-200 bg-white">
        <Container>
          <HeaderMenu categories={categories} brands={brands} />
        </Container>
      </div>
    </header>
  );
};

export default Header;