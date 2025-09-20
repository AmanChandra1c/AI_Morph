import express from "express";
import multer from "multer";
import User from "../mongodb/models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    const { id, firstName, lastName } = req.body;
    const imageFile = req.file;    

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    if (req?.body?.oldPassword) {
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(req?.body?.oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid old password" });
      }
    }

    if (imageFile) {
      updateData.profilePicture = imageFile.buffer;
    }

    if (req?.body?.password) {
      const hashedPassword = await bcrypt.hash(req?.body?.password, 16);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
