const Notification=require("../models/Notification");

const sendNotification=async(recipient,message)=>{

await Notification.create({

recipient,
message

});

};

module.exports=sendNotification;