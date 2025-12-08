import express from 'express';
import { userLogin, logout, checkAuth } from '../controllers/user.controller.js';

const router = express.Router();

// Check authentication status
router.get('/check', checkAuth);

// User login route
router.post('/user', userLogin);

// Logout route
router.post('/logout', logout);

export default router;