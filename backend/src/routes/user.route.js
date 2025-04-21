import express from 'express';
import { adminLogin, userLogin } from '../controllers/user.controller.js';

const router = express.Router();

// Admin login route
router.post('/admin', adminLogin);

// User login route
router.post('/user', userLogin);

export default router;