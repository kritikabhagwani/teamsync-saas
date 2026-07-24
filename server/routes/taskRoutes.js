const express = require("express");

const router = express.Router();


const {
createTask,
getTasks,
getTaskById,
updateTask,
deleteTask,
addComment,
uploadAttachment

}=require("../controllers/taskController");


const {protect}=require("../middleware/authMiddleware");


router.use(protect);
const upload=require("../middleware/upload");


router.post("/",createTask);


router.get("/project/:projectId",getTasks);


router.get("/:id",getTaskById);


router.put("/:id",updateTask);


router.delete("/:id",deleteTask);


router.post("/:id/comment",addComment);

router.post(
"/:id/attachment",
protect,
upload.single("file"),
uploadAttachment
);



module.exports = router;