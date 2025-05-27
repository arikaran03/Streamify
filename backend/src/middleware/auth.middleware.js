import jwt from "jsonwebtoken";
import User from "../models/User.js";


const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access, no token provided" });
        }        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded) {
            return res.status(401).json({ message: "Unauthorized access, invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Exclude password and version from the user object
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access, user not found" });
        }
        console.log("User found:", user);
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in auth middleware:", error);
        
        res.status(500).json({ message: "Internal server error in middleware" });
    }
};

export default protectRoute;