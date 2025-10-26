// backend/controllers/taskController.js
import fs from 'fs';
import path from 'path';
import Task from '../models/Task.js';

// ✅ Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const documents = req.files?.map((file) => file.path) || [];

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      documents,
    });

    console.log('BODY:', req.body);
    console.log('FILES:', req.files);


    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Tasks (with filters + sorting + pagination)
export const getTasks = async (req, res) => {
  try {
    const { status, priority, sort, page = 1, limit = 5 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;

    let taskQuery = Task.find(query)
      .populate('assignedTo', 'email role')
      .skip(skip)
      .limit(parseInt(limit));

    if (sort) taskQuery = taskQuery.sort(sort);

    const [tasks, total] = await Promise.all([
      taskQuery,
      Task.countDocuments(query),
    ]);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    Object.assign(task, req.body);

    if (req.files && req.files.length > 0) {
      task.documents = [
        ...(task.documents || []),
        ...req.files.map((file) => file.path),
      ];
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Download file for a task
export const downloadFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const filePath = path.join(process.cwd(), 'uploads', filename);

    // Check if this file actually belongs to the task
    const belongsToTask = task.documents.some((doc) =>
      doc.includes(filename)
    );

    if (!belongsToTask) {
      return res.status(403).json({ message: 'File does not belong to this task' });
    }

    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ message: 'File not found on server' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
