import React from 'react';
import { Link } from 'react-router-dom';
import autismHomeImage from '../../images/autism-home.png';
import greenImage from '../../images/green.png';
import greyImage from '../../images/grey.png';
import linesImage from '../../images/lines.png';

function AutismDetector() {
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  // Style objects
  const pageStyle = {
    fontFamily: 'Arial, sans-serif',
    color: '#000',
    textAlign: 'center',
    padding: '20px',
  };

  const autismHomeImageStyle = {
    width: '50%',
    height: '350%',
    marginTop: '150px', // Adjust the top margin to move the image downwards
  };

  const imageContainerStyle = {
    position: 'relative',
    float: 'right',
    width: '850px',
  };

  const greenImageStyle = {
    width: '100%',
    height: '100%',
  };

  const greyImageStyle = {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '82%',
    height: '60%',
    borderTop: '20px solid white',
    borderBottom: '20px solid white',
    borderLeft: '20px solid white',
    boxSizing: 'border-box',
  };

  const greyImageStyle2 = {
    position: 'absolute',
    top: '0%',
    left: '0%', // Align to the left edge of the container
    width: '82%',
    height: '100%',
    borderTop: '20px solid white',
    borderBottom: '20px solid white',
    borderLeft: '20px solid white',
    boxSizing: 'border-box',
  };

  const taskbarStyle = {
    display: 'flex',
    justifyContent: 'space-around', // This will space out the items evenly
    alignItems: 'center',
    backgroundColor: '#ccdcc1',
    borderRadius: '15px',
    border: 'solid white',
    padding: '10px 0',
  };

  const taskbarItemStyle = {
    margin: '0 10px',
    padding: '10px 15px',
    cursor: 'pointer',
    backgroundColor: '#e0e0e0', // Button background color
    borderRadius: '15px', // Rounded corners for buttons
    border: 'solid white',
    textDecoration: 'none', // Remove underline from links
    color: '#013220',
    fontWeight: 'bold',
  };

  const welcomeMessageStyle = {
    textAlign: 'center',
    marginRight: '20px', // Add some right margin
    color: '#013220',
  };

  const textOnImageStyle = {
    position: 'absolute',
    top: '50%',
    left: '63%',
    transform: 'translate(-50%, -50%)',
    color: '#013220',
    fontSize: '50px',
    fontWeight: 'bold',
  };

  const textOnImageStyle2 = {
    textAlign: 'left',
    position: 'absolute',
    top: '50%',
    left: '35%',
    transform: 'translate(-50%, -50%)',
    color: '#013220',
    fontSize: '30px',
    fontWeight: 'bold',
  };

  const secondImageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '600px',
    marginTop: '40px',
  };

  const buttonStyle = {
    backgroundColor: '#013220',
    color: 'white',
    padding: '10px 20px',
    margin: '20px 0',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '25px',
  };

  const helplineContainerStyle = {
    backgroundColor: '#013220',
    color: 'white',
    padding: '20px',
    borderRadius: '5px',
    position: 'absolute',
    right: '20px',
    top: '1110px',
    width: '500px',
    fontSize: '25px',
    boxSizing: 'border-box',
    textAlign: 'left',
  };

  return (
    <div style={pageStyle}>
      <div style={taskbarStyle}>
        <div>
          <Link to="/autism_instructions/personaldetails" style={taskbarItemStyle}>Personal Details</Link>
          <Link to="/autism_instructions/questionnaire" style={taskbarItemStyle}>Questionnaire</Link>
          <Link to="/autism_instructions/feedback" style={taskbarItemStyle}>Feedback</Link>
          <Link to="/autism_instructions/trackingandnotes" style={taskbarItemStyle}>Tracking & Notes</Link>
        </div>
        <div style={welcomeMessageStyle}>
          <b>
            <h1>
              Welcome
              !
              <br />
              {userEmail}
              !
            </h1>
          </b>
        </div>
      </div>
      <img src={autismHomeImage} alt="Autism Home" style={autismHomeImageStyle} />
      <div style={imageContainerStyle}>
        <img src={greenImage} alt="Decorative Green" style={greenImageStyle} />
        <img src={greyImage} alt="Decorative Grey" style={greyImageStyle} />
        <div style={textOnImageStyle}>
          <u>A</u>
          lways
          <br />
          <u>U</u>
          nique
          <br />
          <u>T</u>
          otally
          <br />
          <u>I</u>
          ntelligent
          <br />
          <u>S</u>
          ometimes
          <br />
          <u>M</u>
          ysterious
          <Link to="/autism_instructions/questionnaire" style={buttonStyle}>
            <u>Take a Questionnaire</u>
          </Link>
        </div>
      </div>
      <img src={linesImage} alt="Decorative Lines" style={{ maxWidth: '100%', height: 'auto' }} />
      <div style={secondImageContainerStyle}>
        <img src={greyImage} alt="Additional Decorative Grey" style={greyImageStyle2} />
        <div style={textOnImageStyle2}>
          <u>Advice:</u>
          <br />
          1. Understanding: Educate yourself about autism to better understand yourself.
          <br />
          2. Support: Seek support groups and communities for both individuals with autism and their families.
          <br />
          3. Routine: (As family) Maintain a consistent routine, as it can be comforting for individuals with autism.
          <br />
          4. Record and take notes: Maintain a diary or a note pad to mention small parts of your life to keep track.
          <br />
          5. Communication: (As family) Adapt communication methods and be patient in understanding the individuals way of communication.
          <br />
          6. Therapies: Explore therapies and interventions that can assist with managing symtoms and improving quality of life.
        </div>
      </div>
      <div style={helplineContainerStyle}>
        <strong><u>Helpline numbers in the UK</u></strong>
        <br />
        <br />
        1. National Autistic Society Helpline:
        <br />
        0808 800 4104
        <br />
        (Monday to Thursday: 10aam to 4pm, Friday: 9am to 3pm)
        <br />
        2. Autism Helpline by Ambitious about Autism:
        <br />
        0800 014 8087
        <br />
        (Monday to Thursday: 10am to 4pm, Friday: 9am to 3pm)
        <br />
        3. Autism Wessex:
        <br />
        1202 483360
        <br />
        (Monday to Friday: 9am to 5pm)
        <br />
        4. Autism Anglia:
        <br />
        01206 577678
        <br />
        (Monday to Friday: 9am to 5pm)
      </div>
    </div>
  );
}

export default AutismDetector;
