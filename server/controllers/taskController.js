const Task=require("../models/Task");
const Project=require("../models/Project");

// CREATE TASK

exports.createTask=async(req,res)=>{

try{


const {
title,
description,
project,
assignedTo,
priority,
dueDate
}=req.body;



const projectExists=await Project.findById(project);


if(!projectExists){

return res.status(404).json({
message:"Project not found"
});

}



const task=await Task.create({

title,
description,
project,
assignedTo,
priority,
dueDate,

createdBy:req.user._id

});



res.status(201).json({

success:true,
task

});


}

catch(error){

res.status(500).json({
message:error.message
});

}


};

exports.getTasks=async(req,res)=>{

try{


const tasks=await Task.find({

project:req.params.projectId

})

.populate(
"assignedTo",
"name email"
)

.populate(
"createdBy",
"name"
);



res.json({

success:true,
tasks

});


}

catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.getTaskById=async(req,res)=>{


try{


const task=await Task.findById(req.params.id)

.populate(
"assignedTo",
"name email"
)

.populate(
"comments.user",
"name"
);



if(!task){

return res.status(404).json({
message:"Task not found"
});

}



res.json({
success:true,
task
});


}

catch(error){

res.status(500).json({
message:error.message
});

}


};

exports.updateTask=async(req,res)=>{


try{


const task=await Task.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true,
runValidators:true
}

);



res.json({

success:true,
task

});


}

catch(error){

res.status(500).json({
message:error.message
});

}


};

exports.deleteTask=async(req,res)=>{


try{


await Task.findByIdAndDelete(req.params.id);


res.json({

success:true,

message:"Task deleted"

});


}

catch(error){

res.status(500).json({
message:error.message
});

}


};

exports.addComment=async(req,res)=>{


const task=await Task.findById(req.params.id);


task.comments.push({

user:req.user._id,

message:req.body.message

});


await task.save();


res.json({

success:true,

task

});


};

exports.uploadAttachment = async(req,res)=>{


const task=await Task.findById(req.params.id);



const result=
await cloudinary.uploader.upload(

`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,

{
folder:"teamsync/tasks"
}

);



task.attachments.push({

name:req.file.originalname,

url:result.secure_url,

uploadedBy:req.user._id

});


await task.save();



res.json({

success:true,

task

});


};