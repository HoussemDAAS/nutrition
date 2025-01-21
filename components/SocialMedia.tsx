import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SocialMediaProps {
    className?: string;
    iconClassName?: string;
    tooltipClassName?: string;
  }
const SocialMedia: React.FC<SocialMediaProps> = ({className, iconClassName, tooltipClassName}) => {
    const socialMediaData = [
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/',
            icon: <Instagram className={cn('w-6 h-6', iconClassName)} />,
        },
        {
            name: 'Twitter',
            href: 'https://www.twitter.com/',
            icon: <Twitter className={cn('w-6 h-6', iconClassName)} />,
        },
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/',
            icon: <Facebook className={cn('w-6 h-6', iconClassName)} />,}
    ];
  return (
    <TooltipProvider>
        <div className={cn('flex items-center gap-3.5', className)}>
            {socialMediaData.map((social) => (
                <Tooltip key={social.name}>
                    <TooltipTrigger asChild>
                        <Link className='p-2 border rounded-full hover:text-white hover:border-white hoverEffect' href={social.href} target='_blank' rel='noopener noreferrer'>
                            {social.icon}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent className={cn('bg-white text-darkColor font-semibold', tooltipClassName)}>
                        {social.name}
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    </TooltipProvider>
  )
}

export default SocialMedia
