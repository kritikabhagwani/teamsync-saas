const crypto = require("crypto");

const Invite = require("../models/Invite");
const User = require("../models/User");
const Organization = require("../models/Organization");

// ==========================================
// Invite Member
// ==========================================
const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Logged-in user
    const invitedBy = await User.findById(req.user.id);

    if (!invitedBy) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User must belong to an organization
    if (!invitedBy.organization) {
      return res.status(400).json({
        success: false,
        message: "You are not part of any organization",
      });
    }

    // Find organization
    const organization = await Organization.findById(
      invitedBy.organization
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Check if email already belongs to a registered user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (
      existingUser &&
      existingUser.organization
    ) {
      return res.status(400).json({
        success: false,
        message: "User already belongs to an organization",
      });
    }

    // Check for existing pending invite
    const existingInvite = await Invite.findOne({
      email: email.toLowerCase(),
      organization: organization._id,
      accepted: false,
    });

    if (existingInvite) {
      return res.status(409).json({
        success: false,
        message: "An active invitation already exists",
      });
    }

    // Generate Invite Token
    const token = crypto
      .randomBytes(32)
      .toString("hex");

    // Expiry (7 Days)
    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    // Create Invite
    const invite = await Invite.create({
      email: email.toLowerCase(),
      organization: organization._id,
      invitedBy: invitedBy._id,
      role: role || "member",
      token,
      expiresAt,
    });

    // Invite Link
    const inviteLink =
      `http://localhost:5173/join/${token}`;

    return res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      invite,
      inviteLink,
    });

  } catch (error) {

    console.error(
      "Invite Member Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ==========================================
// Get All Members
// ==========================================
const getMembers = async (req, res) => {
  try {

    // Logged-in user
    const user = await User.findById(req.user.id);

    if (!user || !user.organization) {
      return res.status(404).json({
        success: false,
        message: "You are not part of any organization",
      });
    }

    // Find organization
    const organization = await Organization.findById(
      user.organization
    )
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      totalMembers: organization.members.length,
      members: organization.members,
    });

  } catch (error) {

    console.error("Get Members Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Remove Member
// ==========================================
const removeMember = async (req, res) => {
  try {

    const memberId = req.params.id;

    // Logged-in user
    const currentUser = await User.findById(req.user.id);

    if (!currentUser || !currentUser.organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Prevent owner/admin from removing themselves
    if (currentUser._id.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself",
      });
    }

    // Find member
    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Must belong to same organization
    if (
      !member.organization ||
      member.organization.toString() !==
      currentUser.organization.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Member does not belong to your organization",
      });
    }

    // Find organization
    const organization = await Organization.findById(
      currentUser.organization
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Remove member from organization
    organization.members = organization.members.filter(
      (memberObj) =>
        memberObj.user.toString() !== memberId
    );

    await organization.save();

    // Update user
    member.organization = null;
    member.role = "member";

    await member.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });

  } catch (error) {

    console.error("Remove Member Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ==========================================
// Update Member Role
// ==========================================
const updateMemberRole = async (req, res) => {
  try {

    const { role } = req.body;
    const memberId = req.params.id;

    // Validate role
    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either admin or member",
      });
    }

    // Logged-in user
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only owner can update roles
    if (currentUser.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the owner can update member roles",
      });
    }

    // Find member
    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Owner cannot change own role
    if (member._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot change their own role",
      });
    }

    // Member must belong to same organization
    if (
      !member.organization ||
      member.organization.toString() !==
      currentUser.organization.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Member does not belong to your organization",
      });
    }

    // Update role in User collection
    member.role = role;
    await member.save();

    // Update role in Organization collection
    const organization = await Organization.findById(
      currentUser.organization
    );

    const memberIndex = organization.members.findIndex(
      (m) => m.user.toString() === memberId
    );

    if (memberIndex !== -1) {
      organization.members[memberIndex].role = role;
      await organization.save();
    }

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });

  } catch (error) {

    console.error(
      "Update Member Role Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ========================================
// Join Organization
// ========================================
const joinOrganization = async (req, res) => {
  try {
    const { token } = req.params;

    // Find invite
    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link",
      });
    }

    // Check if invite is already used
    if (invite.accepted) {
      return res.status(400).json({
        success: false,
        message: "Invite has already been used",
      });
    }

    // Check if invite expired
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invite has expired",
      });
    }

    // Logged in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User already belongs to an organization
    if (user.organization) {
      return res.status(400).json({
        success: false,
        message: "User already belongs to an organization",
      });
    }

    // Optional security check
    if (user.email !== invite.email) {
      return res.status(403).json({
        success: false,
        message: "This invite is not for your email",
      });
    }

    // Find organization
    const organization = await Organization.findById(
      invite.organization
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Add member
    organization.members.push({
      user: user._id,
      role: invite.role,
    });

    await organization.save();

    // Update user
    user.organization = organization._id;
    user.role = invite.role;

    await user.save();

    // Mark invite as accepted
    invite.accepted = true;
    await invite.save();

    return res.status(200).json({
      success: true,
      message: "Successfully joined organization",
      organization,
    });

  } catch (error) {
    console.error("Join Organization Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  joinOrganization,
  updateMemberRole,
  removeMember,
  getMembers,
  inviteMember,
};