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
    
    if(isLoading) return <div>Loading....</div>
    if(isError) return <div>Error getting orders data</div>
    if(!user) return <div>Please login to view your orders</div>
    
    return (
        <div className='container mx-auto p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Your Orders</h2>
            {
                orders.length===0 ? (<div>No orders found! </div>) : (
                    <div>
                        {
                            orders.map((order, index)=>(
                                <div key={order._id} className="border-b mb-4 pb-4">
                                <p className='p-1 bg-secondary text-white w-10 rounded mb-1'># {index + 1}</p>
                                <h2 className="font-bold">Order ID: {order._id}</h2>
                                <p className="text-gray-600">Name: {order.name}</p>
                                <p className="text-gray-600">Email: {order.email}</p>
                                <p className="text-gray-600">Phone: {order.phone}</p>
                                <p className="text-gray-600">Total Price: ${order.totalPrice}</p>
                                <h3 className="font-semibold mt-2">Address:</h3>
                                <p> {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                                <h3 className="font-semibold mt-2">Products:</h3>
                                <ul className="mt-2 space-y-2">
                                    {order.productIds && order.productIds.map((productId, idx) => (
                                        <li key={idx} className="border-l-2 border-blue-500 pl-3 py-1">
                                            {renderProductId(productId)}
                                        </li>
                                    ))}
                                </ul>
                                
                                {order.itemDetails && order.itemDetails.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold">Order Details:</h3>
                                        <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {order.itemDetails.map((item, idx) => (
                                                <li key={idx} className="border rounded-md p-2 flex items-center bg-gray-50">
                                                    {item.coverImage && (
                                                        <img 
                                                            src={item.coverImage} 
                                                            alt={item.title} 
                                                            className="h-16 w-12 object-cover mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {item.quantity || 1} x ${item.price || 'N/A'}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            ))
                        }
                    </div>)
            }
        </div>
    )
}
