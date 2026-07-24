const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// ==========================================
// Upload Profile Image
// ==========================================
exports.uploadProfileImage = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "teamsync/users",
      }
    );

    // Update user's profile image
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: result.secure_url,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Upload Profile Image Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};