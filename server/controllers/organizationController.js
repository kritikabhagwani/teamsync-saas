const Organization = require("../models/Organization");
const User = require("../models/User");

// ==========================================
// Create Organization
// ==========================================
const createOrganization = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    // Logged-in user
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

    // Check duplicate organization name
    const existingOrganization = await Organization.findOne({
      name: name.trim(),
    });

    if (existingOrganization) {
      return res.status(409).json({
        success: false,
        message: "Organization name already exists",
      });
    }

    // Create organization
    const organization = await Organization.create({
      name: name.trim(),
      description: description?.trim() || "",
      logo: logo || "",
      owner: user._id,

      members: [
        {
          user: user._id,
          role: "owner",
        },
      ],
    });

    // Update user
    user.organization = organization._id;
    user.role = "owner";

    await user.save();

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });

  } catch (error) {
    console.error("Create Organization Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Get Organization By ID
// ==========================================
const getOrganizationById = async (req, res) => {
  try {

    const organization = await Organization.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      organization,
    });

  } catch (error) {

    console.error("Get Organization Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Get My Organization
// ==========================================
const getMyOrganization = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || !user.organization) {
      return res.status(404).json({
        success: false,
        message: "No organization found",
      });
    }

    const organization = await Organization.findById(user.organization)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      organization,
    });

  } catch (error) {

    console.error("Get My Organization Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createOrganization,
  getOrganizationById,
  getMyOrganization,
};