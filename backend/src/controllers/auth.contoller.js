import User from "../models/User.js";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

async function signup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if(!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({email}); 
    if(existingUser) {
      return res.status(400).json({ message: "Email already exists, please provide a different email" });
    }
    
    const idx = Math.floor(Math.random() * 100) + 1; // generate a random number between 1 and 100
    const profilePic = `https://avatar.iran.liara.run/public/${idx}.png`; // use the random number in the URL
    
    // create a new user
    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic : profilePic,
    });

    // create a jwt token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      httponly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

    });

    res.status(201).json({ user: newUser , sucess: true, message: "User created successfully" });

  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "error in signup", error: error.message });
  }
}          
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(401).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({email}); 
    if(!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await user.comparePassword(password); 
    if(!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

    // create a jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    res.cookie("jwt", token, {
      httponly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ user, success: true, message: "Login successful" });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "error in login", error: error.message });
  }
}

async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
}

export { login, signup, logout };