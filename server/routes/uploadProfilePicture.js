import express from "express";
import multer from "multer";
import User from "../mongodb/models/user.js";

const router = express.Router();

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    const { id } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        profilePicture: imageFile.buffer,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        ...updatedUser.toObject(),
        profilePicture: updatedUser.profilePicture
          ? `data:image/png;base64,${updatedUser.profilePicture.toString(
              "base64"
            )}`
          : null,
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
