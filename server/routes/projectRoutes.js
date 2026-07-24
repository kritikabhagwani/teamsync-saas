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
const { projectValidation } = require("../middleware/validation");

router.use(protect);

router.post(
    "/",
    projectValidation,
    authorize("owner", "admin"),
    createProject
);

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