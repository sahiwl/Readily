import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart } from 'react-icons/fi';
import { useParams, Link } from 'react-router-dom';
import { addToCart } from '../../redux/features/cart/cartSlice.js';
import { fetchBookById, fetchSimilarBooks, clearCurrentBook } from '../../redux/features/googleBooks/googleBooksSlice.js';
import { dollarsToRupees } from '../../utils/currency.js';

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
                <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="brutal-card text-center py-12">
                <p className="text-2xl font-black uppercase text-accent">Error loading book information</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="brutal-card text-center py-12">
                <p className="text-2xl font-black uppercase text-gray-600">Book not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="flex justify-center">
                    <div className="brutal-card bg-white p-4 w-full max-w-xs sm:max-w-sm">
                        <img
                            src={book.coverImage || book.image}
                            alt={book.title}
                            className="w-full h-auto max-h-112 object-contain"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                        {book.title}
                    </h1>
                    
                    <div className="space-y-3">
                        <p className="text-lg font-bold">
                            <span className="font-black uppercase">Author:</span>{' '}
                            <span className="text-gray-800">{book.author || (book.authors && book.authors.join(', ')) || 'Unknown'}</span>
                        </p>
                        
                        {book.publisher && (
                            <p className="text-lg font-bold">
                                <span className="font-black uppercase">Publisher:</span>{' '}
                                <span className="text-gray-800">{book.publisher}</span>
                            </p>
                        )}
                        
                        <p className="text-lg font-bold">
                            <span className="font-black uppercase">Published:</span>{' '}
                            <span className="text-gray-800">{book.publishedDate || new Date(book?.createdAt).toLocaleDateString()}</span>
                        </p>
                        
                        <p className="text-lg font-bold uppercase">
                            <span className="font-black">Category:</span>{' '}
                            <span className="text-gray-800">{book?.category || (book.categories && book.categories[0])}</span>
                        </p>
                        
                        {book.isbn10 && (
                            <p className="text-lg font-bold">
                                <span className="font-black uppercase">ISBN-10:</span>{' '}
                                <span className="text-gray-800">{book.isbn10}</span>
                            </p>
                        )}
                        
                        {book.pageCount && (
                            <p className="text-lg font-bold">
                                <span className="font-black uppercase">Pages:</span>{' '}
                                <span className="text-gray-800">{book.pageCount}</span>
                            </p>
                        )}
                    </div>
                    
                    <div className="brutal-card bg-lime/10 p-4 space-y-1">
                        <p className="text-4xl font-black text-accent mb-1">
                            ₹{dollarsToRupees(book.newPrice || '14.99').toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                            ${book.newPrice || '14.99'}
                        </p>
                        {book.oldPrice && (
                            <p className="text-xl font-bold text-gray-500 line-through">
                                ₹{dollarsToRupees(book.oldPrice).toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => handleAddToCart(book)} 
                            className="brutal-button flex items-center justify-center gap-2"
                        >
                            <FiShoppingCart className="size-5" />
                            <span>Add to Cart</span>
                        </button>
                        
                        {book.previewLink && (
                            <a 
                                href={book.previewLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="brutal-button-secondary text-center"
                            >
                                Preview Book
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="brutal-card mb-10">
                <h2 className="text-3xl font-black uppercase mb-4">About This Book</h2>
                <p className="text-lg font-bold text-gray-800 leading-relaxed">{book.description}</p>
            </div>

            {similarBooks && similarBooks.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                        <span className="text-black">Similar</span>{' '}
                        <span className="text-purple">Books</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {similarBooks.slice(0, 4).map((similarBook) => (
                            <Link key={similarBook._id} to={`/books/${similarBook._id}`}>
                                <div className="brutal-card group">
                                    <div className="h-48 overflow-hidden mb-4 brutal-border border-black p-2 bg-white">
                                        <img 
                                            src={similarBook.coverImage || similarBook.image} 
                                            alt={similarBook.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase text-sm text-black group-hover:text-accent transition-colors truncate mb-1">
                                            {similarBook.title}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-600 truncate mb-2">
                                            {similarBook.author || (similarBook.authors && similarBook.authors[0])}
                                        </p>
                                        <p className="text-lg font-black text-accent">${similarBook.newPrice}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
