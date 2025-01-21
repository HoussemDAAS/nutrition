import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
interface LogoProps {
  children?: React.ReactNode
  className?: string
}
const Logo = ({ children, className}:LogoProps) => {
  return (
    <Link href={'/'}>
      <h2 className={cn('text-2xl font-black text-darkColor tracking-wider uppercase', className)}>{children}</h2>
    </Link>
  )
}

export default Logo
