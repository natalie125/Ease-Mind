import React from 'react';
import { Link } from 'react-router-dom';
import button1 from '../../images/personaldetails.png';
import button2 from '../../images/questionnaire.png';
import button3 from '../../images/feedback.png';
import button4 from '../../images/tracking&notes.png';

const buttonStyle = {
  width: '150px', // Adjust the width as needed
  height: '150px', // Adjust the height as needed
  border: '1px solid #ccc', // Add a border if needed
  borderRadius: '5px', // Add border radius to make it square
  margin: '5px', // Add margin between buttons
};

const containerStyle = {
  width: '45%',
  border: '2px solid palevioletred',
  backgroundColor: '#CC5555',
  padding: '10px',
  borderRadius: '5px',
  color: '#FFEEEE',
};

function AutismDetector() {
  const userEmail = sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1);

  // Define styles for the welcome message
  const welcomeStyles = {
    border: '2px solid palevioletred',
    backgroundColor: '#CC5555',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    color: '#FFEEEE',
  };

  return (
    <div className="AutismDetector">
      <div style={welcomeStyles}>
        <b>
          <h1>
            Welcome
            {userEmail}
            !
          </h1>
        </b>
      </div>
      <br />
      {/* Square logo buttons with images */}
      <div>
        <Link to="/autism_instructions/personaldetails">
          <img src={button1} alt="Personal Details" style={buttonStyle} />
        </Link>
        <Link to="/autism_instructions/questionnaire">
          <img src={button2} alt="Questionnaire" style={buttonStyle} />
        </Link>
      </div>
      <div>
        <Link to="/autism_instructions/feedback">
          <img src={button3} alt="Feedback" style={buttonStyle} />
        </Link>
        <Link to="/autism_instructions/tracking-notes">
          <img src={button4} alt="Tracking & Notes" style={buttonStyle} />
        </Link>
      </div>
      <br />
      {/* Container for Advice for Autism and Helpline Numbers in the UK */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ ...containerStyle, marginRight: '5%' }}>
          <strong>Advice for Autism:</strong>
          <p>
            1. Understanding: Educate yourself about autism to better understand the condition.
            <br />
            2. Support: Seek support groups and communities for both individuals with autism and their families.
            <br />
            3. Routine: Maintain a consistent routine, as it can be comforting for individuals with autism.
            <br />
            4. Communication: Adapt communication methods and be patient in understanding the individual&apos;s way of communication.
            <br />
            5. Therapies: Explore therapies and interventions that can assist with managing symptoms and improving quality of life.
          </p>
        </div>

        <div style={containerStyle}>
          <strong>Helpline Numbers in the UK:</strong>
          <p>
            1. National Autistic Society Helpline:
            {' '}
            <br />
            0808 800 4104 (Monday to Thursday: 10 am to 4 pm, Friday: 9 am to 3 pm)
            <br />
            2. Autism Helpline by Ambitious about Autism:
            {' '}
            <br />
            0800 014 8087 (Monday to Thursday: 10 am to 4 pm, Friday: 9 am to 3 pm)
            <br />
            3. Autism Wessex:
            {' '}
            <br />
            01202 483360 (Monday to Friday: 9 am to 5 pm)
            <br />
            4. Autism Anglia:
            {' '}
            <br />
            01206 577678 (Monday to Friday: 9 am to 5 pm)
          </p>
        </div>
      </div>
    </div>
  );
}

export default AutismDetector;
