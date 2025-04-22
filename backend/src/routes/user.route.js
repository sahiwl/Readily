import express from 'express';
import { userLogin, logout } from '../controllers/user.controller.js';

const router = express.Router();

// User login route
router.post('/user', userLogin);

// Logout route
router.post('/logout', logout);

export default router;