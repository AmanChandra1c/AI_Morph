// routes/userRoutes.js
import express from "express";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../mongodb/models/user.js"
import cookieParser from "cookie-parser";

dotenv.config();
const router = express.Router();

// Validation helper
function validateUserInput({ firstName, lastName, email, password }) {
  if (!firstName || !lastName || !email || !password) {
    return "All fields are required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
}

// POST: Create new user
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;   

    // Validate input
    const validationError = validateUserInput({
      firstName,
      lastName,
      email,
      password,
    });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check if user exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(409).json({ error: "User already exists." });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 16);
    
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    
    // Generate JWT (email + user id)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Generate cookies
    res.cookie("token", token,{
        httpOnly: true,
        secure: false,
        sameSite:"lax",
        maxAge:3600000
    })

    res.status(200).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
