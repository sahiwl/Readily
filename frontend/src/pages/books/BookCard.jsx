import React from 'react'
import { FiShoppingCart } from "react-icons/fi";
import {getImgURL} from '../../utils/getImgURL.js';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice.js';

export const BookCard = ({book}) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }
  return (
<div className="brutal-card bg-white group">
  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
    {/* Book Cover */}
    <div className="sm:w-48 sm:flex-shrink-0 brutal-border bg-white p-2 brutal-shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
      <Link to={`/books/${book._id}`}>
        <img
          src={`${getImgURL(book.coverImage)}`}
          alt={book.title}
          className="w-full h-auto object-cover"
        />
      </Link>
    </div>
    

    <div className="flex-1 space-y-4">
      <Link to={`/books/${book._id}`}>
        <h3 className="text-2xl font-black uppercase tracking-tight text-black group-hover:text-accent transition-colors">
          {book.title}
        </h3>
      </Link>
      
      <p className="text-gray-800 font-bold leading-relaxed">
        {book.description.length > 120 ? `${book.description.slice(0,120)}...` : book.description}
      </p>
      
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-accent">
          ${book?.newPrice}
        </span>
        <span className="text-lg font-bold text-gray-500 line-through">
          ${book?.oldPrice}
        </span>
      </div>
      
      <button 
        onClick={()=> handleAddToCart(book)}
        className="brutal-button w-full sm:w-auto group/btn"
      >
        <span className="flex items-center justify-center gap-2">
          <FiShoppingCart className="size-7 md:size-6 group-hover/btn:rotate-12 transition-transform" />
          <span>Add to Cart</span>
        </span>
      </button>
    </div>
  </div>
</div>
)
}

