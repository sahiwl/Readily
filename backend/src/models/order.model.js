import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        city:{
            type: String,
            required: true
        },
        country: String,
        state: String,
        zipcode: String
    },
    phone: {
        type: Number,
        required: true
    },
    // supports both ObjectId references and custom objects for google books
    productIds: {
        type: [mongoose.Schema.Types.Mixed],
        required: true
    },
    // stores complete item details for display purposes
    itemDetails: {
        type: Array
    },
    totalPrice: {
        type:Number,
        required: true
    }
}, {timestamps: true})

const Order = mongoose.model('Order', orderSchema)
export default Order