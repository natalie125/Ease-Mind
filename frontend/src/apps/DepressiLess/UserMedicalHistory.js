// UserMedicalHistory.js
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import StepIndicator from './StepIndicator';
import { AuthTokenContext } from '../../App';
import {
  containerWithStepsStyle, formContainerStyle, buttonStyle, inputContainerStyle, inputStyle,
} from './styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function UserMedicalHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext); // Assuming token is stored in AuthTokenContext

  const [medicalHistoryInfo, setMedicalHistoryInfo] = useState({
    pastMedicalHistory: '',
    familyMedicalHistory: '',
    medicationHistory: '',
    user_id: location.state?.userId,
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicalHistoryInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    if (!medicalHistoryInfo.pastMedicalHistory || !medicalHistoryInfo.familyMedicalHistory || !medicalHistoryInfo.medicationHistory) {
      newErrors.form = 'All fields are required.';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFeedbackMessage('Please correct the errors before submitting.');
      return;
    }

    await axios
      .post(
        `${BASEURL}/medical_history`,
        {
          pastMedicalHistory: medicalHistoryInfo.pastMedicalHistory,
          familyMedicalHistory: medicalHistoryInfo.familyMedicalHistory,
          medicationHistory: medicalHistoryInfo.medicationHistory,
          user_id: medicalHistoryInfo.user_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 201) {
          navigate('/DepressiLess');
        } else {
          setFeedbackMessage('Failed to submit medical history. Please try again.');
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setFeedbackMessage('Failed to submit medical history. Please correct the errors and try again.');
          // Optionally, display the error messages to the user
          setErrors(error.response.data.errors);
        } else {
          setFeedbackMessage('Failed to submit medical history. Please try again.');
        }
      });
  };

  return (
    <div style={containerWithStepsStyle}>
      <StepIndicator currentStep={2} />
      <div style={formContainerStyle}>
        <h3>
          Medical History:
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="pastMedicalHistory">Have you ever been diagnosed with any medical conditions or diseases?</label>
            <input
              type="text"
              id="pastMedicalHistory"
              name="pastMedicalHistory"
              value={medicalHistoryInfo.pastMedicalHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, please list them"
            />
            {errors.pastMedicalHistory && <p style={{ color: 'red' }}>{errors.pastMedicalHistory}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="familyMedicalHistory">Are there any medical conditions or diseases that run in your family?</label>
            <input
              type="text"
              id="familyMedicalHistory"
              name="familyMedicalHistory"
              value={medicalHistoryInfo.familyMedicalHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, specify your relation to those family members"
            />
            {errors.familyMedicalHistory && <p style={{ color: 'red' }}>{errors.familyMedicalHistory}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="medicationHistory">Are you currently taking any medications?</label>
            <input
              type="text"
              id="medicationHistory"
              name="medicationHistory"
              value={medicalHistoryInfo.medicationHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, please provide details"
            />
            {errors.medicationHistory && <p style={{ color: 'red' }}>{errors.medicationHistory}</p>}
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>
    </div>
  );
}

export default UserMedicalHistory;
