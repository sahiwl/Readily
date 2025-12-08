import React, { useEffect, useState } from 'react'
import { BookCard } from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';
import { fetchTrendingBooks, fetchBooksByCategory, setCurrentCategory } from '../../redux/features/googleBooks/googleBooksSlice.js';

export const TopSellers = () => {
    const dispatch = useDispatch();
    const { 
        trendingBooks, 
        categoryBooks, 
        currentCategory, 
        loading, 
        error 
    } = useSelector((state) => state.googleBooks);
    
    const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure", "Biography", "Science", "Romance"];
    
    useEffect(() => {
        dispatch(fetchTrendingBooks(25));
    }, [dispatch]);
    
    const handleCategoryChange = (category) => {
        dispatch(setCurrentCategory(category));
        
        if (category === "Choose a genre") {
            dispatch(fetchTrendingBooks(25));
        } else {
          if(category == null || category === ""){
            category = 'Science';
          }
          dispatch(fetchBooksByCategory({ category, maxResults: 25 }));
        }
    };
    
    const displayBooks = currentCategory === "Choose a genre" 
        ? trendingBooks 
        : categoryBooks;

    return (
        <div className='py-10'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <h2 className='text-4xl md:text-5xl font-black uppercase tracking-tight'>
                    <span className='text-black'>Top</span>{' '}
                    <span className='text-accent'>Sellers</span>
                </h2>
     
                <div className="flex items-center">
                    <select 
                        name="category" 
                        id="category" 
                        value={currentCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className='brutal-input bg-white font-bold uppercase text-sm cursor-pointer'
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
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
                        1180:{
                            slidesPerView: 3,
                            spaceBetween: 50,
                        }
                    }}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    {displayBooks && displayBooks.length > 0 ? (
                        displayBooks.map((book, index) => (
                            <SwiperSlide key={book._id || index}>
                                <BookCard book={book} />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <div className="flex justify-center items-center h-64">
                                <p>No books found for this category.</p>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            )}
        </div>
    )
}
