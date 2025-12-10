import React from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi.js'
import { useSelector } from 'react-redux';

export const OrderPage = () => {
    const user = useSelector(state => state.auth.user);
    const {data: orders=[], isLoading, isError}= useGetOrderByEmailQuery(user?.email);
    
    // Helper function to render product ID properly based on type
    const renderProductId = (productId) => {
        if (typeof productId === 'string') {
            return productId;
        } else if (typeof productId === 'object' && productId !== null) {

            return (
                <div className="ml-2">
                    <p><strong>Title:</strong> {productId.title || 'Unknown'}</p>
                    <p><strong>ID:</strong> {productId.googleBookId || 'Unknown'}</p>
                    <p><strong>Price:</strong> ${productId.price || '0.00'}</p>
                    <p><strong>Author:</strong> {productId.author || 'Unknown'}</p>
                </div>
            );
        } else {
            return 'Unknown Product';
        }
    };
    
    if(isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent"></div>
            </div>
        );
    }
    
    if(isError) {
        return (
            <div className="brutal-card text-center py-12">
                <p className="text-2xl font-black uppercase text-accent">Error getting orders data</p>
            </div>
        );
    }
    
    if(!user) {
        return (
            <div className="brutal-card text-center py-12">
                <p className="text-2xl font-black uppercase text-gray-600">Please login to view your orders</p>
            </div>
        );
    }
    
    return (
        <div className='py-8'>
            <h1 className='text-4xl md:text-5xl font-black uppercase tracking-tight mb-8'>
                <span className="text-black">Your</span>{' '}
                <span className="text-accent">Orders</span>
            </h1>
            {
                orders.length===0 ? (
                    <div className="brutal-card text-center py-12">
                        <p className="text-2xl font-black uppercase text-gray-600">No orders found!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index)=>(
                            <div key={order._id} className="brutal-card">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="brutal-card bg-accent text-white px-4 py-2 mb-4">
                                        <p className='font-black text-xl'># {index + 1}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-600 uppercase">Order ID: {order._id}</p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="font-black uppercase mb-1">Name:</p>
                                        <p className="font-bold text-gray-800">{order.name}</p>
                                    </div>
                                    <div>
                                        <p className="font-black uppercase mb-1">Email:</p>
                                        <p className="font-bold text-gray-800">{order.email}</p>
                                    </div>
                                    <div>
                                        <p className="font-black uppercase mb-1">Phone:</p>
                                        <p className="font-bold text-gray-800">{order.phone}</p>
                                    </div>
                                    <div>
                                        <p className="font-black uppercase mb-1">Total Price:</p>
                                        <p className="text-2xl font-black text-accent">
                                            ₹{(order.totalPriceInr ?? order.totalPrice ?? 0).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="brutal-card bg-lime/10 mb-4">
                                    <h3 className="font-black uppercase mb-2">Address:</h3>
                                    <p className="font-bold">{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                                </div>
                                
                                {order.itemDetails && order.itemDetails.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-xl font-black uppercase mb-4">Order Details:</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {order.itemDetails.map((item, idx) => (
                                                <div key={idx} className="brutal-card bg-white flex items-center gap-3">
                                                    {item.coverImage && (
                                                        <img 
                                                            src={item.coverImage} 
                                                            alt={item.title} 
                                                            className="h-16 w-12 object-cover brutal-border border-black"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-black uppercase text-sm">{item.title}</p>
                                                        <p className="text-xs font-bold text-gray-600">
                                                            {item.quantity || 1} x ₹{(item.priceInr ?? item.price ?? 0).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}
