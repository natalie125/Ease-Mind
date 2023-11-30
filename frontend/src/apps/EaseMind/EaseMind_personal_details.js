import React, { useState } from 'react';
import { Link, useHistory, useNavigate } from 'react-router-dom'; // Import useHistory
import './EaseMind.css';

const EaseMindPersonaldetails = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    gender: "",
    address: "",
  });
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
      <h2 className='easeMindTitle'>Please fill in the details below:</h2>

      {/* User details input fields */}
      <div>
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

        <label>
          Date of Birth:
          <input
            type="date"
            name="DOB"
            value={userDetails.DOB}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Gender:
          <select name="gender" value={userDetails.gender} onChange={handleUserDetailsChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* Add other gender options if needed */}
          </select>
        </label>

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
          <button className='easeMindButton' onClick={saveDetails}>Save Details</button>
        </Link>
      </div>
    </div>
  );
};

export default EaseMindPersonaldetails;
