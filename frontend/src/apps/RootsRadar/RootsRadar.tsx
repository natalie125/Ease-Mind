import React, { useContext } from 'react';
import { AuthTokenContext } from '../../App';
import './RootsRadar.scss';

function RootsRadar() {
  const { rootsRadarRole, email, id } = useContext(AuthTokenContext);

  if (!id) {
    return <p>Error: No user id specified.</p>;
  }

  if (rootsRadarRole?.toString() === '0') {
    // user
    return (
      <div className="rootsRadar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1>Roots Radar</h1>
        <div className="body-div">
          <h2>
            Welcome&nbsp;
            {email}
            !
          </h2>
          <div className="links-div">
            <a href={`/roots-radar/patient?patient=${id}`}>🌲 View your family tree</a>
            <a href={`/roots-radar/self-report-history?patient=${id}`}>👪 Report your family history</a>
            <a href={`/roots-radar/diagnoses?patient=${id}`}>🏥 View your diagnoses</a>
            <a href="/roots-radar/consent">☑ Give your families doctors consent to use your records</a>
          </div>
        </div>
      </div>
    );
  }

  if (rootsRadarRole?.toString() === '1') {
    // caregiver
    return (
      <div className="rootsRadar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1>Roots Radar</h1>
        <div className="body-div">
          <h2>
            Welcome&nbsp;
            {email}
            !
          </h2>
          <div className="links-div">
            <a href="/roots-radar/add-new-patient">➕👶 Add new patient (from birth)</a>
            <a href="/roots-radar/get-patients">🔍 View your patients</a>
            <a href="/roots-radar/add-new-patient-basic">❓ Manually Query the Model</a>
          </div>
        </div>
      </div>
    );
  }

  if (rootsRadarRole?.toString() === '2') {
    // admin
    return (
      <div className="rootsRadar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1>Roots Radar</h1>
        <div className="body-div">
          <h2>
            Welcome&nbsp;
            {email}
            !
          </h2>
          <div className="links-div">
            <a href="/roots-radar/make-models-from-database">🏗 Make Model From Database</a>
            <a href="/roots-radar/system-statistics">📊 System Statistics</a>
          </div>
        </div>
      </div>
    );
  }

  if (rootsRadarRole?.toString() === '3') {
    // developer
    return (
      <div className="rootsRadar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1>Roots Radar</h1>
        <div className="body-div">
          <h2>
            Welcome&nbsp;
            {email}
            !
          </h2>
          <div className="links-div">
            <a href={`/roots-radar/patient?patient=${id}`}>🌲 View your family tree</a>
            <a href="/roots-radar/diagnoses">🏥 View your diagnoses</a>
            <a href="/roots-radar/consent">☑ Give your families doctors consent to use your records</a>
          </div>
        </div>
        <hr />
        <h1>Roots Radar</h1>
        <div className="body-div">
          <h2>
            Welcome&nbsp;
            {email}
            !
          </h2>
          <div className="links-div">
            <a href="/roots-radar/add-new-patient">➕👶 Add new patient (from birth)</a>
            <a href="/roots-radar/add-new-patient-basic">➕👩 Add new patient (adult - unknown parents)</a>
            <a href="/roots-radar/get-patients">🔍 View your patients</a>
          </div>
        </div>
        <hr />
        <h1>Roots Radar</h1>
        <div className="body-div">
          <h2>
            Welcome&nbsp;
            {email}
            !
          </h2>
          <div className="links-div">
            <a href="/roots-radar/make-models-from-database">🏗 Make Model From Database</a>
            <a href="/roots-radar/system-statistics">📊 System Statistics</a>
          </div>
        </div>
      </div>
    );
  }

  console.log(rootsRadarRole);
  console.log(email);
  return (
    <p>
      Error: Incorrect value for rootsRadarRole (
      {rootsRadarRole}
      )
    </p>
  );
}

export default RootsRadar;
