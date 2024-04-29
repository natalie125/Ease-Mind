// QuestionnaireForm.js
/*
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthTokenContext } from '../../../App';
import {
  containerStyle, wrapperStyle, buttonStyle, warningStyle, inputContainerStyle, inputStyle,
} from '../styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function QuestionnaireForm() {
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [responses, setResponses] = useState({
    recentExperiences: '',
    emotionalState: '',
    emotionalTriggers: '',
    copingMethods: '',
    safetyCheck: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    Object.entries(responses).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required.';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFeedbackMessage('Please correct the errors before submitting.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setFeedbackMessage('User ID is missing, cannot submit.');
      return;
    }

    const formData = {
      ...responses,
      user_id: userId,
    };

    try {
      const url = `${BASEURL}/api/depressiLess/QuestionnaireForm`;
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        navigate('/DepressiLess/DepressionScreeningForm', { state: { userId } });
        setFeedbackMessage('Information was successfully submitted.');
      } else {
        throw new Error('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFeedbackMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={warningStyle}>
          <h3 style={{ color: 'white' }}>
            {' '}
            Emotional Wellbeing Check-in
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="recentExperiences">Are there any worries or challenges that you have been facing lately?</label>
            <textarea
              id="recentExperiences"
              name="recentExperiences"
              value={responses.recentExperiences}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.recentExperiences && <p style={{ color: 'red' }}>{errors.recentExperiences}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="emotionalState">Have you noticed any changes in your feelings or behaviors that you would like to share?</label>
            <textarea
              id="emotionalState"
              name="emotionalState"
              value={responses.emotionalState}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.emotionalState && <p style={{ color: 'red' }}>{errors.emotionalState}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="emotionalTriggers">What activities or interactions have brought you comfort or distress?</label>
            <textarea
              id="emotionalTriggers"
              name="emotionalTriggers"
              value={responses.emotionalTriggers}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.emotionalTriggers && <p style={{ color: 'red' }}>{errors.emotionalTriggers}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="copingMethods">How have you been managing your emotions? What coping strategies have you tried?</label>
            <textarea
              id="copingMethods"
              name="copingMethods"
              value={responses.copingMethods}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.copingMethods && <p style={{ color: 'red' }}>{errors.copingMethods}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="safetyCheck">Lastly, it is important for us to know: have you had any thoughts of harming yourself or others?</label>
            <textarea
              id="safetyCheck"
              name="safetyCheck"
              value={responses.safetyCheck}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.safetyCheck && <p style={{ color: 'red' }}>{errors.safetyCheck}</p>}
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>
    </div>
  );
}

export default QuestionnaireForm;
*/
