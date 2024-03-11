from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required
from app import models, db
from app.endpoints import auth_bp
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn import svm
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
import joblib # has methods for saving and loading models
import os
import sys
from sqlalchemy import create_engine
import pandas as pd

@auth_bp.route('/api/roots-radar/mvp-string', methods=['GET', 'POST'])
@jwt_required()
def mvpString():
  if request.method == 'GET':
    id = request.args.get('id')

    query_result = models.RootRadarMVPTest.query.filter_by(id=id).first()

    if query_result:
      response = make_response(jsonify({"text": query_result.text}))
      response.status_code = 200
      return response

    else:
      response = make_response(jsonify({"msg": "no record with that id exists"}))
      response.status_code = 400
      return response

  elif request.method == 'POST':
    text = request.get_json()['text']

    if (not text):
      response = make_response(jsonify({"msg": "no text attribute was supplied"}))
      response.status_code = 400
      return response

    new_record = models.RootRadarMVPTest(text=text)
    db.session.add(new_record)
    db.session.commit()

    response = make_response(jsonify({"id": new_record.id}))
    response.status_code = 200
    return response


@auth_bp.route('/api/roots-radar/music_prediction', methods=['GET'])
def music():
  age = request.args.get('age') # age is number >= 0
  sex = request.args.get('sex') # sex is either 1 or 0

  this_dir = os.path.dirname(__file__)
  M = joblib.load(f'{this_dir}/music_reccommender.joblib')
  genre = M.predict([[age, sex]])[0]

  response = make_response(jsonify({"msg": f"Genre: {genre}"}))
  response.status_code = 200
  return response

@auth_bp.route('/api/roots-radar/scv_linear', methods=['POST'])
def first_predict_svc_linear():
  query = request.get_json()['query']
  print(query)
  this_dir = os.path.dirname(__file__)
  # FROM SCRIPT MODEL
  #M = joblib.load(f'{this_dir}/classifier-LinearSVM-joblib-dump.joblib')
  M = joblib.load(f'{this_dir}/classifier-linear-svc-FROMDATABASE-inAPI-joblib-dump.joblib')
  # TODO: check input data
  subclass = M.predict([query])[0]
  response = make_response(jsonify({"msg": f"Class: {subclass}"}))
  response.status_code = 200
  return response

@auth_bp.route('/api/roots-radar/make_model_from_database', methods=['POST'])
def make_model_from_database():
  cnx = create_engine('sqlite:///app.db').connect()
  df = pd.read_sql_table('patient', cnx)
  df.drop('id', axis=1, inplace=True)
  df.drop('DisorderSubclassPredicted', axis=1, inplace=True)

  # TODO: Now patients may not have a disorder so NaNs can appear in target.
  # Need to sanitize input. Will need to do more sanitization when full 

  targetColumn = 'DisorderSubclass'
  output_set = df[targetColumn]
  input_set = df.drop(columns=[targetColumn])
  X_train, X_test, Y_train, Y_test = train_test_split(input_set, output_set, test_size=0.2, random_state = 1)

  model = svm.SVC(kernel='linear') # Linear Kernel
  model.fit(X_train, Y_train)

  prediction = model.predict(X_test)
  acc = accuracy_score(Y_test, prediction)

  this_dir = os.path.dirname(__file__)
  joblib.dump(model, f'{this_dir}/classifier-linear-svc-FROMDATABASE-inAPI-joblib-dump.joblib')

  response = make_response(jsonify({"msg": "Model created with accuracy = " + str(acc)}))
  response.status_code = 200
  return response

