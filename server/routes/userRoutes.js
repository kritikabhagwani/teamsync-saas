const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const upload=require("../middleware/upload");
const { uploadProfileImage } = require("../controllers/userController");

const router = express.Router();

// Current user's profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.post(
"/profile-image",
protect,
upload.single("image"),
uploadProfileImage
);


module.exports = router;