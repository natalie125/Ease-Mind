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

export interface IPatientHistory {
  PatientID: number;
}

interface IDiagnoses {
  'ROW_ID': number;
  'SUBJECT_ID': number;
  'SEQ_NUM': number;
  'ICD9_CODE': string;
  'SHORT_TITLE': string;
  'LONG_TITLE': string;
  'SELF_REPORTED_FLAG': boolean;
}

interface IChartevents {
  'ROW_ID': number;
  'SUBJECT_ID': number;
  'ITEMID': string;
  'CHARTTIME': string;
  'STORETIME': string;
  'VALUE': string;
  'VALUENUM': number;
  'VALUEUOM': string;
}

interface ILabevents {
'ROW_ID': number;
'SUBJECT_ID': number;
'ITEMID': string;
'CHARTTIME': string;
'VALUE': string;
'VALUENUM': number;
'VALUEUOM': string;
'FLAG': string;
}

interface INoteevents {
'ROW_ID': number;
'SUBJECT_ID': number;
'CHARTDATE': string;
'CHARTTIME': string;
'STORETIME': string;
'CATEGORY': string;
'DESCRIPTION': string;
'TEXT': string;
}

interface IDatetimeevents {
'ROW_ID': number;
'SUBJECT_ID': number;
'ITEMID': string;
'CHARTTIME': string;
'STORETIME': string;
'VALUE': string;
}

interface IDetailsSuccess {
  'consent': 'True';
  id: number;
  'diagnoses': IDiagnoses[];
  'chartevents': IChartevents[];
  'labevents': ILabevents[];
  'noteevents': INoteevents[];
  'datetimeevents': IDatetimeevents[];
}
interface IDetailsFail {
  'consent': 'False';
  id: number;
}

export type IDetails = IDetailsSuccess | IDetailsFail;