@auth_bp.route('/api/roots-radar/new_patient', methods=['POST'])
def new_patient():
  query = request.get_json()['patients']
  this_dir = os.path.dirname(__file__)
  M = joblib.load(f'{this_dir}/classifier-linear-svc-FROMDATABASE-inAPI-joblib-dump.joblib')
  for patient in query:
    subclass = M.predict([patient[0:-1]])
    patient.insert(0,0) # HACK to fix 1 based index
    print(f"\n\npatient = {patient}\n\n")
    # TODO: model validation?
    new_record = models.Patient(
      PatientAge = float(patient[1]),
      GenesInMothersSide = float(patient[2]),
      InheritedFromFather = float(patient[3]),
      MaternalGene = float(patient[4]),
      PaternalGene = float(patient[5]),
      BloodCellCount_mcL = float(patient[6]),
      MothersAge = float(patient[7]),
      FathersAge = float(patient[8]),
      RespiratoryRate_breathsPerMin = float(patient[9]),
      HeartRate_ratesPermin = float(patient[10]),
      Gender = float(patient[11]),
      BirthAsphyxia = float(patient[12]),
      FolicAcidDetails_periConceptiona = float(patient[13]),
      HistoryOfSeriousMaternalIllness = float(patient[14]),
      HistoryOfRadiationExposure_xRay = float(patient[15]),
      HistoryOfSubstanceAbuse = float(patient[16]),
      AssistedConception_IVF_ART = float(patient[17]),
      HistoryOfAnomaliesInPreviousPregnancies = float(patient[18]),
      NumberOfPreviousAbortions = float(patient[19]),
      BirthDefects = float(patient[20]),
      WhiteBloodCellCount_thousand_per_microliter = float(patient[21]),
      BloodTestResult = float(patient[22]),
      Symptom1 = float(patient[23]),
      Symptom2 = float(patient[24]),
      Symptom3 = float(patient[25]),
      Symptom4 = float(patient[26]),
      Symptom5 = float(patient[27]),
      DisorderSubclass = None if patient[28] == '' else float(patient[28]),
      DisorderSubclassPredicted = subclass
    )
    db.session.add(new_record)

  db.session.commit()
  response = make_response(jsonify({"msg": "Patient Added"}))
  response.status_code = 200
  return response

@auth_bp.route('/api/roots-radar/list-patients', methods=['GET'])
def list_patients():
  patients = models.Patient.query.all()
  r = [{
        "PatientID": p.id,
        "PatientAge": p.PatientAge,
        "GenesInMothersSide": p.GenesInMothersSide,
        "InheritedFromFather": p.InheritedFromFather,
        "MaternalGene": p.MaternalGene,
        "PaternalGene": p.PaternalGene,
        "BloodCellCount_mcL": p.BloodCellCount_mcL,
        "MothersAge": p.MothersAge,
        "FathersAge": p.FathersAge,
        "RespiratoryRate_breathsPerMin": p.RespiratoryRate_breathsPerMin,
        "HeartRate_ratesPermin": p.HeartRate_ratesPermin,
        "Gender": p.Gender,
        "BirthAsphyxia": p.BirthAsphyxia,
        "FolicAcidDetails_periConceptiona": p.FolicAcidDetails_periConceptiona,
        "HistoryOfSeriousMaternalIllness": p.HistoryOfSeriousMaternalIllness,
        "HistoryOfRadiationExposure_xRay": p.HistoryOfRadiationExposure_xRay,
        "HistoryOfSubstanceAbuse": p.HistoryOfSubstanceAbuse,
        "AssistedConception_IVF_ART": p.AssistedConception_IVF_ART,
        "HistoryOfAnomaliesInPreviousPregnancies": p.HistoryOfAnomaliesInPreviousPregnancies,
        "NumberOfPreviousAbortions": p.NumberOfPreviousAbortions,
        "BirthDefects": p.BirthDefects,
        "WhiteBloodCellCount_thousand_per_microliter": p.WhiteBloodCellCount_thousand_per_microliter,
        "BloodTestResult": p.BloodTestResult,
        "Symptom1": p.Symptom1,
        "Symptom2": p.Symptom2,
        "Symptom3": p.Symptom3,
        "Symptom4": p.Symptom4,
        "Symptom5": p.Symptom5,
        "DisorderSubclass": p.DisorderSubclass,
        "DisorderSubclassPredicted": p.DisorderSubclassPredicted
      } for p in patients
  ]
  response = make_response(jsonify({"patients": r}))
  response.status_code = 200
  return response

