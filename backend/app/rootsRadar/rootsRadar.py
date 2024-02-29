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
  for patient in query:
    patient.insert(0,0) # HACK to fix 1 based index
    new_record = models.Patient(
      PatientAge = patient[1],
      GenesInMothersSide = patient[2],
      InheritedFromFather = patient[3],
      MaternalGene = patient[4],
      PaternalGene = patient[5],
      BloodCellCount_mcL = patient[6],
      MothersAge = patient[7],
      FathersAge = patient[8],
      RespiratoryRate_breathsPerMin = patient[9],
      HeartRate_ratesPermin = patient[10],
      Gender = patient[11],
      BirthAsphyxia = patient[12],
      FolicAcidDetails_periConceptiona = patient[13],
      HistoryOfSeriousMaternalIllness = patient[14],
      HistoryOfRadiationExposure_xRay = patient[15],
      HistoryOfSubstanceAbuse = patient[16],
      AssistedConception_IVF_ART = patient[17],
      HistoryOfAnomaliesInPreviousPregnancies = patient[18],
      NumberOfPreviousAbortions = patient[19],
      BirthDefects = patient[20],
      WhiteBloodCellCount_thousand_per_microliter = patient[21],
      BloodTestResult = patient[22],
      Symptom1 = patient[23],
      Symptom2 = patient[24],
      Symptom3 = patient[25],
      Symptom4 = patient[26],
      Symptom5 = patient[27],
      DisorderSubclass = patient[28],
      DisorderSubclassPredicted = None
    )
    db.session.add(new_record)

  db.session.commit()
  response = make_response(jsonify({"msg": "Patient Added"}))
  response.status_code = 200
  return response
