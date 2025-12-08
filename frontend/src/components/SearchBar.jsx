import React from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useBookSearch } from "../utils/searchUtils.js";

export const SearchBar = () => {
    const navigate = useNavigate();
    const searchInputRef = React.useRef(null);
    const searchResultsRef = React.useRef(null);

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

    // Close search results when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (showSearchResults && 
                searchResultsRef.current && 
                !searchResultsRef.current.contains(event.target) && 
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearchResults, setShowSearchResults]);

    return (
        <div className="relative sm:w-72 w-40">
            <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                    <IoSearchOutline className="absolute inline-block left-3 top-3 text-black" size={20} />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="SEARCH BOOKS..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onFocus={() => searchQuery.trim().length > 2 && setShowSearchResults(true)}
                        className="brutal-input bg-white w-full py-2.5 md:pl-10 pl-9 pr-4 font-bold uppercase text-sm placeholder:text-gray-400"
                    />
                </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
                <div 
                    ref={searchResultsRef}
                    className="absolute mt-2 w-full bg-white brutal-border brutal-shadow z-30 max-h-[70vh] overflow-y-auto"
                >
                    {loading ? (
                        <div className="p-4 text-center font-bold">
                            <div className="inline-block animate-spin h-4 w-4 border-4 border-black border-t-transparent mr-2"></div>
                            SEARCHING...
                        </div>
                    ) : searchResults && searchResults.length > 0 ? (
                        <div>
                            <div className="max-h-[50vh] overflow-y-auto p-2">
                                {searchResults.map((book) => (
                                    <div 
                                        key={book._id} 
                                        className="flex items-center p-3 hover:bg-lime cursor-pointer brutal-border-b border-black last:border-b-0 transition-colors"
                                        onClick={() => handleSearchResultClick(book._id)}
                                    >
                                        <img 
                                            src={book.coverImage || book.image} 
                                            alt={book.title} 
                                            className="h-14 w-10 object-cover mr-3 brutal-border border-black"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black uppercase text-black truncate">
                                                {book.title}
                                            </p>
                                            <p className="text-xs font-bold text-gray-600 truncate">
                                                {book.author || (book.authors && book.authors[0])}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {searchResults.length > 5 && (
                                <div 
                                    className="brutal-border-t border-black p-3 text-center text-sm font-black uppercase text-accent hover:bg-primary cursor-pointer sticky bottom-0 bg-white transition-colors"
                                    onClick={() => {
                                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                                        setShowSearchResults(false);
                                    }}
                                >
                                    See All Results
                                </div>
                            )}
                        </div>
                    ) : searchQuery.trim().length > 2 ? (
                        <div className="p-4 text-center font-bold text-gray-600">
                            No results found for "{searchQuery}"
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

