import React from 'react'
import { FiShoppingCart } from "react-icons/fi";
import { getImgURL } from '../../utils/getImgURL.js';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice.js';
import { formatRupees } from '../../utils/currency.js';

export const BookCard = ({book}) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }
  return (
<div className="brutal-card bg-white group w-full max-w-[360px] md:max-w-[420px] mx-auto h-full overflow-hidden">
  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
    {/* Book Cover */}
    <div className="sm:w-40 md:w-44 lg:w-48 sm:shrink-0 brutal-border bg-white p-2 brutal-shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
      <Link to={`/books/${book._id}`}>
        <img
          src={`${getImgURL(book.coverImage)}`}
          alt={book.title}
          className="w-full h-56 md:h-64 object-cover"
        />
      </Link>
    </div>
    

    <div className="flex-1 space-y-3 min-w-0">
      <Link to={`/books/${book._id}`}>
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black group-hover:text-accent transition-colors wrap-break-word line-clamp-2">
          {book.title}
        </h3>
      </Link>
      
      <p className="text-sm md:text-base text-gray-800 font-bold leading-relaxed line-clamp-3">
        {book.description?.length > 150 ? `${book.description.slice(0,150)}...` : book.description}
      </p>
      
      <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
        <span className="text-2xl md:text-3xl font-black text-accent">
          ₹{formatRupees(book?.newPriceInr ?? book?.newPrice)}
        </span>
        <span className="text-base md:text-lg font-bold text-gray-500 line-through">
          {book?.oldPriceInr || book?.oldPrice ? `₹${formatRupees(book?.oldPriceInr ?? book?.oldPrice)}` : ''}
        </span>
      </div>
      
      <button 
        onClick={()=> handleAddToCart(book)}
        className="brutal-button w-full sm:w-auto group/btn text-sm md:text-base"
      >
        <span className="flex items-center justify-center gap-2">
          <FiShoppingCart className="size-5 sm:size-6 group-hover/btn:rotate-12 transition-transform" />
          <span>Add to Cart</span>
        </span>
      </button>
    </div>
  </div>
</div>
)
}

