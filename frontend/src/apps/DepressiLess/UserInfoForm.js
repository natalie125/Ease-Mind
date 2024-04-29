import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthTokenContext } from '../../App';
import StepIndicator from './StepIndicator';
import {
  containerWithStepsStyle, formContainerStyle,
  buttonStyle, inputContainerStyle,
  modalBackdropStyle, modalStyle, modalHeaderStyle,
  modalContentStyle, modalFooterStyle,
  proceedButtonStyle, cancelButtonStyle,
} from './styles/Styles';

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
  const [showModal, setShowModal] = useState(true);
  const [userInformation, setUserInfo] = useState({
    name: '',
    genderIdentity: '',
    sexAssignedAtBirth: '',
    age: '',
    nationality: '',
    sexualOrientation: '',
  });
  const [fetchError, setFetchError] = useState('');
  const { token } = useContext(AuthTokenContext);
  const navigate = useNavigate(); // Use useNavigate to get navigation function

  useEffect(() => {
    const fetchUserInformation = async () => {
      const endpoint = 'http://127.0.0.1:5000/get_user_info';
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        setFetchError('Error fetching user info. Please try again.');
      }
    };

    fetchUserInformation();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const allFieldsFilled = Object.values(userInformation).every((value) => value.trim() !== '');
    if (!allFieldsFilled) {
      return false;
    }
    return true;
  };

  const saveUserInfoToDatabase = async () => {
    const endpoint = 'http://127.0.0.1:5000/submit_user_info';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userInformation),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save user info: ${errorData.error ? errorData.error : 'Unknown error'}`);
      } else {
        return 'Details saved successfully';
      }
    } catch (error) {
      throw new Error(`Error saving details: ${error.message}`);
    }
  };

  const saveUserInfo = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await saveUserInfoToDatabase();
        navigate('/DepressiLess/UserMentalHealthHistory'); // Navigate on successful save
      } catch (error) {
        console.error(error);
      }
    }
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
        <h3>Personal Information:</h3>
        <form onSubmit={saveUserInfo} style={inputContainerStyle}>
          {/* Name input */}
          <label>
            Name:
            {' '}
            <span className="compulsory-field">*</span>
            <input
              type="text"
              name="name"
              value={userInformation.name}
              onChange={handleChange}
              className="userInfoInput"
            />
          </label>

          {/* Gender Identity input */}
          <label>
            Gender Identity:
            {' '}
            <span className="compulsory-field">*</span>
            <input
              type="text"
              name="genderIdentity"
              value={userInformation.genderIdentity}
              onChange={handleChange}
              className="userInfoInput"
            />
          </label>

          {/* Sex Assigned at Birth input */}
          <label>
            Sex at Birth:
            {' '}
            <span className="compulsory-field">*</span>
            <input
              type="text"
              name="sexAssignedAtBirth"
              value={userInformation.sexAssignedAtBirth}
              onChange={handleChange}
              className="userInfoInput"
            />
          </label>

          {/* Age input */}
          <label>
            Age:
            {' '}
            <span className="compulsory-field">*</span>
            <input
              type="number"
              name="age"
              value={userInformation.age}
              onChange={handleChange}
              className="userInfoInput"
            />
          </label>

          {/* Nationality input */}
          <label>
            Nationality:
            {' '}
            <span className="compulsory-field">*</span>
            <input
              type="text"
              name="nationality"
              value={userInformation.nationality}
              onChange={handleChange}
              className="userInfoInput"
            />
          </label>

          {/* Sexual Orientation input */}
          <label>
            Sexual Orientation:
            {' '}
            <span className="compulsory-field">*</span>
            <input
              type="text"
              name="sexualOrientation"
              value={userInformation.sexualOrientation}
              onChange={handleChange}
              className="userInfoInput"
            />
          </label>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="userInfoSubmitButton"
              style={{
                ...buttonStyle,
              }}
            >
              Submit
            </button>
          </div>
        </form>
        {fetchError && <div className="error">{fetchError}</div>}
      </div>
    </div>
  );
}

export default UserInfoForm;
