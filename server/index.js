import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import connectDB from "./mongodb/connect.js";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import postRoutes from "./routes/postRoutes.js";
import imgGenerateRoutes from "./routes/imgGenerateRoutes.js";
import createUserRoutes from "./routes/createUserRoutes.js";
import logInUserRoutes from "./routes/logInUserRoutes.js";
import getUser from "./routes/getUser.js";
import getPost from "./routes/getPost.js";
import profile from "./routes/profile.js";
import sendOTP from "./routes/sendOTP.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { setSessionStore } from "./routes/sendOTP.js";

dotenv.config();

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL_SESSIONS,
});

setSessionStore(store);

const app = express();

// Trust proxy in production (needed for secure cookies behind proxies)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security & performance middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(hpp());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// CORS with dynamic origin for prod
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
app.use(cookieParser());
// Keep high limits only if needed (image uploads). Reduce if possible to speed up parsing.
const bodyLimit = process.env.BODY_LIMIT || "25mb";
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ limit: bodyLimit, extended: true }));
// Basic health check
app.get("/healthz", (req, res) => res.status(200).send("ok"));

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/imgGenerate", imgGenerateRoutes);
app.use("/api/v1/create-user", createUserRoutes);
app.use("/api/v1/login-user", logInUserRoutes);
app.use("/api/v1/get-user", getUser);
app.use("/api/v1/get-post", getPost);
app.use("/api/v1/profile", profile);
app.use("/api/v1/send-otp", sendOTP);

app.get("/", async (req, res) => {
  res.send("Hello there");
});
// Centralized error handler (last)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);

    const server = app.listen(process.env.PORT, () =>
      console.log("Server started")
    );

    // Set keep-alive and timeouts for better production behavior
    server.keepAliveTimeout = 61 * 1000; // 61s
    server.headersTimeout = 65 * 1000; // 65s
    server.requestTimeout = 60 * 1000; // 60s
  } catch (error) {
    console.log(error);
  }
};

startServer();
