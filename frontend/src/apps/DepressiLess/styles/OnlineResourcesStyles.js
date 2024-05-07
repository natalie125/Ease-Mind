// OnlineResourcesStyles.js
export const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#E2E9F9',
  padding: '1rem', // Adjust padding for overall container
};

export const iconContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  maxWidth: '960px', // Adjust the width of the container
  marginTop: '1rem',
  marginBottom: '1rem',
  padding: '0 120px', // Add padding to ensure proper spacing
};

export const buttonStyle = {
  width: '150px', // Adjust the width of the buttons
  height: '150px', // Keep the height to maintain a square aspect ratio
  border: 'none',
  borderRadius: '10px',
  margin: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const wrapperStyle = {
  border: '2px solid #DBE5FB',
  borderRadius: '20px',
  padding: '1rem',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'row', // Keep row for horizontal layout
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  backgroundColor: '#FFFFFF',
  maxWidth: '960px', // Set a max-width for large screens
  margin: 'auto', // Center the wrapper
};

export const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  maxWidth: '80%',
  padding: '20px',
};

export const modalContentStyle = {
  margin: '20px',
};

export const modalFooterStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
};

export const proceedButtonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '10px',
};
