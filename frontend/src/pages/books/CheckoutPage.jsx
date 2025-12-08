import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../../redux/features/cart/cartSlice.js'
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi.js'

export const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems)
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    // Fixed price calculation to use price from cartItems or defaultPrice
    const calculateItemPrice = (item) => {

        if (typeof item.newPrice === 'number') {
            return item.newPrice;
        } else if (typeof item.newPrice === 'string' && !isNaN(parseFloat(item.newPrice))) {
            return parseFloat(item.newPrice);
        } else if (typeof item.price === 'number') {
            return item.price;
        } else if (typeof item.price === 'string' && !isNaN(parseFloat(item.price))) {
            return parseFloat(item.price);
        }
        // Default price if none found
        return 19.99; 
    };
    

    const calculateTotalPrice = () => {
        let total = 0;
        cartItems.forEach(item => {
            const price = calculateItemPrice(item);
            const quantity = parseInt(item.quantity) || 1;
            total += price * quantity;
        });
        return total;
    };
    
    const totalPrice = calculateTotalPrice();
    
    // Create an array of book objects with necessary details instead of just IDs
    const orderItems = cartItems.map(item => ({
        _id: item._id,
        title: item.title,
        price: calculateItemPrice(item),
        quantity: parseInt(item.quantity) || 1,
        author: item.author || (item.authors ? item.authors[0] : 'Unknown'),
        coverImage: item.coverImage || item.image
    }));
    
    // Debug log (remove in production)
    useEffect(() => {
        console.log("Cart items with prices:", cartItems.map(item => ({
            title: item.title,
            price: item.price,
            newPrice: item.newPrice,
            calculated: calculateItemPrice(item)
        })));
        console.log("Total price:", totalPrice);
    }, [cartItems]);
    
    const [address, setAddress] = useState({
        city: "",
        state: "",
        country: "",
        zipcode: ""
    })
    const [name, setName] = useState(user?.username || "")
    const [email, setEmail] = useState(user?.email || "")
    const [phone, setPhone] = useState("")

    const [createOrder, { isLoading, isError, error }] = useCreateOrderMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
            alert("Please login to checkout");
            navigate('/login');
            return;
        }
        

        const phoneNumber = parseFloat(phone);
        if (isNaN(phoneNumber)) {
            alert("Please enter a valid phone number");
            return;
        }
        
        try {
            // Send the complete book objects instead of just IDs
            const order = {
                name,
                email,
                phone: phoneNumber,
                address,
                items: orderItems, 
                totalPrice: parseFloat(totalPrice)
            }
            
            console.log("Submitting order:", order);
            
            const response = await createOrder(order).unwrap()
            console.log("Order response:", response)
            if (response?._id) {
                dispatch(clearCart())
                alert("Order placed successfully!")
                navigate('/orders')
            }
        } catch (err) {
            console.error("Order error:", err)
            alert("Failed to place order: " + (err.data?.message || "Please check your information"))
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setAddress(prev => ({ ...prev, [name]: value }))
    }

    if (cartItems.length === 0) {
        return (
            <div className='brutal-card text-center py-12'>
                <p className='text-3xl font-black uppercase text-gray-600'>Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className="py-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">
                <span className="text-black">Check</span>{' '}
                <span className="text-accent">Out</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="brutal-card">
                    <h3 className="text-2xl font-black uppercase mb-6">Shipping Information</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="brutal-input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="brutal-input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="brutal-input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleInputChange}
                                required
                                className="brutal-input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">State</label>
                            <input
                                type="text"
                                name="state"
                                value={address.state}
                                onChange={handleInputChange}
                                required
                                className="brutal-input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={address.country}
                                onChange={handleInputChange}
                                required
                                className="brutal-input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">ZIP Code</label>
                            <input
                                type="text"
                                name="zipcode"
                                value={address.zipcode}
                                onChange={handleInputChange}
                                required
                                className="brutal-input w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="brutal-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : "Place Order"}
                        </button>
                        {isError && <p className="text-accent font-black uppercase">{error?.data?.message || "Something went wrong"}</p>}
                    </form>
                </div>
                <div className="brutal-card bg-lime/10">
                    <h3 className="text-2xl font-black uppercase mb-6">Order Summary</h3>
                    <div className="brutal-card bg-white mb-4">
                        <div className="max-h-96 overflow-y-auto space-y-3">
                            {cartItems.map(item => {
                                const price = calculateItemPrice(item);
                                const quantity = parseInt(item.quantity) || 1;
                                return (
                                    <div key={item._id} className="flex justify-between items-center brutal-border-b border-black pb-3 last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <img src={item?.coverImage || item?.image} alt={item.title} className="h-16 w-12 object-cover brutal-border border-black" />
                                            <div>
                                                <p className="font-black uppercase text-sm">{item.title}</p>
                                                <p className="text-xs font-bold text-gray-600">${price.toFixed(2)} x {quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-lg text-accent">${(price * quantity).toFixed(2)}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="brutal-border-t border-black pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-black uppercase">Total</p>
                                <p className="text-3xl font-black text-accent">${totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
