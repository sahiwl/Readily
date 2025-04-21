import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../../redux/features/cart/cartSlice.js'
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi'

export const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems)
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    // Fixed price calculation to use price from cartItems or defaultPrice
    const calculateItemPrice = (item) => {
        // Try to get price from various possible sources and formats
        if (typeof item.price === 'number') {
            return item.price;
        } else if (typeof item.price === 'string' && !isNaN(parseFloat(item.price))) {
            return parseFloat(item.price);
        } else if (typeof item.mrp === 'number') {
            return item.mrp;
        } else if (typeof item.mrp === 'string' && !isNaN(parseFloat(item.mrp))) {
            return parseFloat(item.mrp);
        }
        // Default price if none found
        return 19.99; // Set a reasonable default price
    };
    
    // Calculate total price properly
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
    const productIds = cartItems.map(item => item._id);
    
    // Debug log - remove in production
    useEffect(() => {
        console.log("Cart items with prices:", cartItems.map(item => ({
            title: item.title,
            price: item.price,
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
        
        // Validate phone number is numeric
        const phoneNumber = parseFloat(phone);
        if (isNaN(phoneNumber)) {
            alert("Please enter a valid phone number");
            return;
        }
        
        try {
            const order = {
                name,
                email,
                phone: phoneNumber,
                address,
                productIds,
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

    if (cartItems.length === 0) return <div className='text-center text-2xl'>Your cart is empty</div>

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">State</label>
                            <input
                                type="text"
                                name="state"
                                value={address.state}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={address.country}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">ZIP Code</label>
                            <input
                                type="text"
                                name="zipcode"
                                value={address.zipcode}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isLoading ? "Processing..." : "Place Order"}
                        </button>
                        {isError && <p className="text-red-500">{error?.data?.message || "Something went wrong"}</p>}
                    </form>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="max-h-96 overflow-y-auto mb-4">
                            {cartItems.map(item => {
                                // Use the fixed price calculation function
                                const price = calculateItemPrice(item);
                                const quantity = parseInt(item.quantity) || 1;
                                return (
                                    <div key={item._id} className="flex justify-between items-center border-b py-2">
                                        <div className="flex items-center">
                                            <img src={item?.image} alt={item.title} className="h-12 w-10 object-cover mr-2" />
                                            <div>
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-sm text-gray-600">${price.toFixed(2)} x {quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">${(price * quantity).toFixed(2)}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-t pt-2">
                            <div className="flex justify-between font-bold text-lg">
                                <p>Total</p>
                                <p>${totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
