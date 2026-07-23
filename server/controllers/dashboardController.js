const Project = require("../models/Project");
const Task = require("../models/Task");
const Organization = require("../models/Organization");

exports.getDashboard = async (req, res) => {
  try {

    const organizationId = req.user.organization;

    // Total Projects
    const totalProjects = await Project.countDocuments({
      organization: organizationId
    });

    // Get project IDs
    const projects = await Project.find({
      organization: organizationId
    }).select("_id");

    const projectIds = projects.map(project => project._id);

    // Total Tasks
    const totalTasks = await Task.countDocuments({
      project: { $in: projectIds }
    });

    // Completed Tasks
    const completedTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: "Done"
    });

    // Pending Tasks
    const pendingTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: { $ne: "Done" }
    });

    // High Priority
    const highPriorityTasks = await Task.countDocuments({
      project: { $in: projectIds },
      priority: "High"
    });
     
    const tasksByStatus = await Task.aggregate([
  {
    $match: {
      project: { $in: projectIds }
    }
  },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);

const tasksByPriority = await Task.aggregate([
  {
    $match: {
      project: { $in: projectIds }
    }
  },
  {
    $group: {
      _id: "$priority",
      count: { $sum: 1 }
    }
  }
]);


    // Members Count
    const organization = await Organization.findById(organizationId);

    const membersCount = organization.members.length;

    // Recent Tasks
    const recentTasks = await Task.find({
      project: { $in: projectIds }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(200).json({
      success: true,

      analytics: {

        totalProjects,

        totalTasks,

        completedTasks,

        pendingTasks,

        highPriorityTasks,

        membersCount,

        recentTasks,

        tasksByStatus,

        tasksByPriority
      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }
};

