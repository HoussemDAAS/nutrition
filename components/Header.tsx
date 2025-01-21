import React from 'react'
import HeaderMenu from './HeaderMenu'
import Logo from './Logo'
import Container from './Container'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import Carticon from './Carticon'

const Header = () => {
  return (
    <header className='bg-white border-b border-b-gray-300 py-4'>
      {/* Header left */}
      <Container className='flex items-center justify-between gap-7 text-lightColor'>
      <HeaderMenu />
      <div className='w-auto md:w-1/3 flex justify-center items-center gap-3'>
     <MobileMenu />
      <Logo className='italic'>Nutrition</Logo>
      </div>
      <div className='w-auto md:w-1/3 flex items-center justify-end gap-5'>
      <SearchBar />
      <Carticon />
      <div className='text-sm font-semibold hover:text-darkColor hoverEffect'>
        login
      </div>
      </div>
      </Container>
      
    </header>
  )
}

export default Header
