import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../App';
import './AddNewPatientBasic.scss';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function randomIntStringBetween0andXInclusive(x: number) {
  return Math.floor(Math.random() * (x + 1)).toString();
}

function AddNewPatientBasic() {
  const { token } = useContext(AuthTokenContext);

  const [PatientAge, setPatientAge] = useState('');
  const [GenesInMothersSide, setGenesInMothersSide] = useState('');
  const [InheritedFromFather, setInheritedFromFather] = useState('');
  const [MaternalGene, setMaternalGene] = useState('');
  const [PaternalGene, setPaternalGene] = useState('');
  const [BloodCellCountmcL, setBloodCellCountmcL] = useState('');
  const [MothersAge, setMothersAge] = useState('');
  const [FathersAge, setFathersAge] = useState('');
  const [RespiratoryRatebreathsPerMin, setRespiratoryRatebreathsPerMin] = useState('');
  const [HeartRateratesPermin, setHeartRateratesPermin] = useState('');
  const [Gender, setGender] = useState('');
  const [BirthAsphyxia, setBirthAsphyxia] = useState('');
  const [FolicAcidDetailsperiConceptiona, setFolicAcidDetailsperiConceptiona] = useState('');
  const [HistoryOfSeriousMaternalIllness, setHistoryOfSeriousMaternalIllness] = useState('');
  const [HistoryOfRadiationExposurexRay, setHistoryOfRadiationExposurexRay] = useState('');
  const [HistoryOfSubstanceAbuse, setHistoryOfSubstanceAbuse] = useState('');
  const [AssistedConceptionIVFART, setAssistedConceptionIVFART] = useState('');
  const [HistoryOfAnomaliesInPreviousPregnancies, setHistoryOfAnomaliesInPreviousPregnancies] = useState('');
  const [NumberOfPreviousAbortions, setNumberOfPreviousAbortions] = useState('');
  const [BirthDefects, setBirthDefects] = useState('');
  const [WhiteBloodCellCountthousandpermicroliter, setWhiteBloodCellCountthousandpermicroliter] = useState('');
  const [BloodTestResult, setBloodTestResult] = useState('');
  const [Symptom1, setSymptom1] = useState('');
  const [Symptom2, setSymptom2] = useState('');
  const [Symptom3, setSymptom3] = useState('');
  const [Symptom4, setSymptom4] = useState('');
  const [Symptom5, setSymptom5] = useState('');
  const [DisorderSubclass, setDisorderSubclass] = useState('');

  const handlePostPatient = async () => {
    await axios
      .post(
        `${BASEURL}api/roots-radar/new_patient`,
        {
          patients: [[
            PatientAge,
            GenesInMothersSide,
            InheritedFromFather,
            MaternalGene,
            PaternalGene,
            BloodCellCountmcL,
            MothersAge,
            FathersAge,
            RespiratoryRatebreathsPerMin,
            HeartRateratesPermin,
            Gender,
            BirthAsphyxia,
            FolicAcidDetailsperiConceptiona,
            HistoryOfSeriousMaternalIllness,
            HistoryOfRadiationExposurexRay,
            HistoryOfSubstanceAbuse,
            AssistedConceptionIVFART,
            HistoryOfAnomaliesInPreviousPregnancies,
            NumberOfPreviousAbortions,
            BirthDefects,
            WhiteBloodCellCountthousandpermicroliter,
            BloodTestResult,
            Symptom1,
            Symptom2,
            Symptom3,
            Symptom4,
            Symptom5,
            DisorderSubclass,
          ]],
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
          alert(`Predicted disorder subclass is ${response.data.subclass}`);
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

  return (
    <div className="AddNewPatientBasicComponent">
      <a className="back-link" href="/roots-radar">← Back</a>
      <h2>AI Disorder Subclass Manual Query</h2>
      <button
        type="button"
        onClick={() => {
          // TODO: Fill all states with good values.
          setPatientAge(randomIntStringBetween0andXInclusive(2));
          setGenesInMothersSide(randomIntStringBetween0andXInclusive(1));
          setInheritedFromFather(randomIntStringBetween0andXInclusive(1));
          setMaternalGene(randomIntStringBetween0andXInclusive(1));
          setPaternalGene(randomIntStringBetween0andXInclusive(1));
          setBloodCellCountmcL(((Math.floor(Math.random() * 4000) + 5700) / 1000.0).toString());
          setMothersAge((Math.floor(Math.random() * 55) + 18).toString());
          setFathersAge((Math.floor(Math.random() * 60) + 18).toString());
          setRespiratoryRatebreathsPerMin(randomIntStringBetween0andXInclusive(1));
          setHeartRateratesPermin(randomIntStringBetween0andXInclusive(1));
          setGender(randomIntStringBetween0andXInclusive(2));
          setBirthAsphyxia(randomIntStringBetween0andXInclusive(1));
          setFolicAcidDetailsperiConceptiona(randomIntStringBetween0andXInclusive(1));
          setHistoryOfSeriousMaternalIllness(randomIntStringBetween0andXInclusive(1));
          setHistoryOfRadiationExposurexRay(randomIntStringBetween0andXInclusive(1));
          setHistoryOfSubstanceAbuse(randomIntStringBetween0andXInclusive(1));
          setAssistedConceptionIVFART(randomIntStringBetween0andXInclusive(1));
          setHistoryOfAnomaliesInPreviousPregnancies(randomIntStringBetween0andXInclusive(1));
          setNumberOfPreviousAbortions(randomIntStringBetween0andXInclusive(5));
          setBirthDefects(randomIntStringBetween0andXInclusive(1));
          setWhiteBloodCellCountthousandpermicroliter(((Math.floor(Math.random() * 1200) + 300) / 100.0).toString());
          setBloodTestResult(randomIntStringBetween0andXInclusive(3));
          setSymptom1(randomIntStringBetween0andXInclusive(1));
          setSymptom2(randomIntStringBetween0andXInclusive(1));
          setSymptom3(randomIntStringBetween0andXInclusive(1));
          setSymptom4(randomIntStringBetween0andXInclusive(1));
          setSymptom5(randomIntStringBetween0andXInclusive(1));
          setDisorderSubclass(['0', '5', '6'][Math.floor(Math.random() * 3)]);
        }}
      >
        Fill with within-range data (For Testing/Demo)
      </button>
      <div className="add-new-patient-form">
        <div>
          <p>PatientAge</p>
          <input
            value={PatientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>GenesInMothersSide</p>
          <input
            value={GenesInMothersSide}
            onChange={(e) => setGenesInMothersSide(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>InheritedFromFather</p>
          <input
            value={InheritedFromFather}
            onChange={(e) => setInheritedFromFather(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>MaternalGene</p>
          <input
            value={MaternalGene}
            onChange={(e) => setMaternalGene(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>PaternalGene</p>
          <input
            value={PaternalGene}
            onChange={(e) => setPaternalGene(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>BloodCellCountmcL</p>
          <input
            value={BloodCellCountmcL}
            onChange={(e) => setBloodCellCountmcL(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>MothersAge</p>
          <input
            value={MothersAge}
            onChange={(e) => setMothersAge(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>FathersAge</p>
          <input
            value={FathersAge}
            onChange={(e) => setFathersAge(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>RespiratoryRatebreathsPerMin</p>
          <input
            value={RespiratoryRatebreathsPerMin}
            onChange={(e) => setRespiratoryRatebreathsPerMin(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>HeartRateratesPermin</p>
          <input
            value={HeartRateratesPermin}
            onChange={(e) => setHeartRateratesPermin(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>Gender</p>
          <input
            value={Gender}
            onChange={(e) => setGender(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>BirthAsphyxia</p>
          <input
            value={BirthAsphyxia}
            onChange={(e) => setBirthAsphyxia(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>FolicAcidDetailsperiConceptiona</p>
          <input
            value={FolicAcidDetailsperiConceptiona}
            onChange={(e) => setFolicAcidDetailsperiConceptiona(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>HistoryOfSeriousMaternalIllness</p>
          <input
            value={HistoryOfSeriousMaternalIllness}
            onChange={(e) => setHistoryOfSeriousMaternalIllness(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>HistoryOfRadiationExposurexRay</p>
          <input
            value={HistoryOfRadiationExposurexRay}
            onChange={(e) => setHistoryOfRadiationExposurexRay(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>HistoryOfSubstanceAbuse</p>
          <input
            value={HistoryOfSubstanceAbuse}
            onChange={(e) => setHistoryOfSubstanceAbuse(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>AssistedConceptionIVFART</p>
          <input
            value={AssistedConceptionIVFART}
            onChange={(e) => setAssistedConceptionIVFART(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>HistoryOfAnomaliesInPreviousPregnancies</p>
          <input
            value={HistoryOfAnomaliesInPreviousPregnancies}
            onChange={(e) => setHistoryOfAnomaliesInPreviousPregnancies(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>NumberOfPreviousAbortions</p>
          <input
            value={NumberOfPreviousAbortions}
            onChange={(e) => setNumberOfPreviousAbortions(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>BirthDefects</p>
          <input
            value={BirthDefects}
            onChange={(e) => setBirthDefects(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>WhiteBloodCellCountthousandpermicroliter</p>
          <input
            value={WhiteBloodCellCountthousandpermicroliter}
            onChange={(e) => setWhiteBloodCellCountthousandpermicroliter(e.target.value)}
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
        <div>
          <p>Symptom1</p>
          <input
            value={Symptom1}
            onChange={(e) => setSymptom1(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>Symptom2</p>
          <input
            value={Symptom2}
            onChange={(e) => setSymptom2(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>Symptom3</p>
          <input
            value={Symptom3}
            onChange={(e) => setSymptom3(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>Symptom4</p>
          <input
            value={Symptom4}
            onChange={(e) => setSymptom4(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>Symptom5</p>
          <input
            value={Symptom5}
            onChange={(e) => setSymptom5(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <p>DisorderSubclass (Optional)</p>
          <input
            value={DisorderSubclass}
            onChange={(e) => setDisorderSubclass(e.target.value)}
            type="text"
          />
        </div>
        <button
          type="button"
          onClick={() => handlePostPatient()}
        >
          Query the model
        </button>
      </div>
    </div>
  );
}

export default AddNewPatientBasic;
