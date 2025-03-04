const mongoose = require('mongoose');

const requestedTask = new mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    requestedBy:{
        type:String,
        required:true
    },
    requestedTo:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending",
        enum: ['Accepted', 'Rejected', 'Pending']
    }
})

module.exports = mongoose.model("RequestedTask",requestedTask);