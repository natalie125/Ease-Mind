// OnlineResources.js

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  containerStyle,
  iconContainerStyle,
  buttonStyle,
  wrapperStyle,
  modalBackdropStyle,
  modalStyle,
  modalContentStyle,
  modalFooterStyle,
  proceedButtonStyle,
} from './styles/OnlineResourcesStyles';

import betterHelpLogo from './images/betterhelp-logo.png';
import mindUKLogo from './images/mindUK-logo.png';
import psychologyTodayLogo from './images/psychologyToday-logo.png';
import sevenCupsLogo from './images/7cups-logo.png';
import ukHotlineLogo from './images/nhshotline-logo.png';
import bpsLogo from './images/bps-logo.png';
import calmLogo from './images/calm-logo.png';
import titleIcon from './images/mental-health-resources-logo.png';

// Function to get explanation for each resource
function getResourceExplanation(resourceName) {
  switch (resourceName) {
    case 'BetterHelp':
      return 'Online therapy platform providing access to licensed therapists for a wide range of mental health issues.';
    case 'Psychology Today':
      return 'Online resource containing articles, blogs, and a therapist directory for mental health support.';
    case 'Mind (UK)':
      return 'UK-based charity offering information, resources, and support for mental health issues.';
    case 'National Health Service (NHS) 111':
      return 'UK hotline providing 24/7 support and guidance for those in mental health crisis.';
    case 'Calm':
      return 'App offering guided meditation, sleep stories, and mindfulness exercises for managing stress and anxiety.';
    case '7 Cups':
      return 'Online support platform offering free emotional support, therapy guidance, and trained listeners.';
    case 'British Psychological Society':
      return 'Professional organization in the UK providing referrals, resources, and information on mental health support.';
    default:
      return '';
  }
}

function ResourceLink({ resources }) {
  const [hoveredResource, setHoveredResource] = React.useState(null);

  const handleMouseEnter = (resourceName) => {
    setHoveredResource(resourceName);
  };

  const handleMouseLeave = () => {
    setHoveredResource(null);
  };

  return (
    <div style={wrapperStyle}>
      <div style={iconContainerStyle}>
        {resources.map((resource) => (
          <div
            key={resource.name}
            style={{
              ...buttonStyle,
              backgroundImage: `url(${resource.logo})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              position: 'relative',
            }}
            onMouseEnter={() => handleMouseEnter(resource.name)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: '100%', height: '100%', textDecoration: 'none' }}
            >
              <div style={{ width: '100%', height: '100%' }}>
                {hoveredResource === resource.name && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-50px', // Adjust as necessary
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '5px',
                    fontSize: '16px',
                    textAlign: 'center',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.5',
                    width: '300px', // Adjust as necessary
                    zIndex: 1000, // Higher z-index to ensure it appears in front of icons
                  }}
                  >
                    {getResourceExplanation(resource.name)}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

ResourceLink.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

function ResourcePrivacyNotice({ onClose }) {
  return (
    <div style={modalBackdropStyle}>
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <h2>Disclaimer and Resource Usage Notice</h2>
          <p>
            Access to quality information is vital for everyone.
          </p>
          <p>
            The resources listed here aim to provide additional support and information on various topics.
          </p>
          <p>
            The information and links provided are for general informational purposes only.
          </p>
          <p>
            They are not intended as, and should not be understood as, professional medical advice.
          </p>
          <p>
            The resources are supplementary and should be used in conjunction with professional guidance.
          </p>
          <p>
            While we strive to ensure the quality and accuracy of the information, we cannot guarantee its completeness or suitability for any particular purpose.
            <p>
              Please consult with a qualified professional for personal advice.
            </p>
          </p>
          <p>
            By accessing these resources, you understand and agree that the use of these resources is at your own risk and discretion.
          </p>
          <p>
            If you have any concerns or require immediate assistance, please seek professional help or contact emergency services.
          </p>
        </div>

        <div style={modalFooterStyle}>
          <button type="button" onClick={onClose} style={proceedButtonStyle}>Close</button>
        </div>
      </div>
    </div>
  );
}

ResourcePrivacyNotice.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function OnlineResources() {
  const resourcesData = [
    { name: 'BetterHelp', url: 'https://www.betterhelp.com', logo: betterHelpLogo },
    { name: 'Psychology Today', url: 'https://www.psychologytoday.com', logo: psychologyTodayLogo },
    { name: 'Mind (UK)', url: 'https://www.mind.org.uk/', logo: mindUKLogo },
    { name: 'National Health Service (NHS) 111', url: 'https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/nhs-111/', logo: ukHotlineLogo },
    { name: 'Calm', url: 'https://www.calm.com/', logo: calmLogo },
    { name: '7 Cups', url: 'https://www.7cups.com/', logo: sevenCupsLogo },
    { name: 'British Psychological Society', url: 'https://www.bps.org.uk/', logo: bpsLogo },
  ];

  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);

  const handlePrivacyModalClose = () => {
    setShowPrivacyModal(false);
  };

  React.useEffect(() => {
    setShowPrivacyModal(true);
  }, []);

  return (
    <div className="OnlineResources" style={containerStyle}>
      {showPrivacyModal && <ResourcePrivacyNotice onClose={handlePrivacyModalClose} />}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src={titleIcon}
          alt="Mental Health Resources"
          style={{
            width: '400px',
            height: 'auto',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
      <div style={iconContainerStyle}>
        <ResourceLink resources={resourcesData} />
      </div>
    </div>
  );
}

export default OnlineResources;
