import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Chatbot from './Chatbot'; // Import the Chatbot component
import autismHomeVideo from '../../images/autism-home.mov';
// https://giphy.com
import greenImage from '../../images/green.png';
import greyImage from '../../images/grey.png';

// Pop up
function PopUp({ show, onClose }) {
  if (!show) {
    return null;
  }

  const popupStyles = {
    border: '10px solid #C68B77',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const popupContentStyles = {
    width: '1000px',
    height: '500px',
    padding: '20px',
    backgroundColor: 'white',
  };

  return (
    <div className="popupBackground" style={popupStyles}>
      <div className="popupContent" style={popupContentStyles}>
        <button type="button" className="popupClose" onClick={onClose}>&times;</button>
        <h1>Warning:</h1>
        <br />
        <p>
          This website represents a project created by a computer science student affiliated with the University of Leeds.
          It is important to note that this website is not intended to serve as a substitute for professional assistance or guidance
          for individuals with autism spectrum disorders (ASD).
          If you or someone you know is autistic and seeking support or advice related to ASD, it is strongly recommended that you
          consult with qualified and licensed professionals who
          specialize in autism-related matters.
          Additionally, please exercise caution while navigating this website, as its content may contain elements that could potentially
          trigger discomfort or unease in certain individuals.
          The website&apos;s primary purpose is educational or developmental,
          and it may not adhere to the specific requirements or
          standards associated with professional resources for individuals with autism.
          The well-being and mental health of individuals with autism are of paramount importance,
          and seeking guidance from experienced professionals is a prudent step to ensure the best possible support and care.
          It&apos;s worth mentioning that this website follows the criteria outlined in the Diagnostic and Statistical Manual of Mental Disorders,
          Fifth Edition (DSM-5) to provide accurate information and resources regarding autism spectrum disorders.
        </p>
      </div>
    </div>
  );
}

// Define PropTypes for PopUp
PopUp.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

function AutismDetector() {
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  const [showChatbot, setShowChatbot] = useState(false);
  const [showPopUp, setShowPopUp] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

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
    padding: isMobile ? '2%' : '2vw',
  };

  const autismHomeVideoStyle = {
    width: '41%',
    height: '300px',
    float: 'left',
    marginTop: '44vh',
    marginLeft: '-10%',
    position: 'relative',
    display: 'block',
    objectFit: 'cover',
    marginBottom: '-38px',
  };

  const dialogueBubbleStyle = {
    position: 'absolute',
    top: '-200px',
    right: '-40%',
    backgroundColor: '#C68B77',
    color: 'white',
    borderRadius: '50%',
    padding: '10px',
    width: '500px',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    zIndex: 5,
    flexDirection: 'column',
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
    width: '143%',
    height: isMobile ? '400px' : '580px',
    marginTop: '3vh',
    zIndex: 2,
  };

  const greyImageStyle = {
    position: 'absolute',
    top: '31%',
    right: '0%',
    width: '50%',
    height: '73%',
    borderTop: '10px solid white',
    borderBottom: '10px solid white',
    borderLeft: '15px solid white',
    borderRight: '10px solid white',
    boxSizing: 'border-box',
    zIndex: 2,
  };

  const textContainerStyle = {
    position: 'absolute',
    top: '44%',
    left: '35%',
    width: '80%',
    color: '#C68B77',
    fontSize: '3vw',
    fontWeight: 'bold',
    zIndex: 3,
    textAlign: 'center',
  };

  const taskbarStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C68B77',
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
    color: '#C68B77',
    fontWeight: 'bold',
  };

  const welcomeMessageStyle = {
    textAlign: 'center',
    marginRight: '2vw',
    color: 'white',
  };

  const buttonStyle = {
    backgroundColor: '#C68B77',
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

  const adviceContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    position: 'absolute',
    marginTop: '5%',
    top: isMobile ? 'calc(80% + 20px)' : '125%',
    left: '50%',
    width: '90%',
    height: '40%',
    transform: 'translate(-50%, -50%)',
    zIndex: 4,
    color: '#C68B77',
    fontSize: isMobile ? 'calc(40% + 10px)' : '1.5vw',
  };

  const chatbotIconStyle = {
    position: 'fixed',
    bottom: isMobile ? '10px' : '20px',
    right: isMobile ? '145px' : '20px',
    backgroundColor: '#C68B77',
    color: 'white',
    padding: '15px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: isMobile ? '15px' : '20px',
    zIndex: 4,
    border: 'solid white',
  };

  const handleYesClick = () => {
    setShowOptions(true);
  };

  const yesButtonStyle = {
    padding: '5px 10px',
    margin: '10px 0',
    backgroundColor: 'white',
    color: '#C68B77',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 100,
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
        backgroundColor: '#C68B77';
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
        backgroundColor: '#C68B77';
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

  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  const toggleHelplinePopup = () => {
    setShowHelplinePopup(!showHelplinePopup);
  };
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  const togglePrivacyPopup = () => {
    setShowPrivacyPopup(!showPrivacyPopup);
  };

  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    let timeoutId; // This will be used to keep track of the timeout so it can be cleared if needed

    // Function to initiate the visibility toggle cycle
    const toggleBubbleVisibility = () => {
      setShowBubble(true); // Show the bubble

      // Set timeout for hiding the bubble after 3.57 seconds
      timeoutId = setTimeout(() => {
        setShowBubble(false);

        // Set timeout for showing the bubble again after 0.99 seconds
        timeoutId = setTimeout(() => {
          toggleBubbleVisibility(); // Recursive call to keep the cycle going
        }, 990); // Duration for bubble to stay hidden
      }, 3570); // Duration for bubble to be visible
    };

    toggleBubbleVisibility(); // Initiate the cycle when the component mounts

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const navigate = useNavigate();
  const handleButtonClick = () => {
    toggleChatbot();
    navigate('/autism_instructions/trackingandnotes');
  };

  return (
    <div style={pageStyle}>
      <style>{mediaQueries}</style>
      <div style={taskbarStyle}>
        <div>
          <Link to="/autism_instructions/personaldetails" style={taskbarItemStyle} className="taskbar-link">Personal Details</Link>
          <Link to="/autism_instructions/eyeTracking" style={taskbarItemStyle} className="taskbar-link">Eye Tracking</Link>
          <Link to="/autism_instructions/game" style={taskbarItemStyle} className="taskbar-link">Social Interaction Game</Link>
          <Link to="/autism_instructions/test" style={taskbarItemStyle} className="taskbar-link">Test</Link>
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
      <div style={autismHomeVideoStyle} className="video-container">
        <video src={autismHomeVideo} alt="Autism Home" autoPlay loop muted style={{ width: '100%', height: '100%' }} />
        {showBubble && (
          <div style={dialogueBubbleStyle}>
            {!showOptions && (
              <>
                <b>Hi! Would you like to talk to me?</b>
                <div>
                  <button type="button" style={yesButtonStyle} onClick={handleYesClick}>Yes</button>
                </div>
              </>
            )}
            {showOptions && (
              <div>
                <button
                  type="button"
                  style={{
                    backgroundColor: '#C68B77',
                    color: 'white',
                    borderRadius: '30px',
                    padding: '10px',
                    borderColor: 'white',
                    fontSize: '15px',
                    width: '300px',
                  }}
                  onClick={toggleChatbot}
                >
                  <b>Click here to access the Chatbot!</b>
                </button>
                <br />
                <br />
                <button
                  type="button"
                  style={{
                    backgroundColor: '#C68B77',
                    color: 'white',
                    borderRadius: '30px',
                    padding: '10px',
                    borderColor: 'white',
                    fontSize: '15px',
                    width: '300px',
                  }}
                  onClick={handleButtonClick}
                >
                  <b>Click here to put in your diary entries!</b>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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
          <Link to="/autism_instructions/questionnairetype" style={buttonStyle}>
            <u>Take a Questionnaire</u>
          </Link>
          <br />
          <Link to="/autism_instructions/eyeTracking" style={buttonStyle}>
            <u>Try the Eye Movement Tracking</u>
          </Link>
        </div>
      </div>
      <button type="button" style={chatbotIconStyle} onClick={toggleChatbot}>
        Click to Chat
      </button>
      {showChatbot && <Chatbot onClose={toggleChatbot} />}
      <PopUp show={showPopUp} onClose={() => setShowPopUp(false)} />
      <footer style={{
        backgroundColor: '#C68B77',
        color: 'white',
        padding: '30px',
        width: '104%',
        marginLeft: '-2%',
      }}
      >
        <b>
          <p style={{ alignItems: 'center' }}>
            © This is a University of Leeds individual project.
          </p>
          {/* Button for helpline numbers */}
          <button
            type="button"
            style={{
              marginLeft: '2%',
              border: '2px solid white',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
              padding: '5px 10px',
              fontSize: '20px',
            }}
            onClick={toggleHelplinePopup}
          >
            <b>Helpline Numbers</b>
          </button>
          <button
            type="button"
            style={{
              marginLeft: '72%',
              border: '2px solid white',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
              padding: '5px 10px',
              fontSize: '20px',
            }}
            onClick={togglePrivacyPopup}
          >
            <b>Privacy Policy</b>
          </button>
          <br />
          <br />
          <br />
        </b>
      </footer>
      {/* Popup for helpline numbers */}
      {showHelplinePopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
        }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
          >
            <h1 style={{ color: '#C68B77' }}>Helpline Numbers</h1>
            {/* https://www.autism.org.uk/contact-us/urgent-help */}
            <br />
            <p>
              <u>1. National Autistic Society:</u>
              <br />
              <b>
                <a style={{ color: '#C68B77' }} href="https://www.autism.org.uk/contact-us" target="_blank" rel="noopener noreferrer">
                  https://www.autism.org.uk/contact-us
                </a>
              </b>
              <br />
              <br />
              <u>2. Immediate risk or danger</u>
              <br />
              Telephone: 999
              <br />
              Textphone users: 18000
              <br />
              <b>
                <a style={{ color: '#C68B77' }} href="https://www.police.uk/pu/contact-us/" target="_blank" rel="noopener noreferrer">
                  https://www.police.uk/pu/contact-us/
                </a>
              </b>
              <br />
              <br />
              <u>3. Urgent medical attention</u>
              <br />
              Go to the Accident and Emergency (A&E) department of any hospital or make an emergency GP appointment
              <br />
              If you live in England, Scotland, or Wales, call the NHS non-emergency line on 111 if medical advice is needed.
              You can also access advice online at
              <br />
              <b>
                <a style={{ color: '#C68B77' }} href="https://111.nhs.uk/" target="_blank" rel="noopener noreferrer">
                  https://111.nhs.uk/
                </a>
              </b>
              <br />
              If you live in Northern Ireland, contact your trust’s GP out of hours service if medical advice is needed.
              <br />
              <b>
                <a
                  style={{ color: '#C68B77' }}
                  href="https://www.nidirect.gov.uk/articles/gp-out-hours-service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.nidirect.gov.uk/articles/gp-out-hours-service
                </a>
              </b>
              <br />
              <br />
              <u>4. National Suicide Prevention Helpline UK</u>
              <br />
              0800 689 5652
              <br />
              (6pm to midnight every day)
              <br />
              <b>
                <a
                  style={{ color: '#C68B77' }}
                  href="https://www.spuk.org.uk/national-suicide-prevention-helpline-uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.spuk.org.uk/national-suicide-prevention-helpline-uk/
                </a>
              </b>
              <br />
            </p>
            <br />
            <button
              type="button"
              style={{
                backgroundColor: '#C68B77', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer',
              }}
              onClick={toggleHelplinePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showPrivacyPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
        }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
          >
            <h1 style={{ color: '#C68B77' }}>Privacy Policy</h1>
            <br />
            <p>
              I understand the importance of your privacy and will do everything possible to protect it.
              Below, I outline how your personal information is collected, used, and protected while using this website.
            </p>
            <br />
            <h3 style={{ color: '#C68B77' }}>1. Collection of Personal Information</h3>
            <p>
              All data collected on this website is kept private and discrete unless you explicitly choose to share it.
              We collect personal information only when necessary for providing and improving our services.
            </p>
            <br />
            <h3 style={{ color: '#C68B77' }}>2. Use of Personal Information</h3>
            <p>
              Any personal information collected is used solely for the purpose of providing and improving the services offered on this website.
              Your questionnaire solutions are saved privately in our database to personalize your experience and provide relevant recommendations.
            </p>
            <br />
            <h3 style={{ color: '#C68B77' }}>3. Protection of Personal Information</h3>
            <p>
              Your privacy and security are paramount.
              All personal information, including passwords, is encrypted to prevent unauthorized access or disclosure.
              We utilize industry-standard security measures to safeguard your data.
            </p>
            <br />
            <h3 style={{ color: '#C68B77' }}>4. Data Retention</h3>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy.
              If you wish to delete or modify your personal information, please contact us.
            </p>
            <br />
            <h3 style={{ color: '#C68B77' }}>5. Updates to Privacy Policy</h3>
            <p>
              This Privacy Policy may be updated from time to time to reflect changes in our practices or legal requirements.
              Any updates will be posted on this page, and your continued use of the website constitutes acceptance of the updated policy.
            </p>
            <br />
            <h3 style={{ color: '#C68B77' }}>6. Contact Information</h3>
            <p>
              If you have any questions, concerns, or requests regarding your privacy or this Privacy Policy,
              please don&apos;t hesitate to contact us at [contact@autismdetector.com].
            </p>
            <br />
            <button
              type="button"
              style={{
                backgroundColor: '#C68B77', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer',
              }}
              onClick={togglePrivacyPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutismDetector;
