const express = require("express");

const {
  createOrganization,
  getOrganizationById,
  getMyOrganization,
} = require("../controllers/organizationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Logged-in user's organization
router.get("/my", protect, getMyOrganization);

// Create organization (any logged-in user)
router.post("/", protect, createOrganization);

// Get organization by ID
router.get("/:id", protect, getOrganizationById);

module.exports = router;