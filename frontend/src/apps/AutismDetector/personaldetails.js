import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './personaldetails.css';

function PersonalDetailsForm() {
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    gender: '',
    occupation: '',
    education: '',
    interests: '',
    nationality: '',
    ethnicity: '',
  });
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleGoBack = () => {
    navigate('/autism_instructions'); // Redirect to '/autism_instructions'
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <button2 type="button2" className="go-back-button" onClick={handleGoBack}>&larr;</button2>
        <div className="form-row">
          <label htmlFor="firstName" className="label-box">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={details.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="lastName" className="label-box">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={details.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="dateOfBirth" className="label-box">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={details.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email" className="label-box">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={details.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="gender" className="label-box">Gender:</label>
          <select id="gender" name="gender" value={details.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="occupation" className="label-box">Occupation:</label>
          <select id="occupation" name="occupation" value={details.occupation} onChange={handleChange}>
            <option value="">Select Occupation</option>
            <option value="">Arts and Entertainment</option>
            <option value="">Business and Finance</option>
            <option value="">Education and Training</option>
            <option value="">Engineering and Technology</option>
            <option value="">Healthcare and Medical Services</option>
            <option value="">Information Technology (IT) and Software</option>
            <option value="">Legal and Law Enforcement</option>
            <option value="">Manufacturing and Construction</option>
            <option value="">Marketing, Advertising, and Public Relations</option>
            <option value="">Natural Sciences and Environmental</option>
            <option value="">Non-profit and Community Services</option>
            <option value="">Retail and Customer Service</option>
            <option value="">Sales and Business Development</option>
            <option value="">Transportation and Logistics</option>
            <option value="">Hospitality and Tourism</option>
            <option value="">Human Resources</option>
            <option value="">Agriculture and Forestry</option>
            <option value="">Real Estate</option>
            <option value="">Sports and Recreation</option>
            <option value="">Student (if currently studying)</option>
            <option value="">Unemployed</option>
            <option value="">Retired</option>
            <option value="">Other</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="education" className="label-box">Education Level:</label>
          <select id="education" name="education" value={details.education} onChange={handleChange}>
            <option value="">Select Education Level</option>
            <option value="male">No Formal Education</option>
            <option value="male">Primary Education</option>
            <option value="male">Secondary Education / High School</option>
            <option value="male">Vocational Training</option>
            <option value="male">Associate&apos;s Degree</option>
            <option value="male">Bachelor&apos;s Degree</option>
            <option value="male">Master&apos;s Degree</option>
            <option value="male">Doctorate (PhD)</option>
            <option value="male">Professional Degree (e.g., MD, JD)</option>
            <option value="male">Post-Doctoral Training</option>
            <option value="male">Currently Studying</option>
            <option value="male">Other</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="interests" className="label-box">Interests and Hobbies:</label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={details.interests}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="nationality" className="label-box">
            Nationality:
          </label>
          <select
            id="nationality"
            name="nationality"
            value={details.nationality}
            onChange={handleChange}
          >
            <option value="">Select Nationality</option>
            <option value="Indian/Pakistani-asian">Indian/Pakistani-asian</option>
            <option value="East-Asian">East-Asian</option>
            <option value="Asian">Asian</option>
            <option value="Asian">Middle East</option>
            <option value="African">African</option>
            <option value="European">European</option>
            <option value="North American">North American</option>
            <option value="South American">South American</option>
            <option value="South American">Australian</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="ethinicity" className="label-box">
            Ethnicity:
          </label>
          <select
            id="ethinicity"
            name="ethinicity"
            value={details.nationality}
            onChange={handleChange}
          >
            <option value="">Select Ethinicity</option>
            <option value="Indian/Pakistani-asian">Indian/Pakistani-asian</option>
            <option value="East-Asian">East-Asian</option>
            <option value="Asian">Asian</option>
            <option value="Asian">Middle East</option>
            <option value="African">African</option>
            <option value="European">European</option>
            <option value="North American">North American</option>
            <option value="South American">South American</option>
            <option value="South American">Australian</option>
          </select>
        </div>
        <button2 type="submit">Submit</button2>
      </form>
    </div>
  );
}

export default PersonalDetailsForm;
