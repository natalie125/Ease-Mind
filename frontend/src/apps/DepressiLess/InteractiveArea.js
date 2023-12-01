//InteractiveArea.js

import React from 'react';

const interactiveAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #000',
  margin: '10px',
  padding: '20px',
  cursor: 'pointer',
  width: '150px', 
  height: '150px', 
  borderRadius: '5px', 
};

const iconStyle = {
  marginBottom: '10px', // space between icon and title
  width: '50px', // adjust size as needed
  height: '50px', // adjust size as needed
};

const InteractiveArea = ({ title, icon, onClick }) => {
  return (
    <div style={interactiveAreaStyle} onClick={onClick}>
      {icon && <img src={icon} alt={title} style={iconStyle} />}
      <div>{title}</div>
    </div>
  );
};

export default InteractiveArea;
