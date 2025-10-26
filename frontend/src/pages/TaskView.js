import React, { useEffect, useState } from 'react';
import { getTaskById } from '../services/taskService';
import { useParams } from 'react-router-dom';

const TaskView = () => {
  const [task, setTask] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getTaskById(id).then(setTask);
  }, [id]);

  if (!task) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{task.title}</h2>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</p>

      <h5>Documents:</h5>
      <ul>
        {task.documents?.map((doc, idx) => (
          <li key={idx}>
            <a href={`http://localhost:1393/${doc}`} target="_blank" rel="noreferrer">
              {doc.split('/').pop()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskView;
