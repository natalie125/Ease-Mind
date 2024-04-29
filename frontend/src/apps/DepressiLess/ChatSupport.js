//ChatSupport.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buttonStyle, containerStyle,
} from './styles/Styles';

function ChatSupport() {
  const navigate = useNavigate();

  const handleTextClick = () => {
    // Navigate to the text input component
    navigate('/depressiless/TextClassification');
  };

  return (

    <div style={containerStyle}>
      <h2>Welcome to Support Chat</h2>
      <button type="button" onClick={handleTextClick} style={buttonStyle}>Text Input</button>
    </div>
  );
}

export default ChatSupport;
