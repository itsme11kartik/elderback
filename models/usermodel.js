const mongoose = require("mongoose");
const usermodel =new mongoose.Schema({
    name:{
        type:String,
        requried:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
        enum:["Family","Elder"],
    }
})

module.exports = mongoose.model("User",usermodel);