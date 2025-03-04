const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true, 
  },
  name: {
    type: String,
    required: true,
  },
  createdby:{
    type:String,
    required:true,
  },
  importanceLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'], 
    required: true,
  },
  completionTime: {
    type: Date, 
    default: Date.now,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  status:{
    type: String,
    default:"Pending",
    enum: ['Pending', 'Completed'],
    required: true,
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
