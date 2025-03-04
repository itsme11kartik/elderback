const express = require("express");
const Task = require("../models/taskmodel"); 
const RequestedTask = require("../models/requestedTask"); 
const router = express.Router();
const mongoose = require("mongoose");

router.put("/requested-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Received request to update task ${id} with status: ${status}`);

 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const updatedTask = await RequestedTask.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Task updated successfully:", updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("❌ Error updating task status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/get/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const tasks = await Task.find({ name: username }); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/tasks",async(req,res)=>{
  try{
    const tasks=await Task.find();
    res.json(tasks);
  }catch(error){
    res.status(500).json({message:error.message});
  }
})

router.post("/request-task", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { task, requestedBy, requestedTo, status } = req.body;

    if (!task || !requestedBy || !requestedTo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = new RequestedTask({
      task,
      requestedBy,
      requestedTo,
      status: status || "Pending",
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task request:", error.message);
    res.status(500).json({ error: "Failed to create task request", details: error.message });
  }
});

router.post("/requested-task", async (req, res) => {
  try {
    const newTask = new RequestedTask(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task request", details: error.message });
  }
});


router.put("/task/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task", details: error.message });
  }
});

router.get("/requested-task/:username", async (req, res) => {
  try {
    const name = req.params.username;
    const tasks = await RequestedTask.find({ requestedTo: name });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
});

router.get("/request-task/:username", async (req, res) => {
  try {
    const name = req.params.username;
    const tasks = await RequestedTask.find({ requestedBy: name });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
});

router.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

router.put("/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

router.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
