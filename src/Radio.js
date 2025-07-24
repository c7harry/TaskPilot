//https://uiverse.io/Shoh2008/bad-starfish-74

import React from 'react';
import styled from 'styled-components';

const Radio = ({ profile, setProfile }) => {
  return (
    <StyledWrapper>
      <div className="radio-input">
        <div className="radio-option">
          <input 
            name="radio" 
            type="radio" 
            className="input" 
            checked={profile === 'Work'} 
            onChange={() => setProfile('Work')}
          />
          <label className="radio-label" onClick={() => setProfile('Work')}>Work</label>
        </div>
        <div className="radio-option">
          <input 
            name="radio" 
            type="radio" 
            className="input" 
            checked={profile === 'Personal'} 
            onChange={() => setProfile('Personal')}
          />
          <label className="radio-label" onClick={() => setProfile('Personal')}>Personal</label>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .radio-input {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .radio-option:hover {
    background-color: rgba(59, 130, 246, 0.1);
  }

  .radio-label {
    font-size: 11px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
  }

  .radio-label:hover {
    color: #1f2937;
  }

  .input {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    margin: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #d1d5db;
    background-color: #ffffff;
    transition: all 0.2s ease;
    outline: none;
    position: relative;
  }

  .input:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  .input:checked {
    border-color: #3b82f6;
    background-color: #3b82f6;
    transform: scale(1.1);
  }

  .input:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ffffff;
  }

  .input:active {
    transform: scale(0.95);
  }

  .input:checked + .radio-label {
    color: #3b82f6;
    font-weight: 600;
  }

  .radio-option:has(.input:checked) {
    background-color: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  /* Dark mode styles */
  .dark & .radio-option {
    border: 1px solid transparent;
  }

  .dark & .radio-option:hover {
    background-color: rgba(96, 165, 250, 0.1);
  }
  
  .dark & .radio-label {
    color: #d1d5db;
  }
  
  .dark & .radio-label:hover {
    color: #f3f4f6;
  }

  .dark & .input {
    border-color: #6b7280;
    background-color: #374151;
  }

  .dark & .input:hover {
    border-color: #60a5fa;
  }

  .dark & .input:checked {
    border-color: #60a5fa;
    background-color: #60a5fa;
  }
  
  .dark & .input:checked + .radio-label {
    color: #60a5fa;
  }

  .dark & .radio-option:has(.input:checked) {
    background-color: rgba(96, 165, 250, 0.1);
    border-color: rgba(96, 165, 250, 0.2);
  }
`;

export default Radio;
