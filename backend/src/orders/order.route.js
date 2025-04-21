import express from 'express';
import { createAOrder, getOrderByEmail } from './order.controller.js';

const router = express.Router();

//create order endpoint
router.post('/', createAOrder);

//get orders by user email
router.get("/email/:email", getOrderByEmail);

export default router;