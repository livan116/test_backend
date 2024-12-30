// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/folders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(res.data.folders);
    };
    fetchFolders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Your Folders</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <div className="folder-list">
        {folders.length ? (
          folders.map((folder) => (
            <div key={folder._id} className="folder">
              <h3>{folder.name}</h3>
              <p>{folder.description}</p>
            </div>
          ))
        ) : (
          <p>No folders yet. Start by creating one!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
