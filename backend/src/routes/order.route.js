import express from 'express';
import { createAOrder, getOrderByEmail } from '../controllers/order.controller.js';

const router = express.Router();


router.post('/', createAOrder);


router.get("/email/:email", getOrderByEmail);

export default router;