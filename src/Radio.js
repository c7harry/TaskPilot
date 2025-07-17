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
    gap: 8px;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .radio-label {
    font-size: 12px;
    font-weight: 500;
    color: #000000;
    cursor: pointer;
    user-select: none;
    transition: color 0.2s ease;
  }

  .radio-label:hover {
    color: #374151;
  }

  .input {
    -webkit-appearance: none;
   /* remove default */
    display: block;
    margin: 0;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    cursor: pointer;
    vertical-align: middle;
    box-shadow: hsla(0,0%,100%,.15) 0 1px 1px, inset hsla(0,0%,0%,.5) 0 0 0 1px;
    background-color: hsla(0,0%,0%,.2);
    background-image: -webkit-radial-gradient( hsla(200,100%,90%,1) 0%, hsla(200,100%,70%,1) 15%, hsla(200,100%,60%,.3) 28%, hsla(200,100%,30%,0) 70% );
    background-repeat: no-repeat;
    -webkit-transition: background-position .15s cubic-bezier(.8, 0, 1, 1),
      -webkit-transform .25s cubic-bezier(.8, 0, 1, 1);
    outline: none;
  }

  .input:checked {
    -webkit-transition: background-position .2s .15s cubic-bezier(0, 0, .2, 1),
      -webkit-transform .25s cubic-bezier(0, 0, .2, 1);
  }

  .input:active {
    -webkit-transform: scale(1.3);
    -webkit-transition: -webkit-transform .1s cubic-bezier(0, 0, .2, 1);
  }

  /* The up/down direction logic */
  .input,
  .input:active {
    background-position: 0 16px;
  }

  .input:checked {
    background-position: 0 0;
  }

  .input:checked ~ .input,
  .input:checked ~ .input:active {
    background-position: 0 -16px;
  }

  .input:checked + .radio-label {
    color: #2563eb;
    font-weight: 600;
  }

  /* Dark mode styles using class-based approach */
  .dark & .radio-label {
    color: #f3f4f6;
  }
  
  .dark & .radio-label:hover {
    color: #ffffff;
  }
  
  .dark & .input:checked + .radio-label {
    color: #60a5fa;
  }
`;

export default Radio;
