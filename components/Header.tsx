import React from 'react'
import HeaderMenu from './HeaderMenu'
import Logo from './Logo'
import Container from './Container'

const Header = () => {
  return (
    <header className='bg-white border-b border-b-gray-400 py-4'>
      {/* Header left */}
      <Container className='flex items-center justify-between gap-7 text-lightColor'>
      <HeaderMenu />
      <Logo />
      <div>right</div>
      </Container>
      
    </header>
  )
}

export default Header
