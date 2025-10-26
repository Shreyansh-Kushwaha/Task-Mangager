// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import TaskView from './pages/TaskView';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TaskList />
            </PrivateRoute>
          }
        />

        <Route path="/tasks/create" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        <Route path="/tasks/edit/:id" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        <Route path="/tasks/view/:id" element={<PrivateRoute><TaskView /></PrivateRoute>} />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
