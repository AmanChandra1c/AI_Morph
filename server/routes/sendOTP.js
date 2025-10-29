import express from "express";
import sendOTPByEmail from "../mongodb/NodeMailer.js";
import { Store } from "express-session";
import User from "../mongodb/models/user.js";

const router = express.Router();
router.get("/", async (req, res) => {
  const { email } = req.query;
  console.log(email);
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    // If user already exists, don't send OTP
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    req.session.generatedOTP = otp;
    req.session.otpExpirationTime = Date.now() + 10 * 60 * 1000;
    req.session.adminEmail = email;
    await sendOTPByEmail(email, otp);

    res
      .status(200)
      .json({ message: "OTP sent successfully", sessionID: req.sessionID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// Store reference to session store (will be set by main app)
let sessionStore = null;

// Function to set session store reference from main app
export const setSessionStore = (store) => {
  sessionStore = store;
};

export const verifyOTP = async (otp, sessionID) => {
  // Check if session store is available
  if (!sessionStore) {
    console.error(
      "Session store not initialized. Call setSessionStore() in your main app."
    );
    return Promise.reject(new Error("Session store not initialized"));
  }

  return new Promise((resolve, reject) => {
    sessionStore.get(sessionID, (err, sessionData) => {
      if (err) return reject(err);
      if (!sessionData) return resolve(false); // session not found

      // check OTP and expiration
      if (
        sessionData.generatedOTP &&
        Date.now() < sessionData.otpExpirationTime &&
        parseInt(otp) === parseInt(sessionData.generatedOTP)
      ) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  });
};
