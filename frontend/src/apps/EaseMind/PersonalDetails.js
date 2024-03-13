import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './EaseMind.css';
import { AuthTokenContext } from '../../App';

function PersonalDetails() {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    DOB: '',
    gender: '',
    houseNumber: '',
    streetName: '',
    postCode: '',
    city: '',
    country: '',
    highestEducation: '',
  });

  const [ageValidationMessage, setAgeValidationMessage] = useState('');
  const [formValidationMessage, setFormValidationMessage] = useState('');
  const [formSubmissionMessage, setFormSubmissionMessage] = useState('');
  const [fetchError, setFetchError] = useState(''); // State for fetch errors
  const { token } = useContext(AuthTokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const endpoint = 'http://127.0.0.1:5000/get_epersonal_details';
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        setFetchError('Error fetching user details. Please try again.'); // Update to display error to user
      }
    };

    fetchUserDetails();
  }, [token]);

  const isAgeAbove18 = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({ ...prevState, [name]: value }));
    setFormValidationMessage('');
    setAgeValidationMessage('');
  };

  const validateForm = () => {
    // Check if any field is empty
    const allFieldsFilled = Object.values(userDetails).every((value) => value.trim() !== '');
    if (!allFieldsFilled) {
      setFormValidationMessage('All fields are required.');
      return false;
    }

    // Check if age is above 18
    if (isAgeAbove18(userDetails.DOB) < 18) {
      setAgeValidationMessage('You must be older than 18 to use this service.');
      return false;
    }

    // Passes all validations
    return true;
  };

  const saveDetailsToDatabase = async () => {
    const endpoint = 'http://127.0.0.1:5000/submit_personal_details';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Directly use token here
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save details: ${errorData.error ? errorData.error : 'Unknown error'}`);
      } else {
        return 'Details saved successfully';
      }
    } catch (error) {
      throw new Error(`Error saving details: ${error.message}`);
    }
  };

  const saveDetails = async (e) => {
    e.preventDefault();
    setFormSubmissionMessage('');
    setFormValidationMessage('');
    setAgeValidationMessage('');

    if (validateForm()) {
      try {
        const message = await saveDetailsToDatabase();
        setFormSubmissionMessage(message);
      } catch (error) {
        setFormSubmissionMessage('Error saving details. Please try again.'); // More user-friendly error message
      }
    }
  };

  return (
    <div className="easeMindContainer">
      <button
        type="button"
        className="GoBackButton"
        onClick={() => navigate('/EaseMind')}
      >
        Go Back
      </button>
      <h2 className="easeMindTitle">Please fill in the details below:</h2>
      <form onSubmit={saveDetails}>
        <label>
          First Name:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Last Name:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* Date of Birth */}
        <label>
          Date of Birth:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="date"
            name="DOB"
            value={userDetails.DOB}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* Gender */}
        <label>
          Gender:
          {' '}
          <span className="compulsory-field">*</span>
          <select name="gender" value={userDetails.gender} onChange={handleUserDetailsChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </label>

        {/* Address inputs */}
        <label>
          House Number:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="houseNumber"
            value={userDetails.houseNumber}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Street Name:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="streetName"
            value={userDetails.streetName}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Post Code:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="postCode"
            value={userDetails.postCode}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          City:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="city"
            value={userDetails.city}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Country:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="country"
            value={userDetails.country}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* Highest Education Level */}
        <label>
          Highest Education Level:
          {' '}
          <span className="compulsory-field">*</span>
          <select name="highestEducation" value={userDetails.highestEducation} onChange={handleUserDetailsChange}>
            <option value="">Select Education Level</option>
            <option value="Early Years">Early Years</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Further Education">Further Education (FE)</option>
            <option value="Higher Education">Higher Education (HE)</option>
            <option value="Do Not Want To Disclose">Do Not Want To Disclose</option>
          </select>
        </label>

        {/* Submit button */}
        <div>
          <button type="submit" className="easeMindButton">Save Details</button>
        </div>
      </form>

      {/* Display validation and error messages */}
      {formValidationMessage && <p className="error">{formValidationMessage}</p>}
      {ageValidationMessage && <p className="error">{ageValidationMessage}</p>}
      {formSubmissionMessage && <p className="message">{formSubmissionMessage}</p>}
      {fetchError && <p className="error">{fetchError}</p>}
      {' '}
      {/* Display fetch error */}
    </div>
  );
}

export default PersonalDetails;
