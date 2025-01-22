import { productType } from '@/constants';
import { Repeat } from 'lucide-react';
import React from 'react';

interface HomeTapbarProps {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTapbar = ({selectedTab, onTabSelect}: HomeTapbarProps) => {
  return (
    <div className='flex flex-col items-center gap-2 text-sm font-semibold md:flex-row md:justify-center md:gap-4'>
      <div className='flex flex-wrap justify-center gap-2'>
        {productType?.map((item, index) => (
          <button 
            key={index} 
            onClick={() => onTabSelect(item?.value)} 
            className={`border border-darkColor px-4 py-1.5 md:px-6 md:py-2.5 rounded-full 
            hover:bg-darkColor hover:text-white hoverEffect ${selectedTab === item.value && "bg-darkColor text-white"}`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <button className='border border-darkColor p-2 rounded-full hover:bg-darkColor hover:text-white hoverEffect'>
        <Repeat className='w-5 h-5'/>
      </button>
    </div>
  );
}

export default HomeTapbar;
