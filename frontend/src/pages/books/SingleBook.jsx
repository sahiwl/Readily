import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart } from 'react-icons/fi';
import { useParams, Link } from 'react-router-dom';
import { addToCart } from '../../redux/features/cart/cartSlice.js';
import { fetchBookById, fetchSimilarBooks, clearCurrentBook } from '../../redux/features/googleBooks/googleBooksSlice.js';

export const SingleBook = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const { 
        currentBook: book, 
        similarBooks, 
        loading, 
        error 
    } = useSelector((state) => state.googleBooks);

    useEffect(() => {
        dispatch(fetchBookById(id));
        dispatch(fetchSimilarBooks({ id, maxResults: 6 }));
        
        // Clean up on unmount
        return () => {
            dispatch(clearCurrentBook());
        };
    }, [id, dispatch]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-red-500">Error loading book information</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="flex justify-center items-center h-96">
                <p>Book not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-5">
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="flex justify-center">
                    <img
                        src={book.coverImage || book.image}
                        alt={book.title}
                        className="max-h-96 object-contain shadow-md"
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{book.title}</h1>
                    
                    <p className="text-gray-700">
                        <strong>Author:</strong> {book.author || (book.authors && book.authors.join(', ')) || 'Unknown'}
                    </p>
                    
                    {book.publisher && (
                        <p className="text-gray-700">
                            <strong>Publisher:</strong> {book.publisher}
                        </p>
                    )}
                    
                    <p className="text-gray-700">
                        <strong>Published:</strong> {book.publishedDate || new Date(book?.createdAt).toLocaleDateString()}
                    </p>
                    
                    <p className="text-gray-700 capitalize">
                        <strong>Category:</strong> {book?.category || (book.categories && book.categories[0])}
                    </p>
                    
                    {book.isbn10 && (
                        <p className="text-gray-700">
                            <strong>ISBN-10:</strong> {book.isbn10}
                        </p>
                    )}
                    
                    {book.pageCount && (
                        <p className="text-gray-700">
                            <strong>Pages:</strong> {book.pageCount}
                        </p>
                    )}
                    
                    <div className="my-5">
                        <p className="text-2xl font-bold text-blue-700">${book.newPrice || '14.99'}</p>
                        {book.oldPrice && (
                            <p className="text-gray-500 line-through">${book.oldPrice}</p>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => handleAddToCart(book)} 
                        className="btn-primary px-6 py-2 space-x-1 flex items-center gap-1"
                    >
                        <FiShoppingCart className="" />
                        <span>Add to Cart</span>
                    </button>
                    
                    {book.previewLink && (
                        <a 
                            href={book.previewLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block mt-4 text-blue-600 hover:underline"
                        >
                            Preview Book
                        </a>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">About This Book</h2>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>

            {similarBooks && similarBooks.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Similar Books You May Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {similarBooks.slice(0, 4).map((similarBook) => (
                            <div key={similarBook._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <Link to={`/books/${similarBook._id}`}>
                                    <div className="h-48 overflow-hidden">
                                        <img 
                                            src={similarBook.coverImage || similarBook.image} 
                                            alt={similarBook.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 truncate">{similarBook.title}</h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {similarBook.author || (similarBook.authors && similarBook.authors[0])}
                                        </p>
                                        <p className="text-blue-700 font-medium mt-2">${similarBook.newPrice}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
