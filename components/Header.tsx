import React from 'react'
import HeaderMenu from './HeaderMenu'
import Logo from './Logo'
import Container from './Container'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import Carticon from './Carticon'
import { currentUser } from '@clerk/nextjs/server'
import { ClerkLoaded, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ListOrdered } from 'lucide-react'

const Header = async() => {
  const user = await currentUser();
  return (
    <header className='bg-white border-b border-b-gray-300 py-4 sticky top-0 z-50 shadow-sm md:py-5'>
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
      <ClerkLoaded>
        <SignedIn>
        <Link href={'/orders'}className='group relative'>
      <ListOrdered className='h-5 w-5 group-hover:text-darkColor hoverEffect'/>
      <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-darkColor text-xs text-white font-semibold'>0</span>
    </Link>
    <UserButton />
        </SignedIn>
      {!user && (<SignInButton mode='modal'>
        <div>
      <button className='text-sm font-semibold hover:text-darkColor hoverEffect'>
        login
      </button>
      </div>
       </SignInButton>)}
      </ClerkLoaded>
      
     
      </div>
      </Container>
      
    </header>
  )
}

export default Header
