import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthTokenContext } from '../../App';
import autismHomeVideo from '../../images/autism-personaldetails.gif';
// https://giphy.com/gifs/love-ai-aisforai-H5W5Aq4h17GZ042UGN
import './personaldetails.css';

function PersonalDetails() {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    DOB: '',
    gender: '',
    postCode: '',
    city: '',
    countryOfResidence: '',
    highestEducation: '',
    ethnicity: '',
    nationality: '',
    sexuality: '',
    additionalConditions: [],
    sensorySensitivity: [],
  });

  const handleConditionChange = (condition) => {
    // eslint-disable-next-line no-restricted-globals
    const selectedOptions = Array.from(event.target.selectedOptions).map((option) => option.value);
    setUserDetails((prevState) => {
      const isConditionSelected = prevState.additionalConditions.includes(condition);
      if (isConditionSelected) {
        return {
          ...prevState,
          additionalConditions: prevState.additionalConditions.filter((cond) => cond !== condition),
        };
      }
      // This part is executed only if the condition is not selected, removing the need for an else statement
      return {
        ...prevState,
        additionalConditions: selectedOptions,
      };
    });
  };

  const goBackButtonStyle = {
    backgroundColor: '#f0f0f0',
    color: '#C68B77',
    padding: '10px 15px',
    marginTop: '20px',
    marginLeft: '-90%',
    borderRadius: '5px',
    border: '2px solid #C68B77',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const autismHomeVideoStyle = {
    width: '15%', // Adjust the width as needed, e.g., to 50% of its container
    height: '300px', // Keeps the aspect ratio of the image
    float: 'left',
    marginTop: '-18vh',
    marginLeft: '-0%',
    position: 'relative',
    display: 'block', // This ensures the video is displayed as a block element, removing any unwanted space around it
    objectFit: 'cover', // This will cover the area of the container without stretching the video
    marginBottom: '38px', // Adjust if necessary to remove any remaining space
  };

  // React Router v6 uses useNavigate hook
  const navigate = useNavigate();

  // Define handleGoBack to navigate back
  const handleGoBack = () => navigate(-1);

  const [ageValidationMessage, setAgeValidationMessage] = useState('');
  const [formValidationMessage, setFormValidationMessage] = useState('');
  const [formSubmissionMessage, setFormSubmissionMessage] = useState('');
  const [fetchError, setFetchError] = useState(''); // State for fetch errors
  const { token } = useContext(AuthTokenContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const endpoint = 'http://127.0.0.1:5000/get_personal_details';
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        let data = await response.json();

        // Ensure that `sensorySensitivity` and `additionalConditions` are arrays
        // This is necessary to prevent runtime errors when their values are `undefined`
        if (!Array.isArray(data.sensorySensitivity)) {
          data = { ...data, sensorySensitivity: [] }; // Initialize as empty array if undefined
        }
        if (!Array.isArray(data.additionalConditions)) {
          data = { ...data, additionalConditions: [] }; // Initialize as empty array if undefined
        }

        setUserDetails(data);
      } catch (error) {
        setFetchError('Error fetching user details. Please try again.'); // Update to display error to user
      }
    };

    fetchUserDetails();
  }, [token]); // Depend on `token` to refetch when it changes

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
    const {
      name, value, type, checked,
    } = e.target;

    if (type === 'checkbox') {
      let newSensorySensitivity = [...userDetails.sensorySensitivity];

      if (value === 'None') {
        // Toggle 'None' exclusively
        if (checked) {
          newSensorySensitivity = ['None']; // Only 'None' should be selected
        } else {
          newSensorySensitivity = []; // All checkboxes including 'None' are unchecked
        }
      }
      if (checked) {
        // Remove 'None' if other checkboxes are selected
        newSensorySensitivity = newSensorySensitivity.filter((item) => item !== 'None');
        if (!newSensorySensitivity.includes(value)) {
          newSensorySensitivity.push(value);
        }
      } else {
        // Remove the value if unchecked
        newSensorySensitivity = newSensorySensitivity.filter((item) => item !== value);
      }

      setUserDetails((prevState) => ({
        ...prevState,
        sensorySensitivity: newSensorySensitivity,
      }));
    } else {
      setUserDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    // Check if any field except sensorySensitivity is empty
    const allFieldsFilled = Object.entries(userDetails).every(([key, value]) => {
      // Check if the value is an array and if the field is not sensorySensitivity
      if (Array.isArray(value)) {
        return key !== 'sensorySensitivity' ? value.length > 0 : true;
      }
      // If it's not an array, check it's not an empty string after trimming
      return value.trim() !== '';
    });

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
    <div className="AutismDetectorContainer">
      <button type="button" style={goBackButtonStyle} onClick={handleGoBack}>&larr; Go Back</button>
      <div className="detailsTitleContainer">
        <h2>Please fill in the details below:</h2>
      </div>
      <form onSubmit={saveDetails} className="detailsFormContainer">
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
          Country of Residence:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="countryOfResidence"
            value={userDetails.countryOfResidence}
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

        <label>
          Ethnicity:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="ethnicity"
            value={userDetails.ethnicity}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Nationality:
          {' '}
          <span className="compulsory-field">*</span>
          <input
            type="text"
            name="nationality"
            value={userDetails.nationality}
            onChange={handleUserDetailsChange}
          />
        </label>

        <label>
          Sexuality:
          {' '}
          <span className="compulsory-field">*</span>
          <select name="sexuality" value={userDetails.sexuality} onChange={handleUserDetailsChange}>
            <option value="">Select Sexuality</option>
            <option value="Straight">Straight</option>
            <option value="Gay">Gay</option>
            <option value="Lesbian">Lesbian</option>
            <option value="Bisexual">Bisexual</option>
            <option value="Asexual">Asexual</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <div className="conditionsContainer">
          <label htmlFor="handleConditionChange">Additional Conditions:</label>
          <select
            id="handleConditionChange"
            name="handleConditionChange"
            value={userDetails.additionalConditions}
            onChange={handleConditionChange}
            multiple // Allow multiple selections
          >
            <option value="Asperger Syndrome">Asperger Syndrome</option>
            <option value="ADHD">ADHD</option>
            <option value="Anxiety">Anxiety</option>
            <option value="Depression">Depression</option>
            <option value="Learning Disabilities">Learning Disabilities</option>
            <option value="Bipolar Disorder">Bipolar Disorder</option>
            <option value="OCD">OCD</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <fieldset>
          <legend style={{ fontSize: '16px', fontWeight: 'bold' }}>Sensory Sensitivities</legend>

          <h4><u>Sight</u></h4>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Sight Under-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Sight Under-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Sight Under-Sensitive (e.g., objects appear dark, poor depth perception)
          </label>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Sight Over-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Sight Over-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Sight Over-Sensitive (e.g., distorted vision, difficulty with bright lights)
          </label>

          <h4><u>Sound</u></h4>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Sound Under-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Sound Under-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Sound Under-Sensitive (e.g., partial hearing, enjoys noisy places)
          </label>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Sound Over-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Sound Over-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Sound Over-Sensitive (e.g., noise magnified, difficulty concentrating)
          </label>

          <h4><u>Smell</u></h4>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Smell Under-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Smell Under-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Smell Under-Sensitive (e.g., fails to notice extreme odours, may lick things)
          </label>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Smell Over-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Smell Over-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Smell Over-Sensitive (e.g., smells can be intense and overpowering)
          </label>

          <h4><u>Taste</u></h4>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Taste Under-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Taste Under-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Taste Under-Sensitive (e.g., likes very spicy foods, may eat non-edible items)
          </label>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Taste Over-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Taste Over-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Taste Over-Sensitive (e.g., finds some flavours too strong, restricted diet)
          </label>

          <h4><u>Touch</u></h4>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Touch Under-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Touch Under-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Touch Under-Sensitive (e.g., high pain threshold, enjoys heavy objects)
          </label>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Touch Over-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Touch Over-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Touch Over-Sensitive (e.g., touch can be painful, dislikes certain clothing textures)
          </label>

          <h4><u>Balance (Vestibular)</u></h4>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Balance Under-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Balance Under-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Balance Under-Sensitive (e.g., needs to rock, swing, or spin)
          </label>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Balance Over-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Balance Over-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Balance Over-Sensitive (e.g., difficulties with sport, car sickness)
          </label>

          <h4><u>Body Awareness (Proprioception)</u></h4>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Body Awareness Under-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Body Awareness Under-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Body Awareness Under-Sensitive (e.g., stands too close, may bump into people)
          </label>
          <label className="sensory-label">
            <input
              type="checkbox"
              name="sensorySensitivity"
              value="Body Awareness Over-Sensitive"
              checked={userDetails.sensorySensitivity.includes('Body Awareness Over-Sensitive')}
              onChange={handleUserDetailsChange}
            />
            Body Awareness Over-Sensitive (e.g., difficulties with fine motor skills)
          </label>
        </fieldset>
        {/* https://www.autism.org.uk/advice-and-guidance/topics/sensory-differences/sensory-differences/all-audiences */}

        {/* Submit button */}
        <div>
          <button type="submit" className="AutismDetectorButton">Save Details</button>
        </div>
      </form>

      {/* Display validation and error messages */}
      {formValidationMessage && <p className="error">{formValidationMessage}</p>}
      {ageValidationMessage && <p className="error">{ageValidationMessage}</p>}
      {formSubmissionMessage && <p className="message">{formSubmissionMessage}</p>}
      {fetchError && <p className="error">{fetchError}</p>}
      {' '}
      {/* Display fetch error */}
      <div style={autismHomeVideoStyle} className="video-container">
        <img src={autismHomeVideo} alt="Autism Home" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default PersonalDetails;
