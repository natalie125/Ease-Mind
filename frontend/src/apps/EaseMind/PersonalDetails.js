import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EaseMind.css';

function PersonalDetails() {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    DOB: '',
    gender: '',
    address: '',
  });
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDetailsSaved, setIsDetailsSaved] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const saveDetails = () => {
    setIsDetailsSaved(true);
    navigate('/EaseMind');
  };

  return (
    <div className="easeMindContainer">
      <h2 className="easeMindTitle">Please fill in the details below:</h2>

      {/* User details input fields */}
      <div>
        {/* FIXME */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* FIXME */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* FIXME */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          Date of Birth:
          <input
            type="date"
            name="DOB"
            value={userDetails.DOB}
            onChange={handleUserDetailsChange}
          />
        </label>

        {/* FIXME */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          Gender:
          <select name="gender" value={userDetails.gender} onChange={handleUserDetailsChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* Add other gender options if needed */}
          </select>
        </label>

        {/* FIXME */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={userDetails.address}
            onChange={handleUserDetailsChange}
          />
        </label>
      </div>

      {/* Button to save personal details */}
      <div>
        <Link to="/EaseMind/EaseMind_personal_details/save">
          <button type="button" className="easeMindButton" onClick={saveDetails}>Save Details</button>
        </Link>
      </div>
    </div>
  );
}

export default PersonalDetails;
