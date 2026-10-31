const mongoose = require("mongoose");
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.userId });
    return res.status(201).json({ message: "Task created", task });
  } catch {
    return res.status(500).json({ message: "Unable to create task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ count: tasks.length, tasks });
  } catch {
    return res.status(500).json({ message: "Unable to retrieve tasks" });
  }
};

exports.getTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Task not found" });
    }
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ task });
  } catch {
    return res.status(500).json({ message: "Unable to retrieve task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updates = {};
    for (const field of ["title", "description", "status"]) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unable to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Task not found" });
    }
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Unable to delete task" });
  }
};