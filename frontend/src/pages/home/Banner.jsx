import React from 'react'
import banner from '../../assets/banner.png'
import { HiArrowRight } from 'react-icons/hi2'

export const Banner = () => {
  return (
    <div className='relative py-20 md:py-32 overflow-hidden'>
      {/* Background geometric shapes */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-lime brutal-border brutal-shadow-lg transform rotate-12'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-neon brutal-border brutal-shadow transform -rotate-12'></div>
        <div className='absolute top-1/2 right-1/4 w-32 h-32 bg-accent brutal-border brutal-shadow-sm transform rotate-45'></div>
      </div>

      <div className='flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10'>
        {/* Left Content */}
        <div className='lg:w-1/2 w-full space-y-8'>
          <div className='space-y-4'>
            <div className='inline-block'>
              <span className='bg-accent text-white px-4 py-2 brutal-border brutal-shadow-sm font-bold uppercase text-sm tracking-wider'>
                New This Week
              </span>
            </div>
            <h1 className='text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight'>
              <span className='block text-black'>Discover</span>
              <span className='block text-accent'>Your Next</span>
              <span className='block text-black'>Adventure</span>
            </h1>
          </div>
          
          <p className='text-lg md:text-xl font-bold text-gray-800 max-w-xl leading-relaxed'>
            It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone.
          </p>
          
          <div className='flex flex-wrap gap-4'>
            <button className='brutal-button group'>
              <span className='flex items-center gap-2'>
                Subscribe Now
                <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
              </span>
            </button>
            <button className='brutal-button-secondary group'>
              <span className='flex items-center gap-2'>
                Browse Books
                <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
              </span>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
          <div className='relative'>
            <div className='absolute -top-4 -right-4 w-full h-full bg-primary brutal-border brutal-shadow-lg z-0'></div>
            <div className='relative z-10 brutal-border bg-white p-4 brutal-shadow'>
              <img 
                src={banner} 
                alt="New book releases" 
                className='w-full h-auto object-cover'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className='absolute bottom-10 left-10 hidden md:block'>
        <div className='w-20 h-20 bg-orange brutal-border brutal-shadow-sm transform rotate-45'></div>
      </div>
      <div className='absolute top-20 right-20 hidden lg:block'>
        <div className='w-16 h-16 bg-purple brutal-border brutal-shadow-sm transform -rotate-12'></div>
      </div>
    </div>
  )
}