@auth_bp.route('/api/roots-radar/number_of_patients_without_prediction', methods=['GET'])
def number_of_patients_without_prediction():
  patients = models.Patient.query.filter_by(DisorderSubclassPredicted=None)
  r = [{
        "PatientID": p.id,
        "PatientAge": p.PatientAge,
        "GenesInMothersSide": p.GenesInMothersSide,
        "InheritedFromFather": p.InheritedFromFather,
        "MaternalGene": p.MaternalGene,
        "PaternalGene": p.PaternalGene,
        "BloodCellCount_mcL": p.BloodCellCount_mcL,
        "MothersAge": p.MothersAge,
        "FathersAge": p.FathersAge,
        "RespiratoryRate_breathsPerMin": p.RespiratoryRate_breathsPerMin,
        "HeartRate_ratesPermin": p.HeartRate_ratesPermin,
        "Gender": p.Gender,
        "BirthAsphyxia": p.BirthAsphyxia,
        "FolicAcidDetails_periConceptiona": p.FolicAcidDetails_periConceptiona,
        "HistoryOfSeriousMaternalIllness": p.HistoryOfSeriousMaternalIllness,
        "HistoryOfRadiationExposure_xRay": p.HistoryOfRadiationExposure_xRay,
        "HistoryOfSubstanceAbuse": p.HistoryOfSubstanceAbuse,
        "AssistedConception_IVF_ART": p.AssistedConception_IVF_ART,
        "HistoryOfAnomaliesInPreviousPregnancies": p.HistoryOfAnomaliesInPreviousPregnancies,
        "NumberOfPreviousAbortions": p.NumberOfPreviousAbortions,
        "BirthDefects": p.BirthDefects,
        "WhiteBloodCellCount_thousand_per_microliter": p.WhiteBloodCellCount_thousand_per_microliter,
        "BloodTestResult": p.BloodTestResult,
        "Symptom1": p.Symptom1,
        "Symptom2": p.Symptom2,
        "Symptom3": p.Symptom3,
        "Symptom4": p.Symptom4,
        "Symptom5": p.Symptom5,
        "DisorderSubclass": p.DisorderSubclass,
        "DisorderSubclassPredicted": p.DisorderSubclassPredicted
      } for p in patients
  ]
  response = make_response(jsonify({"patients": r}))
  response.status_code = 200
  return response

@auth_bp.route('/api/roots-radar/system-statistics', methods=['GET'])
def system_statistics():
  response = make_response(jsonify({
    "numberOfPatients": len(models.Patient.query.all()),
    "numberOfPatientsWithoutPrediction": len(models.Patient.query.filter_by(
      DisorderSubclassPredicted=None
    ).all()),
  }))
  response.status_code = 200
  return response

@auth_bp.route('/api/roots-radar/predict-unpredicted', methods=['POST'])
def predict_unpredicted():
  this_dir = os.path.dirname(__file__)
  M = joblib.load(f'{this_dir}/classifier-linear-svc-FROMDATABASE-inAPI-joblib-dump.joblib')

  targets = models.Patient.query.filter_by(DisorderSubclassPredicted=None).all()
  for targetPatient in targets:
    query = [
          targetPatient.PatientAge,
          targetPatient.GenesInMothersSide,
          targetPatient.InheritedFromFather,
          targetPatient.MaternalGene,
          targetPatient.PaternalGene,
          targetPatient.BloodCellCount_mcL,
          targetPatient.MothersAge,
          targetPatient.FathersAge,
          targetPatient.RespiratoryRate_breathsPerMin,
          targetPatient.HeartRate_ratesPermin,
          targetPatient.Gender,
          targetPatient.BirthAsphyxia,
          targetPatient.FolicAcidDetails_periConceptiona,
          targetPatient.HistoryOfSeriousMaternalIllness,
          targetPatient.HistoryOfRadiationExposure_xRay,
          targetPatient.HistoryOfSubstanceAbuse,
          targetPatient.AssistedConception_IVF_ART,
          targetPatient.HistoryOfAnomaliesInPreviousPregnancies,
          targetPatient.NumberOfPreviousAbortions,
          targetPatient.BirthDefects,
          targetPatient.WhiteBloodCellCount_thousand_per_microliter,
          targetPatient.BloodTestResult,
          targetPatient.Symptom1,
          targetPatient.Symptom2,
          targetPatient.Symptom3,
          targetPatient.Symptom4,
          targetPatient.Symptom5
        ]
    subclass = M.predict([query])[0]
    targetPatient.DisorderSubclassPredicted = subclass

  db.session.commit()
  return ("Success", 200)
