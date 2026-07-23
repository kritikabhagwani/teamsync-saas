const express = require("express");

const router = express.Router();

const {
  getActivities,
  getActivityById,
} = require("../controllers/activityController");

const { protect } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Get all activities
router.get("/", getActivities);

// Get single activity
router.get("/:id", getActivityById);

module.exports = router;