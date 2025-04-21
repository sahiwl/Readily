import express from 'express';
import Book from './book.model.js';
import { postABook, getAllBooks, getSingleBook, updateBook, deleteABook } from './book.controller.js';
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

//single book endpoint
router.get('/:id', getSingleBook);

//update a book endpoint
router.put('/edit/:id', verifyAdminToken, updateBook);

router.delete('/:id', verifyAdminToken, deleteABook);

export default router;