import React from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineHeart } from "react-icons/hi2";
import { HiOutlineShoppingCart } from "react-icons/hi";
import avatar from "../assets/avatar.png"
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useAuthStore } from "../redux/features/auth/useAuthStore";

const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart page", href: "/cart" },
    { name: "Checkout page", href: "/checkout" }
]

export const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cartItems = useSelector(state => state.cart.cartItems || []);
    
    // Get auth state directly from Redux selector for better reactivity
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    
    // Get the logout function from our auth store
    const { logoutUser } = useAuthStore();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (isDropdownOpen && !event.target.closest('.user-menu')) {
                setIsDropdownOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogOut = async () => {
        try {
            await logoutUser();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    console.log("Auth state in Navbar render:", { isAuthenticated, user });

    return (
        <header className="max-w-screen-2xl mx-auto px-4 py-6 sticky top-0 bg-white z-10">
            <nav className="flex justify-between sticky items-center">
                {/* {left side} */}
                <div className="flex items-center md:gap-16 gap-4">
                    <h1 className="font-Cinzel text-4xl text-gray-600">
                        <Link to="/">Readily</Link>
                    </h1>
                    {/* {search input} */}
                    <div className="relative sm:w-72 w-40 space-x-2">
                        <IoSearchOutline className="absolute inline-block left-3 inset-y-2" />
                        <input
                            type="text"
                            placeholder="Search here"
                            className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
                        />
                    </div>
                </div>

                {/* {right side} */}
                <div className="relative flex items-center md:space-x-3 space-x-2">
                    <div className="user-menu">
                        {isAuthenticated ? (
                            <> 
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center focus:outline-none">
                                    <img 
                                        src={user?.photo || avatar} 
                                        alt="User" 
                                        className="size-7 rounded-full ring-2 ring-blue-500" 
                                    />
                                    <span className="hidden md:inline ml-2 text-sm font-medium">
                                        {user?.username || "User"}
                                    </span>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40 border border-gray-200">
                                        <ul>
                                            <li className="px-4 py-2 border-b">
                                                <span className="font-semibold text-sm">{user?.username || "User"}</span>
                                            </li>
                                            {navigation.map((item) => (
                                                <li key={item.name} onClick={() => { setIsDropdownOpen(false) }}>
                                                    <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <button 
                                                    onClick={handleLogOut}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </> 
                        ) : (
                            <div className="flex space-x-2">
                                <Link to="/login" className="flex items-center space-x-1 hover:text-blue-600">
                                    <HiOutlineUser className="size-6" />
                                    <span className="hidden sm:inline text-sm">Login</span>
                                </Link>
                                <Link to="/register" className="hidden sm:flex items-center space-x-1 hover:text-blue-600">
                                    <span className="text-sm">Register</span>
                                </Link>
                            </div>
                        )}
                    </div>
                    <button className="hidden sm:block">
                        <HiOutlineHeart className="size-6" />
                    </button>

                    <Link to="/cart" className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm">
                        <HiOutlineShoppingCart className="size-6" />
                        <span className="text-sm font-semibold sm:ml-1">
                            {cartItems.length > 0 ? cartItems.length : 0}
                        </span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};
