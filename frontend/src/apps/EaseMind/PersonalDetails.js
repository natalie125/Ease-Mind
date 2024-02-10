import React, { useState, useContext } from 'react';
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
  const [formSubmissionMessage, setFormSubmissionMessage] = useState(''); // State to store form submission status message
  const { token } = useContext(AuthTokenContext);

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({ ...prevState, [name]: value }));
  };

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
    setAgeValidationMessage('');

    if (isAgeAbove18(userDetails.DOB) < 18) {
      setAgeValidationMessage('You must be older than 18 to use this service.');
    } else {
      try {
        // Now using `token` directly without calling useContext here
        const message = await saveDetailsToDatabase(); // Adjusted to not pass token as it's directly accessible
        setFormSubmissionMessage(message);
      } catch (error) {
        setFormSubmissionMessage(error.message);
      }
    }
  };

  return (
    <div className="easeMindContainer">
      <h2 className="easeMindTitle">Please fill in the details below:</h2>
      <form onSubmit={saveDetails}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Last Name:
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
          <input
            type="text"
            name="houseNumber"
            value={userDetails.houseNumber}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Street Name:
          <input
            type="text"
            name="streetName"
            value={userDetails.streetName}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Post Code:
          <input
            type="text"
            name="postCode"
            value={userDetails.postCode}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          City:
          <input
            type="text"
            name="city"
            value={userDetails.city}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Country:
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

      {/* Display age validation message if present */}
      {ageValidationMessage && <p className="error">{ageValidationMessage}</p>}

      {/* Display form submission message if present */}
      {formSubmissionMessage && <p className="message">{formSubmissionMessage}</p>}
    </div>
  );
}

export default PersonalDetails;
