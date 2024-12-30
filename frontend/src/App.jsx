// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FolderManagement from './components/FolderManagement';
import FormBuilder from './components/FormBuilder';
import Chatbot from './components/Chatbot';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/folder' element={<FolderManagement/>}/>
        <Route path="/forms" element={<FormBuilder/>} />
        <Route path='/chatbot' element={<Chatbot/>}/>
         <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
