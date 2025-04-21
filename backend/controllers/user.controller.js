import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../middleware/passwordUtils.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configure cookie options based on environment
const getCookieOptions = () => {
    return {
        httpOnly: true,
        secure: NODE_ENV === 'production', // Only use secure in production
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site cookies in production
        maxAge: 3600000, // 1 hour in milliseconds
        path: '/'
    };
};

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await User.findOne({ username });
        
        if (!admin) {
            return res.status(401).send({ message: "Admin not found" });
        }
        
        // Use comparePassword utility to check password
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password" });
        }
        
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Set token in HTTP-only cookie
        res.cookie('auth_token', token, getCookieOptions());

        return res.status(200).json({
            message: "Authentication successful",
            user: {
                username: admin.username,
                role: admin.role
            }
        });
    } catch (error) {
        console.log("Failed to login as admin: ", error);
        return res.status(401).send({ message: "Failed to login" });
    }
};

export const userLogin = async(req,res)=>{
    const {username, password} = req.body
    try {
        const user = await User.findOne({username})

        if(!user){
            return res.status(401).json({message: "User failed to login"});
        }

        const isPassValid = await comparePassword(password, user.password);
        if(!isPassValid){
            return res.status(404).json({message: "Invalid Password"})
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );
        
        // Set token in HTTP-only cookie
        res.cookie('auth_token', token, getCookieOptions());
        
        return res.status(200).json({
            message: "Authentication successful",
            user: {
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Failed to login user: ", error);
        return res.status(401).send({ message: "Failed to login" });
    }
};

// Add a logout endpoint to clear the cookie
export const logout = async (req, res) => {
    try {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Logout error: ", error);
        return res.status(500).json({ message: "Failed to logout" });
    }
};