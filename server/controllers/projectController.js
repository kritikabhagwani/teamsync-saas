const Project = require("../models/Project");
const Organization = require("../models/Organization");
const logActivity=require("../utils/logActivity");

exports.createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      startDate,
      dueDate,
      members,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }
           
    

    const organization = await Organization.findById(
      req.user.organization
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      startDate,
      dueDate,
      members,
      organization: organization._id,
      createdBy: req.user._id,
    });

    await logActivity({
  organization: req.user.organization,
  user: req.user._id,
  action: "CREATE",
  entityType: "Project",
  entityId: project._id,
  description: `Created project "${project.name}"`,
});

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
  organization: req.user.organization,
})
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "description",
      "status",
      "dueDate",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        organization: req.user.organization,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await logActivity({
  organization: req.user.organization,
  user: req.user._id,
  action: "UPDATE",
  entityType: "Project",
  entityId: project._id,
  description: `Updated project "${project.name}"`,
});

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await logActivity({
  organization: req.user.organization,
  user: req.user._id,
  action: "DELETE",
  entityType: "Project",
  entityId: project._id,
  description: `Deleted project "${project.name}"`,
});

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        organization: req.user.organization,
      },
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await logActivity({
  organization: req.user.organization,
  user: req.user._id,
  action: "UPDATE",
  entityType: "Project",
  entityId: project._id,
  description: `Changed project "${project.name}" status to "${project.status}"`,
});

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};