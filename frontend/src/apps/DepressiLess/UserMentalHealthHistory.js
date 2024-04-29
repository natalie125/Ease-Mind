// UserMentalHealthHistory.js
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

function UserMentalHealthHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);

  const [mentalHealthInfo, setMentalHealthInfo] = useState({
    psychiatricHistory: '',
    stressLevels: '',
    copingMechanisms: '',
    user_id: location.state?.userId,
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentalHealthInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    if (!mentalHealthInfo.psychiatricHistory || !mentalHealthInfo.stressLevels || !mentalHealthInfo.copingMechanisms) {
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
        `${BASEURL}/mental_health_history`,
        {
          psychiatricHistory: mentalHealthInfo.psychiatricHistory,
          stressLevels: mentalHealthInfo.stressLevels,
          copingMechanisms: mentalHealthInfo.copingMechanisms,
          user_id: mentalHealthInfo.user_id,
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
          console.log('Submission successful:', response.data);
          console.log('Navigating with userId:', response.data.id);
          navigate('/DepressiLess/UserMedicalHistory', { state: { userId: response.data.id } });
        } else {
          console.log('Submission response not successful:', response);
          setFeedbackMessage('Failed to submit mental health history. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Submission error:', error.response || error);
        setFeedbackMessage('Failed to submit mental health history. Please try again.');
      });
  };

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFeedbackMessage('Please correct the errors before submitting.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASEURL}api/depressiLess/UserMentalHealthHistory`,
        mentalHealthInfo,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        console.log('yay');
        navigate('/DepressiLess/UserMedicalHistory');
      } else {
        console.log('sad');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to submit mental health history. Please try again.');
    }
  };
*/
  return (
    <div style={containerWithStepsStyle}>
      <StepIndicator currentStep={1} />
      <div style={formContainerStyle}>
        <h3>Mental Health History:</h3>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="psychiatricHistory">Have you previously been diagnosed with any mental health conditions? </label>
            <input
              type="text"
              id="psychiatricHistory"
              name="psychiatricHistory"
              value={mentalHealthInfo.psychiatricHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, can you please specify?"
            />
            {errors.psychiatricHistory && <p style={{ color: 'red' }}>{errors.psychiatricHistory}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="stressLevels">Can you describe how stressful situations typically feel like to you? </label>
            <input
              type="text"
              id="stressLevels"
              name="stressLevels"
              value={mentalHealthInfo.stressLevels}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Have you noticed any common patterns? Describe them."
            />
            {errors.stressLevels && <p style={{ color: 'red' }}>{errors.stressLevels}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="copingMechanisms">Are there specific strategies or activities that you find helpful in managing stress?</label>
            <input
              type="text"
              id="copingMechanisms"
              name="copingMechanisms"
              value={mentalHealthInfo.copingMechanisms}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, what are they?"
            />
            {errors.copingMechanisms && <p style={{ color: 'red' }}>{errors.copingMechanisms}</p>}
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>
    </div>
  );
}

export default UserMentalHealthHistory;
