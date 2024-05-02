import React from 'react';
import PropTypes from 'prop-types';
import termsAndConditionsText from './TermsAndConditionsText';
import './TermsModal.css';

function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modalBackground">
      <div className="modalContent">
        <h2>Terms and Conditions</h2>
        <pre style={{ maxHeight: '400px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
          {termsAndConditionsText}
        </pre>
        <button type="button" className="popupClose" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
// PropTypes for type checking the props being passed to the component
TermsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TermsModal;
