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
    const params = { ...filters, page, limit: 5, sort: 'dueDate' };
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

  return (
    <div className="container mt-4">
      <h2>Tasks</h2>
      <button className="btn btn-primary mb-3" onClick={() => navigate('/tasks/create')}>
        Create Task
      </button>

      {/* Filters */}
      <div className="mb-3">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="me-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => navigate(`/tasks/view/${task._id}`)}>View</button>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/tasks/edit/${task._id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} pages={pages} setPage={setPage} />
    </div>
  );
};

export default TaskList;
