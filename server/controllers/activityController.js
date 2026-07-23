const Activity = require("../models/Activity");

// Get all activities of logged-in user's organization
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
  organization: req.user.organization,
})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single activity
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Prevent users from viewing activities of another organization
    if (
      activity.organization.toString() !==
      req.user.organization.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};