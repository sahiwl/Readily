import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';
import { BookCard } from '../books/BookCard.jsx';
import { fetchRecommendedBooks } from '../../redux/features/googleBooks/googleBooksSlice.js';

export const Recommended = () => {
    const dispatch = useDispatch();
    const { 
        recommendedBooks, 
        loading, 
        error 
    } = useSelector((state) => state.googleBooks);
    
    // Get only recently viewed books from localStorage
    const getRecentlyViewed = () => {
        try {
            return JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        } catch (error) {
            console.error("Error getting recently viewed books:", error);
            return [];
        }
    };
    
    // Fetch recommended books on component mount
    useEffect(() => {
        const recentlyViewed = getRecentlyViewed();

        dispatch(fetchRecommendedBooks({ recentlyViewed, maxResults: 25 }));
    }, [dispatch]);

    return (
        <>
            <div className="py-16">
                <h2 className='text-4xl md:text-5xl font-black uppercase tracking-tight mb-8'>
                    <span className='text-black'>Recommended</span>{' '}
                    <span className='text-purple'>For You</span>
                </h2>
                
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
                            1180: {
                                slidesPerView: 3,
                                spaceBetween: 50,
                            }
                        }}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {recommendedBooks && recommendedBooks.length > 0 ? (
                            recommendedBooks.map((book, index) => (
                                <SwiperSlide key={book._id || index}>
                                    <BookCard book={book} />
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide>
                                <div className="flex justify-center items-center h-64">
                                    <p>No recommended books found.</p>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                )}
            </div>
        </>
    )
}
