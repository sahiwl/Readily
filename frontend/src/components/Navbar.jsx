import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineHeart } from "react-icons/hi2";
import { HiOutlineShoppingCart } from "react-icons/hi";
import avatar from "../assets/avatar.png"
import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { useAuthStore } from "../redux/features/auth/useAuthStore";
import { useBookSearch } from "../utils/searchUtils";

const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart page", href: "/cart" },
    { name: "Checkout page", href: "/checkout" }
]

export const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchInputRef = useRef(null);
    const searchResultsRef = useRef(null);
    const navigate = useNavigate();
    

    const {
        searchQuery,
        showSearchResults,
        setShowSearchResults,
        searchResults,
        loading,
        handleSearchInputChange,
        handleSearchSubmit: baseHandleSearchSubmit,
        handleSearchResultClick: baseHandleSearchResultClick
    } = useBookSearch(30);
    

    const handleSearchSubmit = (e) => baseHandleSearchSubmit(e, navigate);
    const handleSearchResultClick = (bookId) => baseHandleSearchResultClick(bookId, navigate);
    
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
            
            // Close search results when clicking outside
            if (showSearchResults && 
                searchResultsRef.current && 
                !searchResultsRef.current.contains(event.target) && 
                !searchInputRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen, showSearchResults]);

    const handleLogOut = async () => {
        try {
            await logoutUser();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <header className="max-w-screen-2xl mx-auto px-4 py-6 sticky top-0 bg-white z-20 shadow-sm">
            <nav className="flex justify-between sticky items-center">
                {/* {left side} */}
                <div className="flex items-center md:gap-16 gap-4">
                    <h1 className="font-Cinzel text-4xl text-gray-600">
                        <Link to="/">Readily</Link>
                    </h1>
                    
                    {/* {search input with dropdown} */}
                    <div className="relative sm:w-72 w-40">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative">
                                <IoSearchOutline className="absolute inline-block left-3 top-2.5 text-gray-500" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search books..."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    onFocus={() => searchQuery.trim().length > 2 && setShowSearchResults(true)}
                                    className="bg-[#EAEAEA] w-full py-2 md:px-10 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                        </form>
                        
                        {/* Search Results Dropdown */}
                        {showSearchResults && (
                            <div 
                                ref={searchResultsRef}
                                className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-30 border border-gray-200 max-h-[70vh] overflow-y-auto"
                            >
                                {loading ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                        Searching...
                                    </div>
                                ) : searchResults && searchResults.length > 0 ? (
                                    <div>
                                        <div className="max-h-[50vh] overflow-y-auto p-2">
                                            {searchResults.map((book) => (
                                                <div 
                                                    key={book._id} 
                                                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                                    onClick={() => handleSearchResultClick(book._id)}
                                                >
                                                    <img 
                                                        src={book.coverImage || book.image} 
                                                        alt={book.title} 
                                                        className="h-14 w-10 object-cover mr-3 rounded-sm shadow-sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {book.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {book.author || (book.authors && book.authors[0])}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {searchResults.length > 5 && (
                                            <div 
                                                className="border-t p-3 text-center text-sm text-blue-600 hover:bg-gray-50 cursor-pointer sticky bottom-0 bg-white"
                                                onClick={() => {
                                                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                                                    setShowSearchResults(false);
                                                }}
                                            >
                                                See all results
                                            </div>
                                        )}
                                    </div>
                                ) : searchQuery.trim().length > 2 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No results found for "{searchQuery}"
                                    </div>
                                ) : null}
                            </div>
                        )}
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
