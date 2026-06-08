import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <h2>My Tasks</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={addTask}>
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
        <button type="submit">Add Task</button>
      </form>

      <div className="tasks">
        {tasks.map(task => (
          <div key={task._id} className={`task ${task.status}`}>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span>{task.status}</span>
            </div>
            <div className="task-actions">
              <button onClick={() => toggleStatus(task)}>
                {task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;