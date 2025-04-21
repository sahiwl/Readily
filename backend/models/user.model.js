import mongoose from 'mongoose';
import { hashPassword } from '../src/middleware/passwordUtils.js';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now  
    },
      updatedAt: {
        type: Date,
        default: Date.now
      }
});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    
    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;