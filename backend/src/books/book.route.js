const express = require('express');
const router = express.Router();
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, updateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
//post a book
//frontend => backend server => controller => book schema, if valid => db => send to server => back to frontend
// post -> when submit smth from fe to db
// get -> get smth back from db
//put/patch -> when u edit or update data 
// delete -> simply delete data from db

//post a book

router.post("/create-book", verifyAdminToken, postABook)
router.get("/",getAllBooks)

//single book endpoint
router.get('/:id', getSingleBook)

//update a book endpoint
router.put('/edit/:id', updateBook)

router.delete('/:id', deleteABook)



module.exports = router;