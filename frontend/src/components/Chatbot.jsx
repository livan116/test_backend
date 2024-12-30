import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chatbot({ formId }) {
  const [formFields, setFormFields] = useState([]);  // Form fields fetched from backend
  const [currentIndex, setCurrentIndex] = useState(0);  // Current field in sequence
  const [responses, setResponses] = useState({});  // Store user responses
  const [loading, setLoading] = useState(true);  // Loading state for fetching form data

  // Fetch the form data from backend
  useEffect(() => {
    async function fetchFormData() {
      try {
        const response = await axios.get(`/api/form/${formId}`);
        if (response.data.formFields) {
          setFormFields(response.data.formFields);  // Set the fetched fields
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form data", error);
        setLoading(false);
      }
    }
    fetchFormData();
  }, [formId]);

  // Handle input field changes
  const handleInputChange = (e) => {
    setResponses({
      ...responses,
      [e.target.name]: e.target.value,  // Update the corresponding response
    });
  };

  // Proceed to next bubble/input
  const handleNext = async () => {
    const currentField = formFields[currentIndex];

    // If there's no current field, prevent proceeding
    if (!currentField) return;

    // Save the response for input fields
    if (currentField.type === 'input') {
      await axios.post(`/api/form/${formId}/response`, {
        fieldId: currentField._id,
        response: responses[currentField._id] || '',
      });
    }

    // Move to the next field or complete the form
    if (currentIndex < formFields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Thank you for completing the form!");
    }
  };

  // Render form field (bubble or input)
  const renderField = (field) => {
    switch (field.type) {
      case 'bubble':
        return <div className="chat-bubble">{field.label}</div>;
      case 'input':
        return (
          <div className="chat-input">
            <input
              type={field.inputType}
              name={field._id}
              value={responses[field._id] || ''}
              onChange={handleInputChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;

  const currentField = formFields[currentIndex];

  // Ensure that currentField is valid before rendering
  if (!currentField) {
    return <div>Form is incomplete or corrupted. Please try again later.</div>;
  }

  return (
    <div className="chatbot-container">
      <div className="chat-box">
        {formFields.slice(0, currentIndex + 1).map((field, index) => (
          <div key={index}>
            {renderField(field)}
          </div>
        ))}
      </div>

      <button onClick={handleNext} className="next-button">
        {currentIndex === formFields.length - 1 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}

export default Chatbot;
