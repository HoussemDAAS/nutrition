import { productType } from '@/constants';
import { Repeat } from 'lucide-react';
import React from 'react'
interface HomeTapbarProps {
    selectedTab: string;
    onTabSelect: (tab: string) => void;
}
const HomeTapbar = ({selectedTab, onTabSelect}:HomeTapbarProps) => {
  return (
    <div className='flex justify-center gap-1.5 text-sm font-semibold'>
      <div className='flex gap-1.5 items-center'>
        {productType?.map((item, index) => (
            <button key={index} onClick={() => onTabSelect(item?.value)} className={`border border-darkColor px-4 py-1.5 md:px-6 md:py-2.5 rounded-full 
            hover:bg-darkColor hover:text-white hoverEffect  ${selectedTab === item.value &&"bg-darkColor text-white " }`} >
                {item.title}
            </button>
            ))}
      </div>
      <button className={`border border-darkColor p-2 rounded-full 
            hover:bg-darkColor hover:text-white hoverEffect`}>

      <Repeat className='w-5 h-5'/>
      </button>
    </div>
  )
}

export default HomeTapbar
