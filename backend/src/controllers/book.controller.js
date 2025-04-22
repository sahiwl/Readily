import Book from "../models/book.model.js";
import googleBooksService from "../services/googleBooksService.js";
import dotenv from 'dotenv';
dotenv.config();

const postABook = async (req, res) => {
    try {
        const newBook = await Book({...req.body});
        await newBook.save();
        res.status(200).send({message: "Book posted successfully", book: newBook})
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({message: "Failed to create book"})
    }
}

// get all books
const getAllBooks =  async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1});
        res.status(200).send(books)
        
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({message: "Failed to fetch books"})
    }
}

const getSingleBook = async (req, res) => {
    try {
        const {id} = req.params;
        const book =  await Book.findById(id);
        if(!book){
            res.status(404).send({message: "Book not Found!"})
        }
        res.status(200).send(book)
        
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({message: "Failed to fetch book"})
    }

}

// update book data
const updateBook = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedBook =  await Book.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({message: "Failed to update a book"})
    }
}

const deleteABook = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedBook =  await Book.findByIdAndDelete(id);
        if(!deletedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        })
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({message: "Failed to delete a book"})
    }
};

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
        // handles default preferences by passing empty arrays
        // if no preferences are specified in the request
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
    postABook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteABook,
    getGoogleBooks,
    getBookById,
    getTrendingBooks,
    getNewReleases,
    getBooksByAuthor,
    getBooksByCategory,
    getRecommendedBooks,
    getSimilarBooks
}