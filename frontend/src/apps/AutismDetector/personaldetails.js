import React, { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

const Personaldetails = () => {
  // State for user details
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    // Add other user details fields as needed
  });
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
            name="dob"
            value={userDetails.dob}
            onChange={handleUserDetailsChange}
          />
        </label>

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
          <button onClick={saveDetails}>Save Details</button>
        </Link>
      </div>
    </div>
  );
};

export default Personaldetails;
