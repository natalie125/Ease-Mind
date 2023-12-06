import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PersonalDetails() {
  // State for user details
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    // Add other user details fields as needed
  });
  // TODO: Fix following lint errors
  // eslint-disable-next-line
  const [isDetailsSaved, setIsDetailsSaved] = useState(false);

  // Function to handle user details input changes
  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // Function to handle saving details and pass to Home component
  const saveDetails = () => {
    // Perform actions to save userDetails
    // Example: API call to save details
    setIsDetailsSaved(true);
  };

  return (
    <div className="Personaldetails">
      <h2>Please put in your personal details below:</h2>

      {/* User details input */}
      <div>
        {/* TODO: Fix following lint errors */}
        {/* eslint-disable-next-line */}
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* TODO: Fix following lint errors */}
        {/* eslint-disable-next-line */}
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* TODO: Fix following lint errors */}
        {/* eslint-disable-next-line */}
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={userDetails.dob}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* TODO: Fix following lint errors */}
        {/* eslint-disable-next-line */}
        <label>
          Gender:
          <select name="gender" value={userDetails.gender} onChange={handleUserDetailsChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* Add other options */}
          </select>
        </label>
      </div>

      {/* Button to save personal details */}
      <div>
        <Link to="/autismdetector/personaldetails/save">
          <button type="button" onClick={saveDetails}>Save Details</button>
        </Link>
      </div>
    </div>
  );
}

export default PersonalDetails;
