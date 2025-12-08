import React from 'react'
import { Banner } from './Banner.jsx'
import { TopSellers } from './TopSellers.jsx'
import { Recommended } from './Recommended.jsx'
import { News } from './News.jsx'

const Home = () => {
  return (
    <div className='bg-white'>
        <section className='relative'>
          <Banner/>
        </section>

        <section className='py-16 md:py-24 relative'>
          <div className='absolute top-0 left-0 w-full h-2 bg-black'></div>
          <TopSellers/>
        </section>

        <section className='py-16 md:py-24 relative bg-lime/10'>
          <div className='absolute top-0 left-0 w-full h-2 bg-black'></div>
          <Recommended/>
        </section>

        <section className='py-16 md:py-24 relative'>
          <div className='absolute top-0 left-0 w-full h-2 bg-black'></div>
          <News/>
        </section>
    </div>
  )
}
export default Home;