import Order from "../models/order.model.js";
import mongoose from "mongoose";

const createAOrder = async (req, res) => {
    try {
        const { items, ...orderData } = req.body;
        
        // Extract product IDs and handle both MongoDB ObjectIDs and Google Books string IDs
        const productIds = items.map(item => {
            // If it's already a valid MongoDB ID, use it directly
            if (mongoose.Types.ObjectId.isValid(item._id)) {
                return item._id;
            }
            
            // For Google Books IDs or other non-MongoDB IDs, store as a string or create a reference object with additional data
            return {
                googleBookId: item._id,
                title: item.title,
                price: item.price,
                author: item.author
            };
        });
        
        // Create the order with both the order data and processed product IDs
        const newOrder = new Order({
            ...orderData,
            productIds,
            itemDetails: items
        });
        
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        console.log("Error creating order: ", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });    
    }
};

const getOrderByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await Order.find({ email }).sort({ createdAt: -1 });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "Orders not found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.log("Error fetching order: ", error);
        res.status(500).json({ message: "Failed to fetch the order" });    
    }
};

export {
    createAOrder,
    getOrderByEmail
};