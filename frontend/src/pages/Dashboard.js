import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ setToken }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleStatus = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`,
        { status: task.status === 'pending' ? 'completed' : 'pending' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const editTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditTitle('');
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const themes = [
    { name: 'dark', color: '#7c3aed', label: 'Dark' },
    { name: 'light', color: '#3b82f6', label: 'Light' },
    { name: 'soft', color: '#ec4899', label: 'Soft' },
    { name: 'sunset', color: '#f97316', label: 'Sunset' }
  ];

  return (
    <>
      <nav className="navbar">
        <h1>Ticked</h1>
        <div className="theme-switcher">
          {themes.map(t => (
            <div
              key={t.name}
              className={`theme-dot ${t.name} ${theme === t.name ? 'active' : ''}`}
              style={{ backgroundColor: t.color }}
              onClick={() => setTheme(t.name)}
              title={t.label}
            />
          ))}
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h2>My Tasks</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <form className="add-task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">+ Add Task</button>
        </form>

        <div className="tasks">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>🎉 No tasks yet!</p>
              <p>Add your first task above</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-card ${task.status}`}>
                <div className="task-info">
                  {editId === task._id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                      />
                      <button className="complete-btn" onClick={() => editTask(task._id)}>Save</button>
                      <button className="pending-btn" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      <span className={`status-badge ${task.status}`}>
                        {task.status}
                      </span>
                    </>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    className={task.status === 'pending' ? 'complete-btn' : 'pending-btn'}
                    onClick={() => toggleStatus(task)}
                  >
                    {task.status === 'pending' ? '✓ Complete' : '↩ Undo'}
                  </button>
                  <button className="pending-btn" onClick={() => { setEditId(task._id); setEditTitle(task.title); }}>
                    ✏️
                  </button>
                  <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;