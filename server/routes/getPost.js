import express from "express";
import postSchema from "../mongodb/models/post.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { id } = req.query;     

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    // Example: search posts where userId equals the id
    const posts = await postSchema.find({ admin: id });
    
    return res.json(posts); 
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
