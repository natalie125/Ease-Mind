import React, {
  useState, useContext, useEffect,
} from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
// import { IPatients } from './types';
// import PatientCard from './PatientCard';
import './GetPatients.scss';

interface IPListNew {
  id: number;
  email: string;
}

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function GetPatients() {
  const { token } = useContext(AuthTokenContext);

  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const [patients, setPatients] = useState<IPListNew[] | null>(null);
  const [patientsList, setPatientsList] = useState<IPListNew[]>([]);
  // console.log(patients);
  // console.log(patientsList);
  // const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  // const [errorPrediction, setErrorPrediction] = useState('');

  const callGetPatientsAPI = async () => (
    axios
      .get(
        `${BASEURL}api/roots-radar/list-patients`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data.patients as IPListNew[];
        }
        setError('Non 200 code returned. Patients not fetched.');
        return null;
      })
      .catch((_error) => {
        // https://axios-http.com/docs/handling_errors
        if (_error.response) {
          setError('Non 2xx code returned. Patients not fetched.');
        } else if (_error.request) {
          setError('The request was made but no response was received.');
        }
        setError('Something happened in setting up the request that triggered an Error.');
        return null;
      })
  );

  const getAllPatients = async () => {
    setIsLoading(true);
    const response = await callGetPatientsAPI();
    setIsLoading(false);
    if (!response) return;
    // setPatients(response);
    setPatientsList(response ?? []);
  };

  useEffect(() => {
    getAllPatients();
  }, []);

  // const callPredictUnpredictedSubclassAPI = async () => (
  //   axios
  //     .post(
  //       `${BASEURL}api/roots-radar/predict-unpredicted`,
  //       {},
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         // return response.data as IPatients;
  //         getAllPatients();
  //         return 200;
  //       }
  //       setErrorPrediction('Non 200 code returned. Patients not fetched.');
  //       return null;
  //     })
  //     .catch((_error) => {
  //       // https://axios-http.com/docs/handling_errors
  //       if (_error.response) {
  //         setErrorPrediction('Non 2xx code returned. Patients not fetched.');
  //       } else if (_error.request) {
  //         setErrorPrediction('The request was made but no response was received.');
  //       }
  //       setErrorPrediction('Something happened in setting up the request that triggered an Error.');
  //       return null;
  //     })
  // );

  // const predictUnpredictedSubclass = async () => {
  //   setIsLoadingPrediction(true);
  //   const response = await callPredictUnpredictedSubclassAPI();
  //   setIsLoadingPrediction(false);
  //   if (!response) return;
  //   alert('Predictions Completed!');
  // };

  // console.log(isLoadingPrediction);
  // console.log(errorPrediction);

  return (
    <div className="GetPatientsComponent">
      <h1>Roots Radar</h1>

      <a className="back-link" href="/roots-radar">← Back</a>
      <h2>Patients</h2>
      {/* <h3>Prediction Controls</h3>
      {isLoadingPrediction
        ? <p>Making predictions...</p>
        : (
          <button type="button" onClick={() => predictUnpredictedSubclass()}>
            Predict Disorder Subclass for all patients without prediction
          </button>
        )}
      {errorPrediction && <p>{errorPrediction}</p>}
      <hr /> */}
      <h3>Patients View</h3>
      <label htmlFor="patients_search_input">Search patients by ID or name:</label>
      <input
        id="patients_search_input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Patient ID"
      />
      {isLoading && error === ''
        ? <p>Loading...</p>
        : (
          <div className="patients">
            <table>
              <thead>
                <tr>
                  <td>Name</td>
                  <td>ID</td>
                </tr>
              </thead>
              <tbody>
                {/* {patients && (patients[0]?.email ?? 'undef')} */}
                {patientsList
                  .filter((patient) => patient.id.toString().startsWith(searchQuery) || patient.email.toString().startsWith(searchQuery))
                  .map((patient) => (
                    <tr>
                      <td><a href={`/roots-radar/patient?patient=${patient.id}`}>{patient.email}</a></td>
                      <td>
                        <a href={`/roots-radar/patient?patient=${patient.id}`}>
                          Patient ID:
                          {patient.id}
                        </a>
                      </td>
                    </tr>
                    // <PatientCard patient={patient} />
                  ))}
              </tbody>
            </table>
          </div>
        )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default GetPatients;
