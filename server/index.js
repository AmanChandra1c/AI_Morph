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
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
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

app.get("/", async (req, res) => {
    res.send("Hello there");
});

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL)
        app.listen(8000, () =>
            console.log("Server has started on port http://localhost:8000")
        );
    } catch (error) {
        console.log(error)
    }
};

startServer();
