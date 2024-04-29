// StepIndicator.js

import React from 'react';
import PropTypes from 'prop-types';
import userInfoLogo from '../../images/userInfoLogo.png';

export default function StepIndicator({ currentStep }) {
  const steps = [
    'Personal Information',
    // 'Contact Information',
    'Mental Health History',
    'Medical History',
  ];

  const stepIndicatorStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '20px',
    gap: '10px',
    backgroundColor: '#E2E9F9',
    borderRight: '2px solid #DBE5FB',
  };

  const stepStyle = {
    padding: '10px',
    cursor: 'pointer',
  };

  const activeStepStyle = {
    ...stepStyle,
    color: 'white',
    backgroundColor: '#5D6D7E',
  };

  const logoStyle = {
    alignSelf: 'center',
    width: '300px',
    height: 'auto',
    marginBottom: '20px',
  };

  return (
    <div style={stepIndicatorStyle}>
      <img src={userInfoLogo} alt="Logo" style={logoStyle} />
      {steps.map((step, index) => (
        <div key={step} style={index === currentStep ? activeStepStyle : stepStyle}>
          Step
          {' '}
          {index + 1}
          :
          {' '}
          {step}
        </div>
      ))}
    </div>
  );
}

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
};
