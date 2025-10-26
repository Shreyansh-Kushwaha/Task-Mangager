import React, { useState, useEffect } from 'react';
import { createTask, updateTask, getTaskById } from '../services/taskService';
import { useNavigate, useParams } from 'react-router-dom';

const TaskForm = () => {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', assignedTo: '' });
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode

  useEffect(() => {
    if (id) {
      getTaskById(id).then((task) => {
        setForm({ ...task, dueDate: task.dueDate?.slice(0,10) || '' });
      });
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiles = (e) => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    for (let i = 0; i < files.length; i++) formData.append('documents', files[i]);

    if (id) await updateTask(id, formData);
    else await createTask(formData);

    navigate('/tasks');
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="form-control">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="form-control">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Due Date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Documents</label>
          <input type="file" multiple onChange={handleFiles} className="form-control" />
        </div>
        <button className="btn btn-primary">{id ? 'Update Task' : 'Create Task'}</button>
      </form>
    </div>
  );
};

export default TaskForm;
