import React, { useState, useEffect } from "react";
import axios from "axios";

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState("");
  const formId = localStorage.getItem("formId"); // Get formId from localStorage or from URL parameters

  // Fetch form data when the component mounts
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (formId) {
          const response = await axios.get(
            `http://localhost:5000/api/folders/form/${formId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.success) {
            const form = response.data.form;
            setFormName(form.name); // Set form name
            setFields(form.fields); // Set the form fields (bubbles and inputs)
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [formId]); // Only fetch data once when formId changes or component mounts

  // Handle adding a bubble
  const addBubble = (type) => {
    const newField = {
      label: `${type} Bubble`,
      type: "bubble",
      sequence: fields.length + 1,
      prefilled: true, // Bubble will have prefilled data
      value: "", // Editable for the form creator
    };
    setFields([...fields, newField]);
  };

  // Handle adding an input field
  const addInput = (inputType) => {
    const newField = {
      label: `${inputType.charAt(0).toUpperCase() + inputType.slice(1)} Input`,
      type: "input",
      inputType: inputType,
      sequence: fields.length + 1,
      value: "", // Editable input field for user
    };
    setFields([...fields, newField]);
  };

  // Handle updating field value for both bubble and input fields
  const handleFieldChange = (index, newValue) => {
    const updatedFields = [...fields];
    updatedFields[index].value = newValue; // Update the value in state
    setFields(updatedFields);
  };

  // Handle saving the form data
  // Handle saving the updated form data
  const saveForm = async () => {
    try {
      const selectedFolderId = localStorage.getItem("folderId"); // Retrieve the folder ID from localStorage

      const response = await axios.put(
        `http://localhost:5000/api/folders/form/${formId}`, // PUT request to update the form by formId
        {
          formBotName: formName, // Form name
          fields: fields, // Updated fields (contains both bubbles and inputs)
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        alert("Form updated successfully!");
      }
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  // Handle generating a shareable link
  const shareForm = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/formbuilder/share",
        { fields },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Form link generated!");
    } catch (error) {
      console.error("Error sharing form:", error);
    }
  };

  const deleteField = (index) => {
    const updatedFields = fields.filter((_, fieldIndex) => fieldIndex !== index);
    setFields(updatedFields);
  };

  return (
    <div className="form-builder-container">
      {/* Navbar */}
      <div className="navbar">
        <h1>Form Builder</h1>
        <button onClick={saveForm}>Save</button>
        <button onClick={shareForm}>Share</button>
      </div>

      {/* Left Sidebar for Bubbles and Input Fields */}
      <div className="sidebar">
        <h3>Bubbles</h3>
        <button onClick={() => addBubble("Text")}>Text Bubble</button>
        <button onClick={() => addBubble("Image")}>Image Bubble</button>
        <button onClick={() => addBubble("Video")}>Video Bubble</button>
        <button onClick={() => addBubble("GIF")}>GIF Bubble</button>

        <h3>Input Fields</h3>
        <button onClick={() => addInput("text")}>Text Input</button>
        <button onClick={() => addInput("email")}>Email Input</button>
        <button onClick={() => addInput("number")}>Number Input</button>
        <button onClick={() => addInput("date")}>Date Input</button>
      </div>

      {/* Form Workspace where bubbles and input fields are displayed */}
      <div className="form-workspace">
        {fields.map((field, index) => (
          <div key={index} className="form-field">
            <label>{field.label}</label>
            {field.type === 'input' ? (
              <input
                type={field.inputType}
                placeholder={`Enter ${field.inputType}`}
                value={field.value}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
            ) : (
              <input
                type="text"
                placeholder="Enter bubble data"
                value={field.value}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
            )}
            {/* Add Delete Button */}
            <button onClick={() => deleteField(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
