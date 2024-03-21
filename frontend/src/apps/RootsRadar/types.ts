export interface IPatient {
  PatientID: number;
  PatientAge: number;
  GenesInMothersSide: number;
  InheritedFromFather: number;
  MaternalGene: number;
  PaternalGene: number;
  BloodCellCount_mcL: number;
  MothersAge: number;
  FathersAge: number;
  RespiratoryRate_breathsPerMin: number;
  HeartRate_ratesPermin: number;
  Gender: number;
  BirthAsphyxia: number;
  FolicAcidDetails_periConceptiona: number;
  HistoryOfSeriousMaternalIllness: number;
  HistoryOfRadiationExposure_xRay: number;
  HistoryOfSubstanceAbuse: number;
  AssistedConception_IVF_ART: number;
  HistoryOfAnomaliesInPreviousPregnancies: number;
  NumberOfPreviousAbortions: number;
  BirthDefects: number;
  WhiteBloodCellCount_thousand_per_microliter: number;
  BloodTestResult: number;
  Symptom1: number;
  Symptom2: number;
  Symptom3: number;
  Symptom4: number;
  Symptom5: number;
  DisorderSubclass: number;
  DisorderSubclassPredicted: number;
}

export interface IPatients {
  patients: IPatient[];
}

export interface ISystemStatistics {
  numberOfPatients: number;
  numberOfPatientsWithoutPrediction: number;
}

export interface IDiagnosis {
  ROW_ID: string;
  SUBJECT_ID: string;
  SEQ_NUM: string;
  ICD9_CODE: string;
  text: string;
}
