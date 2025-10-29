import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import imgGenerateRoutes from "./routes/imgGenerateRoutes.js";
import createUserRoutes from "./routes/createUserRoutes.js"
import logInUserRoutes from "./routes/logInUserRoutes.js";
import getUser from "./routes/getUser.js"
import getPost from "./routes/getPost.js"
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
app.use(
  cors({
    origin: "https://ai-morph-rdn9.onrender.com", 
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.JWT_SECRET  ,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({limit: "50mb", extended: true}))

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/imgGenerate", imgGenerateRoutes);
app.use("/api/v1/create-user", createUserRoutes);
app.use("/api/v1/login-user", logInUserRoutes);
app.use("/api/v1/get-user", getUser)
app.use("/api/v1/get-post", getPost)
app.use("/api/v1/profile", profile);
app.use("/api/v1/send-otp", sendOTP);


app.get("/", async (req, res) => {
    res.send("Hello there");
});

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(process.env.PORT, () =>
            console.log("Server started")
        );
    } catch (error) {
        console.log(error)
    }
};

startServer();
