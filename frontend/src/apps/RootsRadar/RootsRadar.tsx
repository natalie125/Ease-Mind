import React from 'react';
import SystemStatistics from './SystemStatistics';

function RootsRadar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1 style={{ marginTop: '1rem' }}>Roots Radar</h1>
      <h3>Pages</h3>
      <ul>
        <li><a href="/roots-radar/add-new-patient-basic">➕ Add new patient (basic)</a></li>
        <li><a href="/roots-radar/make-models-from-database">🏗 Make Model From Database</a></li>
        <li><a href="/roots-radar/get-patients">📃 List Patients</a></li>
        <li><a href="/roots-radar/system-statistics">📊 System Statistics</a></li>
      </ul>
      <hr />
      <h3>Dev/Debug</h3>
      <SystemStatistics />
    </div>
  );
}

export default RootsRadar;
