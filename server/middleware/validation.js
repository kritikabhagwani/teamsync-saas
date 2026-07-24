const {body}=require("express-validator");


exports.projectValidation=[

body("name")
.notEmpty()
.withMessage("Project name required")

];