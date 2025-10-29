import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("strictQuery", true);

  // Add TLS options
  const options = {
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    serverSelectionTimeoutMS: 10000,
  };

  mongoose
    .connect(url, options)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("MongoDB Connection Error:", err.message);
      process.exit(1);
    });
};

export default connectDB;
