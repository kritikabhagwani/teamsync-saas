const Project = require("../models/Project");
const Organization = require("../models/Organization");
const logActivity=require("../utils/logActivity");
const APIFeatures = require("../utils/apiFeatures");


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
    const features = new APIFeatures(
      Project.find({
        organization: req.user.organization,
      })
        .populate("createdBy", "name email")
        .populate("members", "name email"),
      req.query
    )
      .search("name")
      .sort()
      .paginate();

    const projects = await features.query;

    // Count matching projects
    const countFilter = {
      organization: req.user.organization,
    };

    if (req.query.search) {
      countFilter.name = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const totalProjects = await Project.countDocuments(countFilter);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    res.status(200).json({
      success: true,
      page,
      limit,
      totalProjects,
      totalPages: Math.ceil(totalProjects / limit),
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