import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineShoppingCart } from "react-icons/hi";
import avatar from "../assets/avatar.png"
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useAuthStore } from "../redux/features/auth/useAuthStore.js";
import { SearchBar } from "./SearchBar.jsx";

const navigation = [
    { name: "Orders", href: "/orders" },
    { name: "Cart page", href: "/cart" },
    { name: "Checkout page", href: "/checkout" }
]

export const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cartItems = useSelector(state => state.cart.cartItems || []);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
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

    return (
        <header className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sticky top-0 bg-white z-20 brutal-border-b-4 border-black">
            <nav className="flex justify-between items-center">
                {/* {left side} */}
                <div className="flex items-center md:gap-8 gap-4">
                    <Link to="/">
                        <h1 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-black hover:text-accent transition-colors">
                            Readily
                        </h1>
                    </Link>
                    
                    <SearchBar />
                </div>

                {/* {right side} */}
                <div className="relative flex items-center md:space-x-3 space-x-2">
                    <div className="user-menu">
                        {isAuthenticated ? (
                            <> 
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center focus:outline-none brutal-border bg-white px-3 py-2 brutal-shadow-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                                >
                                    <img 
                                        src={user?.photo || avatar} 
                                        alt="User" 
                                        className="size-8 brutal-border border-black" 
                                    />
                                    <span className="hidden md:inline ml-2 text-sm font-black uppercase">
                                        {user?.username || "User"}
                                    </span>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white brutal-border brutal-shadow z-40">
                                        <ul>
                                            <li className="px-4 py-3 brutal-border-b border-black bg-primary">
                                                <span className="font-black uppercase text-sm text-black">{user?.username || "User"}</span>
                                            </li>
                                            {navigation.map((item) => (
                                                <li key={item.name} onClick={() => { setIsDropdownOpen(false) }}>
                                                    <Link to={item.href} className="block px-4 py-2 text-sm font-bold uppercase hover:bg-lime transition-colors brutal-border-b border-black last:border-b-0">
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <button 
                                                    onClick={handleLogOut}
                                                    className="block w-full text-left px-4 py-2 text-sm font-black uppercase hover:bg-accent hover:text-white transition-colors">
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </> 
                        ) : (
                            <div className="flex space-x-2">
                                <Link to="/login" className="brutal-button-secondary text-sm">
                                    <span className="flex items-center gap-1">
                                        <HiOutlineUser className="size-5" />
                                        <span className="hidden sm:inline">Login</span>
                                    </span>
                                </Link>
                                <Link to="/register" className="hidden sm:block brutal-button text-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className="brutal-button relative group">
                        <span className="flex items-center gap-2">
                            <HiOutlineShoppingCart className="size-6" />
                            <span className="font-black">
                                {cartItems.length > 0 ? cartItems.length : 0}
                            </span>
                        </span>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent brutal-border border-black text-white text-xs font-black flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>
        </header>
    );
};
