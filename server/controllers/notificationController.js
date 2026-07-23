const Notification=require("../models/Notification");

exports.getNotifications=async(req,res)=>{

const notifications=await Notification.find({

recipient:req.user._id

}).sort({

createdAt:-1

});

res.json({

success:true,

notifications

});

};

exports.markAsRead=async(req,res)=>{

const notification=await Notification.findByIdAndUpdate(

req.params.id,

{
read:true
},

{
new:true
}

);

res.json({

success:true,

notification

});

};