import React, { useContext, useState } from 'react';
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

  let content = <p>loading</p>;

  console.log(token);
  console.log(BASEURL);

  if (true) {
    content = (
      <div className="AddNewComponent">
        <h1>Roots Radar</h1>
        <h2>Add a new patient</h2>
        {/* TODO: What do i need to do */}
        {/* TODO: I need to add only the things that are relavant to the user */}

        <div>
          <p>Sex (M/F)</p>
          <input
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <p>bloodCellCount</p>
          <input
            value={bloodCellCount}
            onChange={(e) => setbloodCellCount(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <p>RespiratoryRate</p>
          <input
            value={RespiratoryRate}
            onChange={(e) => setRespiratoryRate(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <p>HeartRate</p>
          <input
            value={HeartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <p>whiteBloodCellCount</p>
          <input
            value={whiteBloodCellCount}
            onChange={(e) => setwhiteBloodCellCount(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <p>BloodTestResult</p>
          <input
            value={BloodTestResult}
            onChange={(e) => setBloodTestResult(e.target.value)}
            type="text"
          />
        </div>
        {/* And then i need to add their parents */}
        <div>
          <p>MotherSubjectID</p>
          <input
            value={MotherSubjectID}
            onChange={(e) => setMotherSubjectID(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>FatherSubjectID</p>
          <input
            value={FatherSubjectID}
            onChange={(e) => setFatherSubjectID(e.target.value)}
            type="text"
          />
        </div>
      </div>
    );
  }

  return content;
}

export default AddNew;
