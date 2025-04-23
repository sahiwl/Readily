import express from 'express';
import { 
  getGoogleBooks,
  getBookById,
  getTrendingBooks,
  getNewReleases,
  getBooksByAuthor,
  getBooksByCategory,
  getRecommendedBooks,
  getSimilarBooks
} from '../controllers/book.controller.js';

const router = express.Router();


router.get('/google-books', getGoogleBooks);
router.get('/google-books/trending', getTrendingBooks);
router.get('/google-books/new-releases', getNewReleases);
router.get('/google-books/author/:author', getBooksByAuthor);
router.get('/google-books/category/:category', getBooksByCategory);
router.get('/google-books/recommended', getRecommendedBooks);
router.get('/google-books/similar/:id', getSimilarBooks);
router.get('/google-books/:id', getBookById);

export default router;