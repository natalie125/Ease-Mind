
import logging
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import UserInformation, UserMentalHealthHistory, UserMedicalHistory, ChatMessage, TextClassification
from app.endpoints import auth_bp
from datetime import datetime
from sqlalchemy import extract
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, AutoModelForSequenceClassification, AutoTokenizer
import gdown
import os
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.sentiment import SentimentIntensityAnalyzer
import zipfile

# Initialization of NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
sia = SentimentIntensityAnalyzer()

# Load GPT-2 model
tokenizerGPT2 = GPT2Tokenizer.from_pretrained('gpt2')
gpt_model = GPT2LMHeadModel.from_pretrained('gpt2')
gpt_model.eval()

app = Flask(__name__)
CORS(app)

google_drive_model_id = '10BdhMe8kXoxw5tPWLdv8yIYwTnYGuNZz'
model_filename = 'my_depression_model.zip'
model_directory = '/tmp/my_depression_model'

my_depression_model = None
tokenizerModel = None


def download_and_load_model():
    global my_depression_model
    global tokenizerModel

    zip_path = os.path.join('/tmp', model_filename)

    # Ensure the directory exists
    if not os.path.exists(model_directory):
        os.makedirs(model_directory)

    # Download and extract model if it doesn't exist
    if not os.listdir(model_directory):
        gdown.download(f'https://drive.google.com/uc?id={google_drive_model_id}', zip_path, quiet=False)
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(model_directory)
        os.remove(zip_path)

    my_depression_model = AutoModelForSequenceClassification.from_pretrained(model_directory)
    tokenizerModel = AutoTokenizer.from_pretrained(model_directory)
    my_depression_model.eval()


def preprocess_text(text):
    # Simple preprocessing, can be improved further
    return text.strip().lower()


def classify_text(text):
    processed_text = preprocess_text(text)
    inputs = tokenizerModel(processed_text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    outputs = my_depression_model(**inputs)
    probs = torch.softmax(outputs.logits, dim=-1)
    predicted_class_id = probs.argmax(dim=-1).item()
    confidence_score = probs.max().item()

    label_map = {0: "Non-Depression", 1: "Depression"}
    classification = label_map.get(predicted_class_id, "Unknown")
    return classification, confidence_score


def convert_prediction_to_classification(predicted_class_id):
    label_map = {0: "Non-Depression", 1: "Depression"}
    return label_map.get(predicted_class_id, "Unknown")


@app.errorhandler(Exception)
def handle_unexpected_error(error):
    current_app.logger.error(f'Unexpected error: {error}')
    response = {"error": "An unexpected error occurred"}
    return jsonify(response), 500


@auth_bp.route('/test_endpoint', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Test endpoint reached"}), 200

@auth_bp.route('/get_user_info', methods=['GET'])
@jwt_required()
def get_user_info():
    logging.info('GET request received for /get_user_info')
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


@auth_bp.route("/text_classification", methods=["POST"])
@jwt_required()
def classify_text_endpoint():
    current_user_id = get_jwt_identity()
    data = request.json
    user_input = data.get("text", "").strip()

    if not user_input:
        return jsonify({"error": "Text input is empty or invalid"}), 400

    classification, confidence_score = classify_text(user_input)

    try:
        new_classification = TextClassification(
            user_input=user_input,
            classification=classification,
            confidence=confidence_score,
            user_id=current_user_id,
        )
        db.session.add(new_classification)
        db.session.commit()
        return jsonify({"message": "Text classified successfully", "classification": classification}), 201
    except Exception as e:
        current_app.logger.error(f"Error classifying text: {e}")
        return jsonify({"error": "Failed to classify text"}), 500


@auth_bp.route("/answer_question", methods=["POST"])
@jwt_required()
def answer_question():
    data = request.json
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Question input is empty or invalid"}), 400

    context = data.get("context", "")

    # Adjust GPT-2 generation settings to minimize repetition
    prompt = f"{context}\n\n{question}".strip()
    inputs = tokenizerGPT2.encode(prompt, return_tensors="pt")
    outputs = gpt_model.generate(inputs, max_length=100, num_return_sequences=1, repetition_penalty=1.2)
    answer = tokenizerGPT2.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"answer": answer}), 200
