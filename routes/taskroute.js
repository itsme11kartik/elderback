const express = require('express');
const Task = require('../models/taskmodel'); 
const router = express.Router();


router.get('/getfull', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});
router.get('/get/:username', async (req, res) => {
  try {
    const username = req.params.username;  // Extract username from params
    const tasks = await Task.find({ name: username }); // Query by the correct field
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});


router.put('/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});


router.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;