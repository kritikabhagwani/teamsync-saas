const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true
    },


    description:{
        type:String
    },


    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },


    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },


    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    priority:{
        type:String,
        enum:[
            "Low",
            "Medium",
            "High"
        ],
        default:"Medium"
    },


    status:{
        type:String,
        enum:[
            "Todo",
            "In Progress",
            "Review",
            "Done"
        ],
        default:"Todo"
    },


    dueDate:{
        type:Date
    },


    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },

            message:String,

            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]


},
{
    timestamps:true
});


module.exports = mongoose.model("Task",taskSchema);