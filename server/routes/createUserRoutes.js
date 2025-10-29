// routes/userRoutes.js
import express from "express";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../mongodb/models/user.js";
import cookieParser from "cookie-parser";
const { verifyOTP } = await import("./sendOTP.js");

dotenv.config();
const router = express.Router();

// Validation helper
function validateUserInput({
  firstName,
  lastName,
  email,
  password,
  otp,
  sessionID,
}) {
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
  if (otp.length < 6) {
    return "otp must be at least 6 characters long";
  }
  if (!sessionID) return "Session ID is required";
  return null;
}

// POST: Create new user
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, otp } = req.body;
    const sessionID = req.headers["session-id"];

    // Validate input
    const validationError = validateUserInput({
      firstName,
      lastName,
      email,
      password,
      otp,
      sessionID,
    });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check if user exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(otp, sessionID);
    if (!isOTPValid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
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
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "User created successfully",
      token,
      user: {
        ...user.toObject(),
        profilePicture: user.profilePicture
          ? `data:image/png;base64,${user.profilePicture.toString("base64")}`
          : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
