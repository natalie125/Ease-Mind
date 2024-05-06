
import os
import logging
import torch
import nltk
import traceback
from app import db
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.sentiment import SentimentIntensityAnalyzer
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import UserInformation, UserMentalHealthHistory, UserMedicalHistory, ChatMessage, TextClassification
from app.endpoints import auth_bp
from transformers import DistilBertTokenizer, DistilBertForQuestionAnswering
from sentence_transformers import SentenceTransformer, util
import numpy as np

# Initialization of NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
sia = SentimentIntensityAnalyzer()


# Load a pre-trained sentence transformer model (e.g., 'all-MiniLM-L6-v2' for speed and efficiency)
model_st = SentenceTransformer('all-MiniLM-L6-v2')

# Define a dictionary of predefined responses for common depression-related questions
predefined_responses = {
    "What is depression?": "Depression is a common mental health disorder characterized by persistent feelings of sadness, hopelessness, and loss of interest in activities.",
    "What are the symptoms of depression?": "Common symptoms of depression include persistent sadness, loss of interest in activities, changes in appetite or weight, sleep disturbances, fatigue, feelings of worthlessness or guilt, and difficulty concentrating.",
    "How is depression treated?": "Treatment for depression often includes a combination of medication, therapy, and lifestyle changes. Antidepressant medications and psychotherapy (talk therapy) are commonly used.",
    "What can I do when I feel overwhelmed?":"It's important to seek professional help if you are feeling overwhelmed.",
    "I feel sad, what can I do to feel better?":"Remember to take care of yourself and prioritize self-care activities.",
    "How can I deal with loneliness?":"Talking to a trusted friend or family member can help alleviate feelings of loneliness.",
    "What is something I can do to improve my mental well-being?":"Engaging in physical activity can have a positive impact on mental well-being.",
    "I don't know how to deal with my emotions, can you help me?": "Consider journaling as a way to express and process your emotions."
}

# Dictionary to store embeddings
response_embeddings = {key: model_st.encode(response, convert_to_tensor=True) for key, response in predefined_responses.items()}

app = Flask(__name__)
CORS(app)

# Define preprocessing function
def preprocess_text(text):
    # Simple preprocessing, can be improved further
    return text.strip().lower()

# Error handler
@app.errorhandler(Exception)
def handle_unexpected_error(error):
    traceback.print_exc()  # Print traceback for detailed error analysis
    current_app.logger.error(f'Unexpected error: {error}')
    response = {"error": "An unexpected error occurred"}
    return jsonify(response), 500

# Test endpoint
@auth_bp.route('/test_endpoint', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Test endpoint reached"}), 200

# Routes for user information management
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

# Route for adding mental health history
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

# Route for adding medical history
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

# Route for posting chat messages
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

# Route for submitting answers related to depression
@auth_bp.route('/submit_answers', methods=['POST'])
@jwt_required()
def submit_answers():
    current_user_id = get_jwt_identity()
    data = request.json
    try:
        concatenated_answers = " ".join(data['answers'])
        
        new_text_classification = TextClassification(
            user_input=concatenated_answers,
            user_id=current_user_id
        )
        db.session.add(new_text_classification)
        db.session.commit()
        return jsonify({"message": "Answers submitted successfully"}), 200
    
    except Exception as e:
        current_app.logger.error(f'Error during submission: {str(e)}')
        db.session.rollback()  # Rollback the session in case of error
        return jsonify({"error": "An internal server error occurred"}), 500

def get_user_context(user_id):
    # Fetch user-specific data from the database
    mental_history = UserMentalHealthHistory.query.filter_by(user_id=user_id).first()
    medical_history = UserMedicalHistory.query.filter_by(user_id=user_id).first()
    answers = TextClassification.query.filter_by(user_id=user_id).limit(5).all()
    
    context = []
    if mental_history:
        context.append(f"Psychiatric History includes {mental_history.psychiatricHistory}, Stress Levels are {mental_history.stressLevels}, Coping Mechanisms include {mental_history.copingMechanisms}.")
    if medical_history:
        context.append(f"Medical History includes Past Medical Conditions: {medical_history.pastMedicalHistory}, Family Medical History: {medical_history.familyMedicalHistory}, Medication History: {medical_history.medicationHistory}.")

    if answers:
        for i, answer in enumerate(answers):
            context.append(f"Question {i+1}: {answer.user_input}")
    
    return ' '.join(context)

# Route for answering questions related to depression
@auth_bp.route("/answer_question", methods=["POST"])
@jwt_required()
def answer_question():
    user_id = get_jwt_identity()
    data = request.get_json()
    question = data.get("question", "").strip()

    # Check if the question is one of the predefined ones and return the answer directly
    if question in predefined_responses:
        return jsonify({"answer": predefined_responses[question]}), 200

    # For non-predefined questions, use the user's context to generate an answer
    user_context = get_user_context(user_id)
    context_embedding = model_st.encode(user_context, convert_to_tensor=True).detach().numpy()
    question_embedding = model_st.encode(question, convert_to_tensor=True).detach().numpy()

    # Calculate the cosine similarity between the question and the user context
    similarity_scores = util.pytorch_cos_sim(torch.tensor(question_embedding), torch.tensor(context_embedding))

    # Convert similarity_scores to a NumPy array
    similarity_scores_numpy = similarity_scores.cpu().detach().numpy()

    # Extract the maximum value from the NumPy array
    similarity = similarity_scores_numpy.max()

    # Generate a response based on the similarity
    if similarity > 0.5:  # This threshold can be adjusted based on your needs
        response = f"Based on your profile and the context, here is some information: {user_context}"
    else:
        response = "Sorry, I do not have enough information to answer that question."

    return jsonify({"answer": response, "similarity_score": float(similarity)}), 200
