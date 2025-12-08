import React from 'react'
import news1 from '../../assets/news/news-1.png'
import news2 from '../../assets/news/news-2.png'
import news3 from '../../assets/news/news-3.png'
import news4 from '../../assets/news/news-4.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom'


const news = [
    {
        "id": 1,
        "title": "Global Climate Summit Calls for Urgent Action",
        "description": "World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.",
        "image": news1
    },
    {
        "id": 2,
        "title": "Breakthrough in AI Technology Announced",
        "description": "A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.",
        "image": news2
    },
    {
        "id": 3,
        "title": "New Space Mission Aims to Explore Distant Galaxies",
        "description": "NASA has unveiled plans for a new space mission that will aim to explore distant galaxies, with hopes of uncovering insights into the origins of the universe.",
        "image": news3
    },
    {
        "id": 4,
        "title": "Stock Markets Reach Record Highs Amid Economic Recovery",
        "description": "Global stock markets have reached record highs as signs of economic recovery continue to emerge following the challenges posed by the global pandemic.",
        "image": news4
    },
    {
        "id": 5,
        "title": "Innovative New Smartphone Released by Leading Tech Company",
        "description": "A leading tech company has released its latest smartphone model, featuring cutting-edge technology, improved battery life, and a sleek new design.",
        "image": news2
    }
]
export const News = () => {
  return (
    <div className='py-16'>
        <h2 className='text-4xl md:text-5xl font-black uppercase tracking-tight mb-8'>
          <span className='text-black'>Latest</span>{' '}
          <span className='text-orange'>News</span>
        </h2>
        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {news.map((item,index)=>(
            <SwiperSlide key={index}>
                <div className="brutal-card bg-white group">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-6">

                      <div className="flex-1 space-y-4">
                          <Link to="/">
                            <h3 className='text-xl font-black uppercase tracking-tight hover:text-accent transition-colors mb-2'>
                              {item.title}
                            </h3>
                          </Link>
                          <div className="w-16 h-1 bg-primary"></div>
                          <p className='text-sm font-bold text-gray-800 leading-relaxed'>
                            {item.description}
                          </p>
                      </div>

                      <div className="flex-shrink-0 sm:w-48 w-full">
                          <div className="brutal-border border-black p-2 bg-white brutal-shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                            <img src={item.image} className='w-full h-auto object-cover' alt={item.title} />
                          </div>
                      </div>
                  </div>
                </div>
            </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
