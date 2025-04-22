import React, { useEffect } from 'react'
import { BookCard } from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';
import { fetchTrendingBooks, fetchBooksByCategory, setCurrentCategory } from '../../redux/features/googleBooks/googleBooksSlice';

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
            dispatch(fetchBooksByCategory({ category, maxResults: 25 }));
        }
    };
    

    const displayBooks = currentCategory === "Choose a genre" 
        ? trendingBooks 
        : categoryBooks;

    return (
        <div className='py-10'>
            <h2 className='text-3xl font-semibold mb-6'>Top Sellers</h2>
            {/* {category filtering} */}
            <div className="mb-8 flex items-center">
                <select 
                    name="category" 
                    id="category" 
                    value={currentCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className='border bg-[#EAEAEA] border-gray-300 focus:outline-none rounded-md px-4 py-2'
                >
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
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
