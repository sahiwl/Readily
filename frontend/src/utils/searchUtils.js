import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchBooks } from '../redux/features/googleBooks/googleBooksSlice.js';

/**
 * Custom hook to handle book search functionality
 * @param {number} maxResults - Maximum number of search results to display
 * @param {number} debounceTime - Debounce time in milliseconds
 * @returns {Object} Search state and handlers
 */
export const useBookSearch = (maxResults = 30, debounceTime = 300) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dispatch = useDispatch();
  
  const { searchResults, loading } = useSelector(state => state.googleBooks);

  // Debounce search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        dispatch(searchBooks({ query: searchQuery, maxResults }));
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch, maxResults, debounceTime]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e, navigate) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (bookId, navigate) => {
    navigate(`/books/${bookId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    showSearchResults,
    setShowSearchResults,
    searchResults,
    loading,
    handleSearchInputChange,
    handleSearchSubmit,
    handleSearchResultClick,
    closeSearchResults
  };
};