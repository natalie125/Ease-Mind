from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required
from app import models, db
from app.endpoints import auth_bp
from sklearn.tree import DecisionTreeClassifier
import joblib # has methods for saving and loading models
import os
import sys

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
