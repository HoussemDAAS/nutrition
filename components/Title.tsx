import { cn } from '@/lib/utils';
import React from 'react'
interface TitleProps {
    children: React.ReactNode;
    classname?: string;
}
const Title = ({children, classname}:TitleProps) => {
  return (
    <h2 className={cn('text-2xl font-black text-darkColor tracking-wider uppercase', classname)}>{children}</h2>
  )
}

export default Title
