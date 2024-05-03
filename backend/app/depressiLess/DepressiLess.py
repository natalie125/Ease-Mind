# backend/app/depressiLess/DepressiLess.py

from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import UserInformation, UserMentalHealthHistory, UserMedicalHistory, QuestionnaireForm, ChatMessage, TextClassification
from app.endpoints import auth_bp
from datetime import datetime
from sqlalchemy import extract
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from text_analysis import preprocess_text, classify_text
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import gdown
import os

# Load GPT-2 model
tokenizerGPT2 = GPT2Tokenizer.from_pretrained('gpt2')
gpt_model = GPT2LMHeadModel.from_pretrained('gpt2')
gpt_model.eval()

app = Flask(__name__)
CORS(app)

"""
google_drive_model_id = '10BdhMe8kXoxw5tPWLdv8yIYwTnYGuNZz'
model_directory = 'app/depressiLess/models'
model_filename = 'my_depression_model.zip'
model_path = os.path.join(model_directory, 'my_depression_model')

def setup_model():
    # Ensure the directory exists
    if not os.path.exists(model_directory):
        os.makedirs(model_directory)

    # Full path to the zipfile
    zip_path = os.path.join(model_directory, model_filename)

    # Download if the model directory is empty
    if not os.listdir(model_path):
        gdown.download(f'https://drive.google.com/uc?id={google_drive_model_id}', zip_path, quiet=False)
        # Unzip the file
        import zipfile
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(model_directory)
        os.remove(zip_path)  # Clean up zip file

@auth_bp.before_first_request
def initialize_model():
    setup_model()
    # Assuming the model and tokenizer are in the same path after extraction
    global depression_model
    global tokenizerModel
    my_depression_model = AutoModelForSequenceClassification.from_pretrained(model_path)
    tokenizerModel = AutoTokenizer.from_pretrained(model_path)
    my_depression_model.eval()
"""

@app.errorhandler(Exception)
def handle_unexpected_error(error):
    current_app.logger.error(f'Unexpected error: {error}')
    response = {"error": "An unexpected error occurred"}
    return jsonify(response), 500

@auth_bp.route('/test_endpoint', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Test endpoint reached"}), 200

@auth_bp.route('/submit_user_info', methods=['POST'])
@jwt_required()
def submit_user_info():
    current_user_id = get_jwt_identity()
    data = request.json

    
    try:
        user_info = UserInformation.query.filter_by(user_id=current_user_id).first()
    
        if user_info:
            # If record exists, update it
            user_info.name = data.get('name')
            user_info.genderIdentity = data.get('genderIdentity')
            user_info.sexAssignedAtBirth = data.get('sexAssignedAtBirth')
            user_info.age = data.get('age')
            user_info.nationality = data.get('nationality')
            user_info.sexualOrientation = data.get('sexualOrientation')
        else:
            # If no record exists, create a new one
            user_info = UserInformation(
                user_id=current_user_id,
                name=data.get('name'),
                genderIdentity=data.get('genderIdentity'),
                sexAssignedAtBirth=data.get('sexAssignedAtBirth'),
                age=data.get('age'),
                streetName=data.get('streetName'),
                nationality=data.get('nationality'),
                sexualOrientation=data.get('sexualOrientation')
            )
            db.session.add(user_info)

        db.session.commit()
        return jsonify({"message": "User Information saved successfully"}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f'Unexpected error saving personal details: {e}')
        return jsonify({"error": "Unable to save details"}), 500

@auth_bp.route('/get_user_info', methods=['GET'])
@jwt_required()
def get_user_info():
    current_user_id = get_jwt_identity()
    user_info = UserInformation.query.filter_by(user_id=current_user_id).first()

    if user_info:
        result = {
            "name": user_info.name,
            "genderIdentity": user_info.genderIdentity,
            "sexAtBirth": user_info.sexAssignedAtBirth,
            "age": user_info.age,
            "nationality": user_info.nationality,
            "sexualOrientation": user_info.sexualOrientation,
        }
        return jsonify(result), 200
    else:
        return jsonify({"message": "No user information found"}), 404
    
@auth_bp.route('/mental_health_history', methods=['POST'])
@jwt_required()
def add_mental_health_history():
    current_user_id = get_jwt_identity()
    data = request.json
    try:
        new_history = UserMentalHealthHistory(
            psychiatricHistory=data['psychiatricHistory'],
            stressLevels=data['stressLevels'],
            copingMechanisms=data['copingMechanisms'],
            user_id=current_user_id
        )
        db.session.add(new_history)
        db.session.commit()
        return jsonify({"message": "Mental health history added successfully"}), 201
    except Exception as e:
        current_app.logger.error(f'Error adding mental health history: {e}')
        return jsonify({"error": "Failed to add mental health history"}), 500


@auth_bp.route('/medical_history', methods=['POST'])
@jwt_required()
def add_medical_history():
    current_user_id = get_jwt_identity()
    data = request.json
    try:
        new_medical_history = UserMedicalHistory(
            pastMedicalHistory=data['pastMedicalHistory'],
            familyMedicalHistory=data.get('familyMedicalHistory', ''),
            medicationHistory=data.get('medicationHistory', ''),
            user_id=current_user_id
        )
        db.session.add(new_medical_history)
        db.session.commit()
        return jsonify({"message": "Medical history added successfully"}), 201
    except Exception as e:
        current_app.logger.error(f'Error adding medical history: {e}')
        return jsonify({"error": "Failed to add medical history"}), 500
  

@auth_bp.route('/chat_message', methods=['POST'])
@jwt_required()
def post_chat_message():
    current_user_id = get_jwt_identity()
    data = request.json
    try:
        new_message = ChatMessage(
            message=data['message'],
            user_id=current_user_id
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"message": "Chat message posted successfully"}), 201
    except Exception as e:
        current_app.logger.error(f'Error posting chat message: {e}')
        return jsonify({"error": "Failed to post chat message"}), 500

@auth_bp.route('/text_classification', methods=['POST'])
@jwt_required()
def classify_text():
    current_user_id = get_jwt_identity()
    data = request.json
    user_input = data['text']
    inputs = preprocess_text(user_input)
    with torch.no_grad():
        outputs = depression_model(inputs)
        classification = classify_text(outputs)
    
    try:
        new_classification = TextClassification(
            user_input=user_input,
            classification=classification,
            confidence=0.85,
            user_id=current_user_id
        )
        db.session.add(new_classification)
        db.session.commit()
        return jsonify({"message": "Text classified successfully", "classification": classification}), 201
    except Exception as e:
        current_app.logger.error(f'Error classifying text: {e}')
        return jsonify({"error": "Failed to classify text"}), 500
    
@auth_bp.route('/answer_question', methods=['POST'])
@jwt_required()
def answer_question():
    data = request.json
    question = data['question']
    context = data.get('context', "")  # Use previous chat as context, if available

    # Combine context and question for a coherent answer
    prompt = context + "\n\n" + question
    inputs = tokenizerGPT2.encode(prompt, return_tensors='pt')
    outputs = gpt_model.generate(inputs, max_length=150, num_return_sequences=1)
    answer = tokenizerGPT2.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"answer": answer}), 200
