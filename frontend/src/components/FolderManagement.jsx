import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FolderManagement = () => {
  const [folders, setFolders] = useState([]);
  const [forms, setForms] = useState([]);
  const [folderName, setFolderName] = useState("");
  const { folderId } = useParams();
  const navigate = useNavigate();

  const fetchFolders = async () => {
    try {
      console.log("fetching folders");

      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/folders/folders/:id",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFolders(response.data.output);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handlegetFolder = () => {
    fetchFolders();
  };

  const handleFormId = (id) => {
    localStorage.setItem("formId", id);
  };

  const handlegetForms = async (item) => {
    console.log(item._id);
    localStorage.setItem("folderId", item._id);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/folders/folders/${item._id}/forms`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setForms(response.data.forms);
      if (response.data.forms.length > 0) {
        localStorage.setItem("formId", response.data.forms[0]._id);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/folders/create-folder",
        { name: folderName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFolders([...folders, response.data]);
      setFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  // Delete Folder Functionality
  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/folders/folder/${folderId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Remove deleted folder from the list
      setFolders(folders.filter((folder) => folder._id !== folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  // Delete Form Functionality (fixed to pass form ID)
  const handleDeleteForm = async (formId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/folders/form/${formId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Remove deleted form from the list
      setForms(forms.filter((form) => form._id !== formId));
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  // Create Form in a specific folder and navigate to form creation
  const handleCreateForm = (folderId) => {
    localStorage.setItem("folderId", folderId); // Save folder ID for form creation
    navigate("/forms"); // Navigate to the form creation page
  };

  return (
    <div>
      <h1>Folder Management</h1>
      <div>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
        />
        <button onClick={handleCreateFolder}>Create Folder</button>
        <button onClick={handlegetFolder}>Get Data</button>
      </div>

      {/* Display Folders */}
      {folders.map((item, index) => (
        <div key={index}>
          <button onClick={() => handlegetForms(item)}>{item.name}</button>
          {/* Delete Folder Button */}
          <button onClick={() => handleDeleteFolder(item._id)}>Delete Folder</button>
          {/* Create Form Button inside the folder */}
          <button onClick={() => handleCreateForm(item._id)}>Create Form</button>
        </div>
      ))}

      {/* Display Forms */}
      {forms.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => {
              handleFormId(item._id);
              navigate("/forms");
            }}
          >
            {item.name}
          </button>
          {/* Delete Form Button */}
          <button onClick={() => handleDeleteForm(item._id)}>Delete Form</button>
        </div>
      ))}
    </div>
  );
};

export default FolderManagement;
