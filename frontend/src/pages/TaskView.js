// src/pages/TaskView.js
import React, { useEffect, useState } from 'react';
import { getTaskById } from '../services/taskService';
import { useParams, useNavigate } from 'react-router-dom';

const TaskView = () => {
  const [task, setTask] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTaskById(id).then(setTask);
  }, [id]);

  if (!task) return <div className="container mt-5 text-center">Loading...</div>;

  const statusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-secondary">Pending</span>;
      case 'in-progress':
        return <span className="badge bg-info text-dark">In Progress</span>;
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      default:
        return <span className="badge bg-light text-dark">Unknown</span>;
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
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div
        className="card shadow-sm p-4"
        style={{ borderRadius: '15px', backgroundColor: '#f8f9fa' }}
      >
        <h2 className="fw-bold mb-3" style={{ fontFamily: 'Arial, sans-serif' }}>
          {task.title}
        </h2>

        <div className="mb-3 d-flex gap-3">
          <div>
            <strong>Status:</strong> {statusBadge(task.status)}
          </div>
          <div>
            <strong>Priority:</strong> {priorityBadge(task.priority)}
          </div>
        </div>

        <p className="mb-3" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          <strong>Description:</strong> {task.description || 'No description provided.'}
        </p>

        <p className="mb-4">
          <strong>Due Date:</strong>{' '}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
        </p>

        {task.documents?.length > 0 && (
          <div className="mt-3">
            <h5>Documents:</h5>
            <ul className="list-group list-group-flush">
              {task.documents.map((doc, idx) => (
                <li
                  key={idx}
                  className="list-group-item"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}
                >
                  <a
                    href={`http://localhost:1393/${doc}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    {doc.split('/').pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskView;
