const express = require("express");

const router = express.Router();


const {
createTask,
getTasks,
getTaskById,
updateTask,
deleteTask,
addComment

}=require("../controllers/taskController");


const {protect}=require("../middleware/authMiddleware");


router.use(protect);



router.post("/",createTask);


router.get("/project/:projectId",getTasks);


router.get("/:id",getTaskById);


router.put("/:id",updateTask);


router.delete("/:id",deleteTask);


router.post("/:id/comment",addComment);



module.exports = router;