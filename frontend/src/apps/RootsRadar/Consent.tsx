import React from 'react';
import './Consent.scss';

function Consent() {
  return (
    <div className="ConsentComponent">
      <h1>Roots Radar</h1>
      <div className="leftAlignDiv">
        <h2>Consent Form</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input type="checkbox" id="label1" />
            <label htmlFor="label1">Give my children&apos;s doctors access to my health records for use in my children&apos;s care.</label>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <button
              type="button"
              style={{
                padding: '0.25rem',
              }}
            >
              Submit Update To Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consent;
