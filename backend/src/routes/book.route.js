import express from 'express';
import Book from '../models/book.model.js';
import { 
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
} from '../controllers/book.controller.js';
import verifyAdminToken from '../middleware/verifyAdminToken.js';

const router = express.Router();

//post a book
//frontend => backend server => controller => book schema, if valid => db => send to server => back to frontend
// post -> when submit smth from fe to db
// get -> get smth back from db
//put/patch -> when u edit or update data 
// delete -> simply delete data from db

//post a book
router.post("/create-book", verifyAdminToken, postABook);
router.get("/", getAllBooks);


router.get('/google-books', getGoogleBooks);
router.get('/google-books/trending', getTrendingBooks);
router.get('/google-books/new-releases', getNewReleases);
router.get('/google-books/author/:author', getBooksByAuthor);
router.get('/google-books/category/:category', getBooksByCategory);
router.get('/google-books/recommended', getRecommendedBooks);
router.get('/google-books/similar/:id', getSimilarBooks);
router.get('/google-books/:id', getBookById);

//update a book endpoint
router.put('/edit/:id', verifyAdminToken, updateBook);
router.delete('/:id', verifyAdminToken, deleteABook);

//single book endpoint - moved AFTER the Google Books routes
router.get('/:id', getSingleBook);

export default router;