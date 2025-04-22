import googleBooksService from "../services/googleBooksService.js";
import dotenv from 'dotenv';
dotenv.config();

// Google Books API endpoints
const getGoogleBooks = async (req, res) => {
    try {
        const query = req.query.q || 'bestseller';
        const maxResults = parseInt(req.query.maxResults) || 25;
        const startIndex = parseInt(req.query.startIndex) || 0;
        const orderBy = req.query.orderBy || 'relevance';
        const category = req.query.category || '';
        
        const response = await googleBooksService.searchBooks({
            query,
            category,
            maxResults,
            startIndex,
            orderBy
        });
        
        const books = googleBooksService.adaptGoogleBooksData(response);
        res.status(200).json({ books });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const bookData = await googleBooksService.getBookById(id);
        const book = googleBooksService.formatGoogleBookData(bookData);
        
        res.status(200).json({ book });
    } catch (error) {
        console.error('Error fetching book:', error.message);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
};

const getTrendingBooks = async (req, res) => {
    try {
        const maxResults = parseInt(req.query.maxResults) || 25;
        const response = await googleBooksService.getTrendingBooks(maxResults);
        const books = googleBooksService.adaptGoogleBooksData(response);
        
        res.status(200).json({ books });
    } catch (error) {
        console.error('Error fetching trending books:', error.message);
        res.status(500).json({ error: 'Failed to fetch trending books' });
    }
};

const getNewReleases = async (req, res) => {
    try {
        const maxResults = parseInt(req.query.maxResults) || 25;
        const response = await googleBooksService.getNewReleases(maxResults);
        const books = googleBooksService.adaptGoogleBooksData(response);
        
        res.status(200).json({ books });
    } catch (error) {
        console.error('Error fetching new releases:', error.message);
        res.status(500).json({ error: 'Failed to fetch new releases' });
    }
};

const getBooksByAuthor = async (req, res) => {
    try {
        const { author } = req.params;
        const maxResults = parseInt(req.query.maxResults) || 25;
        const response = await googleBooksService.getBooksByAuthor(author, maxResults);
        const books = googleBooksService.adaptGoogleBooksData(response);
        
        res.status(200).json({ books });
    } catch (error) {
        console.error('Error fetching books by author:', error.message);
        res.status(500).json({ error: 'Failed to fetch books by author' });
    }
};

const getBooksByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const maxResults = parseInt(req.query.maxResults) || 25;
        const response = await googleBooksService.getBooksByCategory(category, maxResults);
        const books = googleBooksService.adaptGoogleBooksData(response);
        
        res.status(200).json({ books });
    } catch (error) {
        console.error('Error fetching books by category:', error.message);
        res.status(500).json({ error: 'Failed to fetch books by category' });
    }
};

const getRecommendedBooks = async (req, res) => {
    try {
        const preferences = req.query.preferences ? req.query.preferences.split(',').filter(p => p) : [];
        const recentlyViewed = req.query.recentlyViewed ? req.query.recentlyViewed.split(',').filter(id => id) : [];
        const maxResults = parseInt(req.query.maxResults) || 25;
        
        console.log('Controller received preferences:', preferences);
        console.log('Controller received recentlyViewed:', recentlyViewed);
        
        const response = await googleBooksService.getRecommendedBooks(preferences, recentlyViewed, maxResults);
        const books = googleBooksService.adaptGoogleBooksData(response);
        
        res.status(200).json({ books });
    } catch (error) {
        console.error('Error fetching recommended books:', error.message);
        res.status(500).json({ error: 'Failed to fetch recommended books' });
    }
};

const getSimilarBooks = async (req, res) => {
    try {
        const { id } = req.params;
        const maxResults = parseInt(req.query.maxResults) || 15;
        
        // First get the book details
        const bookData = await googleBooksService.getBookById(id);
        const book = googleBooksService.formatGoogleBookData(bookData);
        
        // Then get similar books
        const similarBooks = await googleBooksService.getSimilarBooks(book, maxResults);
        
        res.status(200).json({ books: similarBooks });
    } catch (error) {
        console.error('Error fetching similar books:', error.message);
        res.status(500).json({ error: 'Failed to fetch similar books' });
    }
};

export {
    getGoogleBooks,
    getBookById,
    getTrendingBooks,
    getNewReleases,
    getBooksByAuthor,
    getBooksByCategory,
    getRecommendedBooks,
    getSimilarBooks
}