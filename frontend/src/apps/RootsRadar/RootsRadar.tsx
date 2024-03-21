import React from 'react';
import './RootsRadar.scss';

function RootsRadar() {
  return (
    <div className="rootsRadar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1>Roots Radar</h1>
      <div className="body-div">
        <h2>Welcome Patient Name!</h2>
        <div className="links-div">
          <a href={`/roots-radar/patient?patient=${'1'}`}>🌲 View your family tree</a>
          <a href="/roots-radar/diagnoses">🏥 View your diagnoses</a>
          <a href="/roots-radar/consent">☑ Give your families doctors consent to use your records</a>
        </div>
      </div>
      <hr />
      <h1>Roots Radar</h1>
      <div className="body-div">
        <h2>Welcome Medical Staff Name!</h2>
        <div className="links-div">
          <a href="/roots-radar/add-new-patient">➕ Add new patient</a>
          <a href="/roots-radar/add-new-patient-basic">➕ Add new patient (basic)</a>
          <a href="/roots-radar/get-patients">🔍 View your patients</a>
        </div>
      </div>
      <hr />
      <h1>Roots Radar</h1>
      <div className="body-div">
        <h2>Welcome System Administrator!</h2>
        <div className="links-div">
          <a href="/roots-radar/make-models-from-database">🏗 Make Model From Database</a>
          <a href="/roots-radar/system-statistics">📊 System Statistics</a>
        </div>
      </div>
    </div>
  );
}

export default RootsRadar;
