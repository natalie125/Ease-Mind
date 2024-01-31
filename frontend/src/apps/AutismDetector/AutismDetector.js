import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import { Link } from 'react-router-dom';
import Chatbot from './Chatbot'; // Import the Chatbot component
import autismHomeImage from '../../images/autism-home.png';
import greenImage from '../../images/green.png';
import greyImage from '../../images/grey.png';

function AutismDetector() {
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the window matches the mobile resolution
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    // Listen for changes in the media query
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);

    // Cleanup the listener when the component unmounts
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  // Updated Responsive Style Objects
  const pageStyle = {
    fontFamily: 'Arial, sans-serif',
    color: '#000',
    textAlign: 'center',
    padding: isMobile ? '2%' : '2vw', // Adjust padding for mobile
  };

  const autismHomeImageStyle = {
    width: '60%',
    height: 'auto',
    float: 'left',
    marginTop: '2vh',
    position: 'relative',
    zIndex: 3, // Highest z-index
  };

  const imageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };

  const greenImageStyle = {
    position: 'relative',
    right: '20%',
    width: '143%', // Adjust the width to make it smaller
    height: isMobile ? '400px' : '580px', // Adjust the height for mobile and non-mobile
    marginTop: '3vh',
    zIndex: 2, // Increase the z-index to bring it behind the content
  };

  const greyImageStyle = {
    position: 'absolute',
    top: '31%',
    right: '0%', // Move to the right
    width: '40%',
    height: `${autismHomeImageStyle.height}`, // Set the height to match autismHomeImage height
    borderTop: '10px solid white',
    borderBottom: '10px solid white',
    borderLeft: '15px solid white',
    borderRight: '10px solid white',
    boxSizing: 'border-box',
    zIndex: 2, // Higher z-index to bring it to front
  };

  const textContainerStyle = {
    position: 'absolute',
    top: '35%', // Adjust the top position as needed
    left: '40%', // Adjust the left position as needed
    width: '80%', // Adjust the width as needed
    color: '#013220',
    fontSize: '3vw',
    fontWeight: 'bold',
    zIndex: 3, // Higher z-index to bring it to front
    textAlign: 'center',
  };

  const taskbarStyle = {
    display: 'flex',
    flexWrap: 'wrap', // Allow items to wrap as needed
    justifyContent: 'center', // Center items horizontally
    alignItems: 'center', // Align items vertically
    backgroundColor: '#ccdcc1',
    borderRadius: '15px',
    border: 'solid white',
    padding: '1vw',
  };

  const taskbarItemStyle = {
    margin: '0 1vw',
    padding: '1vw 1.5vw',
    cursor: 'pointer',
    backgroundColor: '#e0e0e0',
    borderRadius: '15px',
    border: 'solid white',
    textDecoration: 'none',
    color: '#013220',
    fontWeight: 'bold',
  };

  const welcomeMessageStyle = {
    textAlign: 'center',
    marginRight: '2vw',
    color: '#013220',
  };

  const buttonStyle = {
    backgroundColor: '#013220',
    color: 'white',
    padding: '1vw 2vw',
    margin: '2vh 0',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '2vw',
  };

  const helplineContainerStyle = {
    position: 'absolute',
    backgroundColor: '#013220',
    color: 'white',
    padding: '2vh',
    borderRadius: '5px',
    left: '5%', // Adjust the right position to align with the grey.png
    width: '90%', // Full width on mobile
    fontSize: '2vw',
    boxSizing: 'border-box',
    textAlign: 'center', // Center-align the content
    zIndex: 2, // Higher z-index to bring it to the front
  };

  const adviceContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    position: 'absolute', // Make it positioned absolutely
    top: isMobile ? 'calc(80% + 20px)' : '125%', // Adjust the top position based on resolution
    left: '50%',
    width: '90%',
    height: '40%',
    transform: 'translate(-50%, -50%)', // Center it horizontally and vertically
    zIndex: 4,
    color: '#013220',
    fontSize: isMobile ? 'calc(40% + 10px)' : '1.5vw',
  };

  const chatbotIconStyle = {
    position: 'fixed',
    bottom: isMobile ? '10px' : '20px', // Adjust the bottom position for mobile
    right: isMobile ? '145px' : '20px', // Adjust the right position for mobile
    backgroundColor: '#013220', // Example background color
    color: 'white', // Text color
    padding: '15px', // Padding around the button
    borderRadius: '50%', // Circular button
    cursor: 'pointer', // Cursor changes to pointer on hover
    fontSize: isMobile ? '15px' : '20px', // Adjust font size for mobile
    zIndex: 4,
    border: 'solid white',
  };

  const mediaQueries = `
    @media (max-width: 768px) {
      .imageContainerStyle {
        flexDirection: 'column';
      }
      .greyImageStyle, .greyImageStyle2 {
        width: 80%; // Adjust the width for smaller screens
        height: auto; // Maintain aspect ratio
        top: 0; // Adjust top position if needed
        right: 0; // Adjust right position if needed
        left: 10%; // Adjust left position if needed
        border: none; // Remove the borders if desired
      }
      .taskbarStyle {
        flexDirection: 'column'; /* Stack items vertically on small screens */
        alignItems: 'center'; /* Center-align items */
      }
      .taskbar-link {
        flex: 0 0 50%; /* Make each item take 50% of the available width */
        margin: '5px'; /* Adjust margin for smaller screens */
        font-size: '4vw'; /* Responsive font size */
      }
      .helplineContainerStyle {
        position: absolute;
        backgroundColor: '#013220';
        color: 'white';
        padding: 2vh;
        borderRadius: 5px;
        right: 0%;
        width: 100%; // Full width on mobile
        fontSize: 2vw;
        boxSizing: border-box;
        textAlign: center;
        zIndex: 2;
      }
      .adviceContainerStyle {
        top: 20%;
        position: absolute;
        backgroundColor: '#013220';
        color: 'white';
        padding: 2vh;
        borderRadius: 5px;
        right: 0%;
        width: 100%; // Full width on mobile
        fontSize: 2vw;
        boxSizing: border-box;
        textAlign: center;
        zIndex: 2;
      }
    }
  `;

  return (
    <div style={pageStyle}>
      <style>{mediaQueries}</style>
      <div style={taskbarStyle}>
        <div>
          <Link to="/autism_instructions/personaldetails" style={taskbarItemStyle} className="taskbar-link">Personal Details</Link>
          <Link to="/autism_instructions/questionnaire" style={taskbarItemStyle} className="taskbar-link">Questionnaire</Link>
          <Link to="/autism_instructions/feedback" style={taskbarItemStyle} className="taskbar-link">Feedback</Link>
          <Link to="/autism_instructions/trackingandnotes" style={taskbarItemStyle} className="taskbar-link">Tracking & Notes</Link>
        </div>
        <div style={welcomeMessageStyle}>
          <br />
          <h1>
            Welcome
            <br />
            {userEmail}
            !
          </h1>
        </div>
      </div>
      <img src={autismHomeImage} alt="Autism Home" style={autismHomeImageStyle} />
      <div style={imageContainerStyle}>
        <div style={adviceContainerStyle}>
          <strong><u>Advice:</u></strong>
          <br />
          1. Understanding: Educate yourself about autism to better understand yourself.
          <br />
          2. Support: Seek support groups and communities for both individuals with autism and their families.
          <br />
          3. Routine: (As a family) Maintain a consistent routine, as it can be comforting for individuals with autism.
          <br />
          4. Record and take notes: Maintain a diary or a note pad to mention small parts of your life to keep track.
          <br />
          5. Communication: (As a family) Adapt communication methods and be patient in understanding the individuals way of communication.
          <br />
          6. Therapies: Explore therapies and interventions that can assist with managing symptoms and improving quality of life.
          <br />
          <Link to="/autism_instructions/trackingandnotes" style={buttonStyle}>
            <u>Tracking Notes</u>
          </Link>
        </div>
        <img src={greenImage} alt="Decorative Green" style={greenImageStyle} />
        <img src={greyImage} alt="Decorative Grey" style={greyImageStyle} />
        <div style={textContainerStyle}>
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
          <br />
          <Link to="/autism_instructions/questionnaire" style={buttonStyle}>
            <u>Take a Questionnaire</u>
          </Link>
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
        (Monday to Thursday: 10am to 4pm, Friday: 9am to 3pm)
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
      <button type="button" style={chatbotIconStyle} onClick={toggleChatbot}>
        Click to Chat
      </button>
      {showChatbot && <Chatbot />}
    </div>
  );
}

export default AutismDetector;
