"use client";
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const Loading = () => {
    return (
        <div className='fixed min-h-screen w-full bg-white left-0 top-0 flex items-center justify-center '>
            <div className='flex flex-col justify-center items-center gap-1'>
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.6, ease: 'easeOut'}}
                >
                    <Image
                        src={'/logo.png'}
                        alt="logo"
                        width={100} 
                        height={100}
                        className="w-[100px] h-auto " 
                    />
                </motion.div>
         
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }} 
                    className='flex items-center space-x-2 text-AccentColor'
                >
                    <Loader2 className="w-6 h-6 animate-spin" /> 
                    <span className='text-semibold tracking-wide'> Chargement...</span>
                </motion.div>
            </div>
        </div>
    )
}

export default Loading
