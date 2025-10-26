// src/pages/TaskList.js
import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/taskService';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const params = { ...filters, page, limit: 6, sort: 'dueDate' };
    const data = await getTasks(params);
    setTasks(data.tasks);
    setPages(data.pages);
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      fetchTasks();
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-secondary">Pending</span>;
      case 'in-progress':
        return <span className="badge bg-info text-dark">In Progress</span>;
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      default:
        return <span className="badge bg-light">Unknown</span>;
    }
  };

  const priorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <span className="badge bg-success">Low</span>;
      case 'medium':
        return <span className="badge bg-warning text-dark">Medium</span>;
      case 'high':
        return <span className="badge bg-danger">High</span>;
      default:
        return <span className="badge bg-light">-</span>;
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Tasks Dashboard</h2>
        <button
          className="btn btn-lg text-white"
          style={{
            background: 'linear-gradient(90deg, #4b6cb7, #182848)',
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/tasks/create')}
        >
          + Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="form-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="form-select"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Task Cards */}
      <div className="row g-4">
        {tasks.length === 0 && (
          <div className="col-12 text-center text-muted fs-5">No tasks found.</div>
        )}
        {tasks.map((task) => (
          <div key={task._id} className="col-md-4">
            <div
              className="card h-100 shadow-sm border-0"
              style={{ borderRadius: '15px', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{task.title}</h5>
                <p className="mb-2">{task.description || 'No description provided.'}</p>

                <div className="mb-3">
                  {statusBadge(task.status)} {priorityBadge(task.priority)}
                </div>

                <p className="text-muted mb-3">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </p>

                <div className="mt-auto d-flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/tasks/view/${task._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/tasks/edit/${task._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Pagination page={page} pages={pages} setPage={setPage} />
      </div>
    </div>
  );
};

export default TaskList;
