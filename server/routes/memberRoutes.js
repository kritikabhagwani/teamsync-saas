const express = require("express");

const {
  inviteMember,
  joinOrganization,
  getMembers,
  removeMember,
  updateMemberRole,
} = require("../controllers/memberController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
====================================
        MEMBER MANAGEMENT
====================================
*/

// Invite a new member
// Only Owner and Admin
router.post(
  "/invite",
  protect,
  authorize("owner", "admin"),
  inviteMember
);

// Join organization using invite token
// User must be logged in
router.post(
  "/join/:token",
  protect,
  joinOrganization
);

// Get all organization members
// Any organization member can view
router.get(
  "/",
  protect,
  getMembers
);

// Remove a member
// Only Owner and Admin
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  removeMember
);

// Update member role
// Only Owner
router.patch(
  "/:id/role",
  protect,
  authorize("owner"),
  updateMemberRole
);

module.exports = router;