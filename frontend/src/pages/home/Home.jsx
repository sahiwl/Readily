import React from 'react'
import { Banner } from './Banner.jsx'
import { TopSellers } from './TopSellers.jsx'
import { Recommended } from './Recommended.jsx'
import { News } from './News.jsx'

const Home = () => {
  return (
    <div>
        <Banner/>
        <TopSellers/>
        <Recommended/>
        <News/>
    </div>
  )
}
export default Home;