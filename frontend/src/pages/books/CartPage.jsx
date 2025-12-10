import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { getImgURL } from '../../utils/getImgURL.js';
import { clearCart, removeFromCart } from '../../redux/features/cart/cartSlice.js';

export const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    

    const totalPriceInr = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.newPriceInr ?? item.newPrice) || 0;
        return acc + price;
    }, 0);

    const handleRemoveFromCart = (product)=>{
        dispatch(removeFromCart(product))
    } 
    const handleClearCart = ()=>{
        dispatch(clearCart())
    }

    return (
        <div className="flex mt-12 h-full flex-col overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between mb-8">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                        <span className="text-black">Shopping</span>{' '}
                        <span className="text-accent">Cart</span>
                    </h1>
                    {cartItems.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearCart}
                            className="brutal-button-secondary text-sm"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                <div className="mt-8">
                    <div className="flow-root">

                        {
                            cartItems.length > 0 ? (
                                <ul role="list" className="space-y-4">
                                    {cartItems.map((product) => (
                                        <li key={product?._id} className="brutal-card">
                                            <div className="flex gap-6">
                                                <div className="h-32 w-24 shrink-0 brutal-border bg-white p-2 brutal-shadow-sm">
                                                    <img
                                                        alt={product?.title}
                                                        src={`${getImgURL(product?.coverImage)}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex flex-1 flex-col justify-between">
                                                    <div>
                                                        <div className="flex flex-wrap justify-between items-start mb-2">
                                                            <Link to={`/books/${product?._id}`}>
                                                                <h3 className="text-xl font-black uppercase text-black hover:text-accent transition-colors">
                                                                    {product?.title}
                                                                </h3>
                                                            </Link>
                                                            <p className="text-2xl font-black text-accent ml-4">
                                                                ₹{(product?.newPriceInr ?? product?.newPrice ?? 0).toLocaleString('en-IN')}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-700 uppercase mb-2">
                                                            Category: {product?.category}
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-600">Qty: 1</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <button 
                                                            onClick={() => handleRemoveFromCart(product)}
                                                            type="button" 
                                                            className="brutal-button-secondary text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="brutal-card text-center py-12">
                                    <p className="text-2xl font-black uppercase text-gray-600">No products found</p>
                                </div>
                            )
                        }


                    </div>
                </div>
            </div>

            {cartItems.length > 0 && (
                <div className="brutal-border-t border-black px-4 py-6 sm:px-6 bg-lime/10">
                    <div className="brutal-card bg-white mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xl font-black uppercase">Subtotal</p>
                            <p className="text-3xl font-black text-accent">₹{totalPriceInr.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-600">Shipping and taxes calculated at checkout.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/checkout"
                            className="brutal-button w-full sm:w-auto text-center"
                        >
                            Checkout
                        </Link>
                        <Link to="/" className="brutal-button-secondary w-full sm:w-auto text-center">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>)
}
