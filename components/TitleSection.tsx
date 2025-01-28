import React from 'react'

const TitleSection = ({title}:{title:string}) => {
  return (
    <div className='text-center mb-5 flex items-center justify-center'>
      <h2 className='text-3xl md:text-4xl font-bold text-darkColor uppercase tracking-wide animate-fadeIn'>{title}<span className='text-AccentColor'>.</span></h2>
    </div>
  )
}

export default TitleSection

// Add the following styles in your global CSS file (e.g., globa