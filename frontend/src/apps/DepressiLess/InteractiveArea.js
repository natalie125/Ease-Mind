// InteractiveArea.js

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
  marginBottom: '10px',
  width: '50px',
  height: '50px',
};

// TODO: Fix following lint errors
// eslint-disable-next-line
function InteractiveArea({ title, icon, onClick }) {
  return (
    // TODO: Fix following lint errors
    // eslint-disable-next-line
    <div style={interactiveAreaStyle} onClick={onClick}>
      {icon && <img src={icon} alt={title} style={iconStyle} />}
      <div>{title}</div>
    </div>
  );
}

export default InteractiveArea;
