import React from 'react';
import './PatientCard.scss';
import { IPatient } from './types';

interface IProps {
  patient: IPatient;
}

function PatientCard({ patient }: IProps) {
  return (
    <div className="PatientCardComponent" key={patient.PatientID}>
      <div>
        <p>
          PatientID
        </p>
        <div className="dots" />
        <p>
          {patient.PatientID}
        </p>
      </div>
      <div>
        <p>
          PatientAge
        </p>
        <div className="dots" />
        <p>
          {patient.PatientAge}
        </p>
      </div>
      <div>
        <p>
          GenesInMothersSide
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.GenesInMothersSide}
        </p>
      </div>
      <div>
        <p>
          InheritedFromFather
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.InheritedFromFather}
        </p>
      </div>
      <div>
        <p>
          MaternalGene
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.MaternalGene}
        </p>
      </div>
      <div>
        <p>
          PaternalGene
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.PaternalGene}
        </p>
      </div>
      <div>
        <p>
          BloodCellCountmcL
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.BloodCellCount_mcL}
        </p>
      </div>
      <div>
        <p>
          MothersAge
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.MothersAge}
        </p>
      </div>
      <div>
        <p>
          FathersAge
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.FathersAge}
        </p>
      </div>
      <div>
        <p>
          RespiratoryRatebreathsPerMin
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.RespiratoryRate_breathsPerMin}
        </p>
      </div>
      <div>
        <p>
          HeartRateratesPermin
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.HeartRate_ratesPermin}
        </p>
      </div>
      <div>
        <p>
          Gender
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.Gender}
        </p>
      </div>
      <div>
        <p>
          BirthAsphyxia
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.BirthAsphyxia}
        </p>
      </div>
      <div>
        <p>
          FolicAcidDetailsperiConceptiona
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.FolicAcidDetails_periConceptiona}
        </p>
      </div>
      <div>
        <p>
          HistoryOfSeriousMaternalIllness
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.HistoryOfSeriousMaternalIllness}
        </p>
      </div>
      <div>
        <p>
          HistoryOfRadiationExposurexRay
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.HistoryOfRadiationExposure_xRay}
        </p>
      </div>
      <div>
        <p>
          HistoryOfSubstanceAbuse
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.HistoryOfSubstanceAbuse}
        </p>
      </div>
      <div>
        <p>
          AssistedConceptionIVFART
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.AssistedConception_IVF_ART}
        </p>
      </div>
      <div>
        <p>
          HistoryOfAnomaliesInPreviousPregnancies
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.HistoryOfAnomaliesInPreviousPregnancies}
        </p>
      </div>
      <div>
        <p>
          NumberOfPreviousAbortions
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.NumberOfPreviousAbortions}
        </p>
      </div>
      <div>
        <p>
          BirthDefects
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.BirthDefects}
        </p>
      </div>
      <div>
        <p>
          WhiteBloodCellCountthousandpermicroliter
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.WhiteBloodCellCount_thousand_per_microliter}
        </p>
      </div>
      <div>
        <p>
          BloodTestResult
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.BloodTestResult}
        </p>
      </div>
      <div>
        <p>
          Symptom1
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.Symptom1}
        </p>
      </div>
      <div>
        <p>
          Symptom2
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.Symptom2}
        </p>
      </div>
      <div>
        <p>
          Symptom3
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.Symptom3}
        </p>
      </div>
      <div>
        <p>
          Symptom4
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.Symptom4}
        </p>
      </div>
      <div>
        <p>
          Symptom5
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.Symptom5}
        </p>
      </div>
      <div>
        <p>
          DisorderSubclass
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.DisorderSubclass}
        </p>
      </div>
      <div>
        <p>
          DisorderSubclassPredicted
        </p>
        <div />
        <div className="dots" />
        <p>
          {patient.DisorderSubclassPredicted}
        </p>
      </div>
    </div>
  );
}

export default PatientCard;
