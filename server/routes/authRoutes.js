const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const { registerUser } = require("../controllers/authControllers");
router.post("/register", registerUser);

const { loginUser } = require("../controllers/authControllers");
router.post("/login", loginUser);
//loginUser is a function in authController.js.

router.get("/profile", protect, (req, res) => {
  if (!req.user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;