import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import './AddNew.scss';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function AddNew() {
  const { token } = useContext(AuthTokenContext);
  const [FatherSubjectID, setFatherSubjectID] = useState('');
  const [MotherSubjectID, setMotherSubjectID] = useState('');
  const [sex, setSex] = useState('');
  const [bloodCellCount, setbloodCellCount] = useState('');
  const [RespiratoryRate, setRespiratoryRate] = useState('');
  const [HeartRate, setHeartRate] = useState('');
  const [whiteBloodCellCount, setwhiteBloodCellCount] = useState('');
  const [BloodTestResult, setBloodTestResult] = useState('');

  const handlePostPatient = async () => {
    await axios
      .post(
        `${BASEURL}api/roots-radar/mimic-new-patient`,
        {
          patient: {
            FatherSubjectID,
            MotherSubjectID,
            sex,
            bloodCellCount,
            RespiratoryRate,
            HeartRate,
            whiteBloodCellCount,
            BloodTestResult,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          alert('New patient added successfully! Navigate to their page to see their disorder subclass prediction!');
          window.location.assign(`/roots-radar/patient?patient=${response.data.id}`);
          // Might need the new patients subject ID in the response.
        } else {
          alert('Non 200 code returned. Patient not added.');
        }
      })
      .catch((error) => {
        // https://axios-http.com/docs/handling_errors
        if (error.response) {
          alert('Non 2xx code returned. Patient not added.');
        } else if (error.request) {
          alert('The request was made but no response was received. Patient may not have been added.');
        } else {
          alert('Something happened in setting up the request that triggered an Error.');
        }
      });
  };

  let content = <p>loading</p>;

  if (true) {
    content = (
      <div className="AddNewComponent">
        <h1>Roots Radar</h1>
        <h2>Add a new patient (from birth)</h2>
        <div className="inputs-container">
          <div className="input-container">
            <div className="grid-col-container">
              <h3>Parental Information</h3>
              <p>Mother&apos;s User ID</p>
              <input
                value={MotherSubjectID}
                onChange={(e) => setMotherSubjectID(e.target.value)}
                type="text"
              />
            </div>
            <div className="input-container">
              <p>Father&apos;s User ID</p>
              <input
                value={FatherSubjectID}
                onChange={(e) => setFatherSubjectID(e.target.value)}
                type="text"
              />
            </div>
          </div>
          <div className="grid-col-container">
            <h3>
              Initial Measurements
            </h3>
            <div className="input-container">
              <p>Sex (M/F)</p>
              <input
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                type="text"
              />
            </div>
            <div className="input-container">
              <p>Heart Rate</p>
              <p>(Normal = 1, Abnormal = 0)</p>
              <input
                value={HeartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                type="text"
              />
            </div>
            <div className="input-container">
              <p>Respiratory Rate</p>
              <p>(Normal = 1, Abnormal = 0)</p>
              <input
                value={RespiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value)}
                type="text"
              />
            </div>
            <div className="input-container">
              <p>Blood Cell Count (thousands/microliter)</p>
              <input
                value={bloodCellCount}
                onChange={(e) => setbloodCellCount(e.target.value)}
                type="text"
              />
            </div>
            <div className="input-container">
              <p>White Blood Cell Count (thousands/microliter)</p>
              <input
                value={whiteBloodCellCount}
                onChange={(e) => setwhiteBloodCellCount(e.target.value)}
                type="text"
              />
            </div>
            <div className="input-container">
              <p>Blood Test Status (0,1,2,3)</p>
              <input
                value={BloodTestResult}
                onChange={(e) => setBloodTestResult(e.target.value)}
                type="text"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handlePostPatient()}
        >
          Add new patient to health records and make disease prediction.
        </button>
      </div>
    );
  }

  return content;
}

export default AddNew;
