import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
    // Get token from cookies instead of headers
    const token = req.cookies.auth_token;
    
    if(!token){
        return res.status(401).json({ message: "Access Denied. No token provided."})
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({message: "Invalid credentials"})
        }
        req.user = user;
        next(); 
    })
}

export default verifyAdminToken;