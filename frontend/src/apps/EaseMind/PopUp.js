import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TermsModal from './TermsModal';

function PopUp({ onClose }) {
  const [readTerms, setReadTerms] = useState(false);
  const [agreeDataStore, setAgreeDataStore] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Handle changes in checkbox
  const handleCheckboxChange = ({ target: { id, checked } }) => {
    if (id === 'readTerms') setReadTerms(checked);
    if (id === 'agreeDataStore') setAgreeDataStore(checked);
  };

  // Closure to handle the modal visibility
  const toggleTermsModal = (isVisible) => () => setShowTermsModal(isVisible);

  const handleClose = () => {
    if (readTerms && agreeDataStore) {
      onClose(); // Close the popup if both conditions are met
    } else {
      alert('Please tick both statements before agreeing.');
    }
  };

  return (
    <div className="popupBackground">
      <div className="popupContent">
        <h1>Warning:</h1>
        <p>
          This website is a project developed by a computer science student and is not a professional resource
          for individuals with anxiety issues. If you are experiencing anxiety, please consult with qualified
          professionals. Be aware that the content on this site might cause discomfort for some users.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="checkbox"
              id="readTerms"
              checked={readTerms}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="readTerms">
              Click here if you have read the&nbsp;
              <span
                role="button"
                tabIndex="0"
                style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                onClick={toggleTermsModal(true)}
                onKeyDown={(e) => e.key === 'Enter' && toggleTermsModal(true)()}
              >
                terms and conditions
              </span>
              .
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="agreeDataStore"
              checked={agreeDataStore}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="agreeDataStore">Click here if you agree to us storing your data for training purposes.</label>
          </div>
          <button
            type="button"
            disabled={!readTerms || !agreeDataStore}
            className="agreeButton"
            onClick={handleClose}
          >
            Agree
          </button>
        </form>
      </div>
      <TermsModal isOpen={showTermsModal} onClose={toggleTermsModal(false)} />
    </div>
  );
}

PopUp.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PopUp;
