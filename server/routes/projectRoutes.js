const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
} = require("../controllers/projectController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router
  .route("/")
  .post(authorize("owner", "admin"), createProject)
  .get(getProjects);

router
  .route("/:id")
  .get(getProjectById)
  .put(authorize("owner", "admin"), updateProject)
  .delete(authorize("owner", "admin"), deleteProject);

router.patch(
  "/:id/status",
  authorize("owner", "admin"),
  updateProjectStatus
);

module.exports = router;