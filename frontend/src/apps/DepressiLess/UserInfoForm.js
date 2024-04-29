//UserInfoForm.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AuthTokenContext } from '../../../App';
import StepIndicator from '../common_components/StepIndicator';
import {
  containerWithStepsStyle, formContainerStyle,
  buttonStyle, inputContainerStyle, inputStyle,
  modalBackdropStyle, modalStyle, modalHeaderStyle,
  modalContentStyle, modalFooterStyle,
  proceedButtonStyle, cancelButtonStyle,
} from '../styles/Styles';

function PrivacyModal({ onProceed, onCancel }) {
  return (
    <div style={modalBackdropStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2>Privacy Notice and Data Usage Acknowledgement</h2>
        </div>
        <div style={modalContentStyle}>
          <p>Your privacy matters to us.</p>
          <p>
            The information you provide on this page is solely collected for the purpose of diagnosing
            the user within this application. Please rest assured that your data will not be used for any
            other purposes.
          </p>
          <p>
            We are committed to protecting your privacy and ensuring the confidentiality of your
            information. If you have any concerns or questions regarding your privacy or data usage,
            please do not hesitate to contact us.
          </p>
          <p>
            By proceeding, you acknowledge and consent to the collection and use of your information
            as described above.
          </p>
        </div>
        <div style={modalFooterStyle}>
          <button type="button" onClick={onProceed} style={proceedButtonStyle}>Proceed</button>
          <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

PrivacyModal.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

function UserInfoForm() {
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);
  const [showModal, setShowModal] = useState(true);
  const [userInformation, setUserInfo] = useState({
    name: '',
    genderIdentity: '',
    sexAssignedAtBirth: '',
    age: '',
    nationality: '',
    sexualOrientation: '',
  });
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const endpoint = 'http://127.0.0.1:5000/get_user_info';
    console.log(`Bearer token: ${token}`); // Debug token output
    axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setUserInfo(response.data);
    }).catch((error) => {
      const message = error.response ? error.response.data.error : 'Error fetching user details.';
      setFetchError(message);
    });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const formIsValid = true;
    const newErrors = {};
    if (!userInformation.name.trim()) newErrors.name = 'Name is required';
    if (!userInformation.genderIdentity.trim()) newErrors.gender_identity = 'Gender Identity is required';
    if (!userInformation.sexAssignedAtBirth.trim()) newErrors.sex_assigned_at_birth = 'Sex assigned at birth is required';
    if (!userInformation.age.trim() || Number.isNaN(Number(userInformation.age)) || Number(userInformation.age) <= 0) newErrors.age = 'Valid age is required';
    if (!userInformation.nationality.trim()) newErrors.nationality = 'Nationality is required';
    setErrors(newErrors);
    return formIsValid && Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFeedbackMessage('Please correct the errors before submitting.');
      return;
    }

    const endpoint = 'http://127.0.0.1:5000/submit_user_info';
    axios.post(endpoint, userInformation, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      navigate('/DepressiLess/UserMentalHealthHistory', { state: { userId: response.data.id } });
      setFeedbackMessage('Information submitted successfully!');
    }).catch((error) => {
      const message = error.response ? error.response.data.error : 'Failed to submit information.';
      setFeedbackMessage(message);
    });
  };

  const handleModalProceed = () => {
    setShowModal(false);
  };

  const handleModalCancel = () => {
    navigate('/DepressiLess');
  };

  return (
    <div style={containerWithStepsStyle}>
      <StepIndicator currentStep={0} />
      {showModal && <PrivacyModal onProceed={handleModalProceed} onCancel={handleModalCancel} />}
      <div style={formContainerStyle}>
        {feedbackMessage && (
          <div style={{
            padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '4px',
          }}
          >
            {feedbackMessage}
          </div>
        )}
        {fetchError && (
          <div style={{
            padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '4px',
          }}
          >
            {fetchError}
          </div>
        )}
        <h3>Personal Information:</h3>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInformation.name}
              onChange={handleChange}
              autoComplete="off"
              style={inputStyle}
            />
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="genderIdentity">Gender:</label>
            <input
              type="text"
              id="genderIdentity"
              name="genderIdentity"
              value={userInformation.genderIdentity}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.genderIdentity && <div style={{ color: 'red' }}>{errors.genderIdentity}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="sexAssignedAtBirth">Sex at Birth:</label>
            <input
              type="text"
              id="sexAssignedAtBirth"
              name="sexAssignedAtBirth"
              value={userInformation.sexAssignedAtBirth}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.sexAssignedAtBirth && <div style={{ color: 'red' }}>{errors.sexAssignedAtBirth}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="age">Age:</label>
            <input
              type="number" // Change 'integer' to 'number' to be correct HTML
              id="age"
              name="age"
              value={userInformation.age}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.age && <div style={{ color: 'red' }}>{errors.age}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="nationality">Nationality:</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={userInformation.nationality}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.nationality && <div style={{ color: 'red' }}>{errors.nationality}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="sexualOrientation">Sexual Orientation:</label>
            <input
              type="text"
              id="sexualOrientation"
              name="sexualOrientation"
              value={userInformation.sexualOrientation}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
      </div>
    </div>
  );
}
export default UserInfoForm;
