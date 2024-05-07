import logging
import traceback
from app import db
from nltk.sentiment import SentimentIntensityAnalyzer
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import UserInformation, UserMentalHealthHistory, UserMedicalHistory, TextClassification
from app.endpoints import auth_bp
from sentence_transformers import SentenceTransformer

sia = SentimentIntensityAnalyzer()  # Initialize SentimentIntensityAnalyzer

# Load a pre-trained sentence transformer model
# 'all-MiniLM-L6-v2' is used for speed and efficiency
model_st = SentenceTransformer('all-MiniLM-L6-v2')

# Define a dictionary of predefined responses for common depression-related questions
predefined_responses = {
    "What is depression?": "Depression is a common mental health disorder characterized by persistent feelings of sadness, hopelessness, and loss of interest in activities.",
    "What are the symptoms of depression?": "Common symptoms of depression include persistent sadness, loss of interest in activities, changes in appetite or weight, sleep disturbances, fatigue, feelings of worthlessness or guilt, and difficulty concentrating.",
    "How is depression treated?": "Treatment for depression often includes a combination of medication, therapy, and lifestyle changes. Antidepressant medications and psychotherapy (talk therapy) are commonly used.",
    "What can I do when I feel overwhelmed?": "It's important to seek professional help if you are feeling overwhelmed.",
    "I feel sad, what can I do to feel better?": "Remember to take care of yourself and prioritize self-care activities.",
    "How can I deal with loneliness?": "Talking to a trusted friend or family member can help alleviate feelings of loneliness.",
    "What is something I can do to improve my mental well-being?": "Engaging in physical activity can have a positive impact on mental well-being.",
    "I don't know how to deal with my emotions, can you help me?": "Consider journaling as a way to express and process your emotions and most importantly seek professional help."
}

# Dictionary to store embeddings of predefined responses
response_embeddings = {key: model_st.encode(response, convert_to_tensor=True) for key, response in predefined_responses.items()}

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define preprocessing function for text
def preprocess_text(text):
    # Simple preprocessing, can be improved further
    return text.strip().lower()

# Error handler for unexpected errors
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


@auth_bp.route("/classify_depression", methods=["GET"])
@jwt_required()
def classify_depression(answers):
    # Initialize cumulative scores
    negative_score = 0
    for answer in answers:
        scores = sia.polarity_scores(answer)
        negative_score += scores['neg']
    
    # Example threshold to detect depression
    depression_threshold = 0.5
    if negative_score / len(answers) > depression_threshold:
        return "Depression likely"
    else:
        return "Depression unlikely"


@auth_bp.route("/get_context", methods=["GET"])
@jwt_required()
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

# Route for submitting answers related to depression (with classification)
@auth_bp.route('/submit_answers', methods=['POST'])
@jwt_required()
def submit_and_classify_answers():
    current_user_id = get_jwt_identity()
    data = request.json
    try:
        concatenated_answers = " ".join(data['answers'])
        
        # Classify depression based on answers
        depression_classification = classify_depression(data['answers'])
        
        new_text_classification = TextClassification(
            user_input=concatenated_answers,
            user_id=current_user_id,
            classification=depression_classification
        )
        db.session.add(new_text_classification)
        db.session.commit()
        
        return jsonify({
            "message": "Answers submitted and classified successfully",
            "classification": depression_classification
        }), 200

    except Exception as e:
        current_app.logger.error(f'Error during submission and classification: {str(e)}')
        db.session.rollback()
        return jsonify({"error": "An internal server error occurred"}), 500

# Route for answering questions related to depression (with classification awareness)
@auth_bp.route("/answer_question", methods=["POST"])
@jwt_required()
def answer_question_with_classification():
    user_id = get_jwt_identity()
    data = request.get_json()
    question = data.get("question", "").strip()

    # Check if the question is predefined
    if question in predefined_responses:
        return jsonify({"answer": predefined_responses[question]}), 200

    # Retrieve user context and classification
    user_context = get_user_context(user_id)
    recent_classification = TextClassification.query.filter_by(user_id=user_id).order_by(TextClassification.id.desc()).first()
    
    # Create a response based on classification and context
    if recent_classification:
        response = f"Your recent classification is {recent_classification.classification}. {user_context}"
    else:
        response = "No previous classification available. " + user_context

    return jsonify({"answer": response}), 200
