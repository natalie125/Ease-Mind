// Styles.js

export const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#E2E9F9',
  padding: '20px',
  gap: '20px',
  paddingTop: '50px',
};

export const wrapperStyle = {
  border: '2px solid #DBE5FB',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '30px',
  maxWidth: '90%', // Default maximum width
  width: 'auto',
  backgroundColor: '#FFFFFF',
  paddingLeft: '20px',
};

export const inputStyle = {
  padding: '10px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '100%',
  boxSizing: 'border-box',
  fontSize: '1rem',
  lineHeight: '1.5',
};

export const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  margin: '10px 0',
  paddingRight: '20px',
};

export const warningStyle = {
  border: '2px solid #283747',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 8px 16px rgba(40, 55, 71, 0)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  backgroundColor: '#5D6D7E',
};

export const buttonStyle = {
  width: '215px',
  height: '50px',
  border: 'none',
  borderRadius: '10px',
  margin: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

export const radioGroupStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '10px',
  margin: '5px 0',
};

export const containerWithStepsStyle = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#E2E9F9',
  paddingRight: '300px',
  paddingLeft: '50px',
  paddingTop: '30px',
  paddingBottom: '30px',
};

export const formContainerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'top',
  padding: '50px',
  gap: '20px',
  maxWidth: '90%',
  backgroundColor: '#FFFFFF',
  border: '2px solid #DBE5FB',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  borderRadius: '20px',
  paddingLeft: '300px',
  paddingRight: '300px',
  height: 'fit-content',
};

export const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

export const modalStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '80%',
  maxWidth: '500px',
  zIndex: 1001,
};

export const modalHeaderStyle = {
  marginBottom: '15px',
};

export const modalContentStyle = {
  marginBottom: '20px',
};

export const modalFooterStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
};

export const buttonStyleModal = {
  padding: '10px 20px',
  margin: '0 5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',
};

export const cancelButtonStyle = {
  ...buttonStyleModal,
  backgroundColor: '#f44336',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#d32f2f',
  },
};

export const proceedButtonStyle = {
  ...buttonStyleModal,
  backgroundColor: '#4CAF50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#388E3C',
  },
};

export const privacyNoticeContainerStyle = {
  maxWidth: '900px',
  margin: 'auto',
  padding: '20px',
  backgroundColor: '#f5f5f5', // This sets the background color to a light grey.
  gap: '20px',
  paddingTop: '50px',
};

export const privacyNoticeheaderStyle = {
  textAlign: 'center',
  color: '#333',
};

export const privacyNoticesectionStyle = {
  margin: '20px 0',
};

export const privacyNoticecontactEmailStyle = {
  color: '#065A82',
  textDecoration: 'none',
};

export const baseButtonStyle = {
  padding: '10px 20px',
  paddingLeft: '10px',
  margin: '5px 5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',
  textDecoration: 'none', // Added for <Link>
  display: 'inline-flex', // Added for <Link> to align like buttons
  alignItems: 'center', // Added for <Link> to align text like buttons
  justifyContent: 'center', // Center text
  fontSize: '1rem', // Match your button font size
  backgroundColor: '#B9B9B9',
};

export const predefinedQuestionsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
};

export const mainContentStyle = {
  display: 'flex',
  flexDirection: 'row', // Display elements horizontally
  gap: '20px', // Add space between elements
  alignItems: 'flex-start', // Align items at the top
};

export const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
};
