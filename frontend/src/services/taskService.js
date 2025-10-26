// src/services/taskService.js
import api from './api';

// Get tasks with filters, sort, pagination
export const getTasks = async (params) => {
  const res = await api.get('/tasks', { params });
  return res.data;
};

// Get single task by ID
export const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

// Create new task
export const createTask = async (formData) => {
  const res = await api.post('/tasks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Update existing task
export const updateTask = async (id, formData) => {
  const res = await api.put(`/tasks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Delete task
export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
