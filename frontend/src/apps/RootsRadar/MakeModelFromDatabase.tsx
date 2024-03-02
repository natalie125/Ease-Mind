import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function MakeModelFromDatabase() {
  const { token } = useContext(AuthTokenContext);

  const [output, setOutput] = useState('');

  const handlePostMakeModels = async () => {
    await axios
      .post(
        `${BASEURL}api/roots-radar/make_model_from_database`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          alert('Models created successfully!');
          setOutput(response.data);
        } else {
          alert('Non 200 code returned. Models not created.');
        }
      })
      .catch((error) => {
        // https://axios-http.com/docs/handling_errors
        if (error.response) {
          alert('Non 2xx code returned. els not create.');
        } else if (error.request) {
          alert('The request was made but no response was received. Models may not have been created.');
        } else {
          alert('Something happened in setting up the request that triggered an Error.');
        }
      });
  };

  return (
    <div className="MakeModelFromDatabaseComponent">
      <h2>MakeModelFromDatabase</h2>
      <button type="button" onClick={() => handlePostMakeModels()}>
        Make Models
      </button>
      <h3>Output:</h3>
      <p>{JSON.stringify(output)}</p>
    </div>
  );
}

export default MakeModelFromDatabase;
