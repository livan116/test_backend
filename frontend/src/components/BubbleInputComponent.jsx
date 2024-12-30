import React from 'react';

const BubbleInputComponent = ({ label, type, inputType, sequence }) => {
  return (
    <div className="bubble-input-component">
      <div className="sequence-indicator">{sequence}</div>
      {type === 'bubble' ? (
        <div className="bubble">{label}</div>
      ) : (
        <div className="input-field">
          <label>{label}</label>
          {inputType === 'text' && <input type="text" />}
          {inputType === 'email' && <input type="email" />}
          {inputType === 'number' && <input type="number" />}
          {inputType === 'date' && <input type="date" />}
        </div>
      )}
    </div>
  );
};

export default BubbleInputComponent;
