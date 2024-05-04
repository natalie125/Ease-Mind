from flask import Flask, request, jsonify, current_app, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from app import models, db
from app.endpoints import auth_bp
from app.models import Autismpersonaldetails, AutismDetectorFeedback, AutismGameFeedback
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
nltk.download('punkt')  # Download the Punkt tokenizer models
nltk.download('vader_lexicon')
nltk.download('stopwords')
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize
from tensorflow.keras.preprocessing.sequence import pad_sequences
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from datetime import datetime
from flask import Flask, request, jsonify
from transformers import pipeline
from werkzeug.utils import secure_filename
import os
import cv2
import numpy as np
import pandas as pd
import json
import tempfile

app = Flask(__name__)
CORS(app)

####### Feedback ####### 

@auth_bp.route('/api/feedback', methods=['GET'])
@jwt_required()
def get_feedback():
    current_user_id = get_jwt_identity()  # Retrieve the current user's ID from the JWT token
    
    try:
        # Fetch feedback records for the current user
        user_feedback = AutismDetectorFeedback.query.filter_by(user_id=current_user_id).all()
        personal_details = Autismpersonaldetails.query.filter_by(user_id=current_user_id).first()

        # Format the feedback records for JSON response
        feedback_list = [{
            "id": feedback.id,
            "aq10": feedback.aq10,
            "aq": feedback.aq,
            "catqtotalScore": feedback.catqtotalScore,
            "compensationScore": feedback.compensationScore,
            "maskingScore": feedback.maskingScore,
            "assimilationScore": feedback.assimilationScore,
            "raadsrScore": feedback.raadsrScore,
            "language": feedback.language,
            "socialRelatedness": feedback.socialRelatedness,
            "sensoryMotor": feedback.sensoryMotor,
            "circumscribedInterests": feedback.circumscribedInterests,
            "firstName": personal_details.firstName,
            "lastName": personal_details.lastName,
            "DOB": personal_details.DOB.strftime('%Y-%m-%d'),
            "gender": personal_details.gender,
            "postCode": personal_details.postCode,
            "city": personal_details.city,
            "countryOfResidence": personal_details.countryOfResidence,
            "highestEducation": personal_details.highestEducation,
            "ethnicity": personal_details.ethnicity,
            "nationality": personal_details.nationality,
            "sexuality": personal_details.sexuality,
            "additionalConditions": personal_details.additionalConditions,
            "sensorySensitivity": personal_details.sensorySensitivity
        } for feedback in user_feedback]
        
        return jsonify({"feedback": feedback_list}), 200
    
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Failed to fetch feedback: {e}")
        return jsonify({"error": "Failed to fetch feedback"}), 500

####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### 

####### Notes Function #######

# Load the Keras model and tokenizer
model = joblib.load('app/AutismDetector/autism_classifier.joblib')
tokenizer = joblib.load('app/AutismDetector/tfidf_vectorizer.joblib')
@auth_bp.route('/api/notes', methods=['GET', 'POST'])
@jwt_required()
def handle_notes():
    current_user_id = get_jwt_identity()
    if request.method == 'GET':
        user_notes = models.AutismNote.query.filter_by(user_id=current_user_id).all()
        notes_list = [{"id": note.id, "note": note.note, "timestamp": note.timestamp.isoformat(), "prediction": note.prediction} for note in user_notes]
        return jsonify({"notes": notes_list}), 200
    elif request.method == 'POST':
        note_data = request.get_json()
        note_text = note_data.get('note')
        if not note_text:
            return jsonify({"msg": "Note content is required"}), 400
        
        sentences = sent_tokenize(note_text)
        autistic_characteristics_count = 0
        for sentence in sentences:
            # Ensure PyTorch tensors are being used if the model is a PyTorch model
            inputs = tokenizer.encode_plus(sentence, add_special_tokens=True, return_tensors='pt')
            sentence_prediction = model(**inputs)[0]
            if sentence_prediction[0, 1] > 0.5:
                autistic_characteristics_count += 1
        
        note_label = 1 if autistic_characteristics_count >= 15 else 0
        
        new_note = models.AutismNote(
            user_id=current_user_id,
            note=note_text,
            prediction=note_label
        )
        db.session.add(new_note)
        db.session.commit()
        return jsonify({"id": new_note.id, "prediction": note_label}), 200

####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### 

####### Questionnaire results ####### 

@auth_bp.route('/save_result', methods=['POST'])
@jwt_required()
def save_result():
    current_user_id = get_jwt_identity()  # Get the user ID from the JWT token
    data = request.json
    try:
        feedback_record = AutismDetectorFeedback.query.filter_by(user_id=current_user_id).first()

        if feedback_record:
            # Update existing record with new values
            feedback_record.aq10 = data.get('aq10', feedback_record.aq10)
            feedback_record.aq = data.get('aq', feedback_record.aq)
            feedback_record.catqtotalScore = data.get('catqtotalScore', feedback_record.catqtotalScore)
            feedback_record.compensationScore = data.get('compensationScore', feedback_record.compensationScore)
            feedback_record.maskingScore = data.get('maskingScore', feedback_record.maskingScore)
            feedback_record.assimilationScore = data.get('assimilationScore', feedback_record.assimilationScore)
            feedback_record.raadsrScore = data.get('raadsrScore', feedback_record.raadsrScore)
            feedback_record.language = data.get('language', feedback_record.language)
            feedback_record.socialRelatedness = data.get('socialRelatedness', feedback_record.socialRelatedness)
            feedback_record.sensoryMotor = data.get('sensoryMotor', feedback_record.sensoryMotor)
            feedback_record.circumscribedInterests = data.get('circumscribedInterests', feedback_record.circumscribedInterests)
        else:
            # Create a new record with provided values
            new_record = AutismDetectorFeedback(
                user_id=current_user_id,
                aq10=data.get('aq10'),
                aq=data.get('aq'),
                catqtotalScore=data.get('catqtotalScore'),
                compensationScore=data.get('compensationScore'),
                maskingScore=data.get('maskingScore'),
                assimilationScore=data.get('assimilationScore'),
                raadsrScore = data.get('raadsrScore'),
                language = data.get('language'),
                socialRelatedness = data.get('socialRelatedness'),
                sensoryMotor = data.get('sensoryMotor'),
                circumscribedInterests = data.get('circumscribedInterests'),
            )
            db.session.add(new_record)

        db.session.commit()
        return jsonify({"message": "Details saved successfully"}), 201
    except Exception as e:
        current_app.logger.error(f'Unexpected error saving personal details: {e}')
        return jsonify({"error": "Unable to save details"}), 500

####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### 

####### Personal Details ####### 

@auth_bp.route('/autism_submit_personal_details', methods=['POST'])
@jwt_required()
def autism_submit_personal_details():
    current_user_id = get_jwt_identity()  # Get the user ID from the JWT token
    data = request.json
    print("etst")
    dob_input = data.get('DOB')
    if not dob_input:
        return jsonify({"error": "DOB is required."}), 400
    
    try:
        dob = datetime.strptime(dob_input, '%Y-%m-%d').date()
        personal_details = Autismpersonaldetails.query.filter_by(user_id=current_user_id).first()

        if personal_details:
            # Update existing record
            personal_details.firstName = data['firstName']
            personal_details.lastName = data['lastName']
            personal_details.DOB = dob
            personal_details.gender = data.get('gender', '')
            personal_details.postCode = data['postCode']
            personal_details.city = data['city']
            personal_details.countryOfResidence = data['countryOfResidence']
            personal_details.highestEducation = data.get('highestEducation', '')
            personal_details.ethnicity = data.get('ethnicity', '')
            personal_details.nationality = data.get('nationality', '')
            personal_details.sexuality = data.get('sexuality', '')
            personal_details.additionalConditions = json.dumps(data.get('additionalConditions', []))
            personal_details.sensorySensitivity = json.dumps(data.get('sensorySensitivity', []))
        else:
            # Create a new record
            personal_details = Autismpersonaldetails(
                user_id=current_user_id,
                firstName=data['firstName'],
                lastName=data['lastName'],
                DOB=dob,
                gender=data.get('gender', ''),
                postCode=data['postCode'],
                city=data['city'],
                countryOfResidence=data['countryOfResidence'],
                highestEducation=data.get('highestEducation', ''),
                ethnicity=data.get('ethnicity', ''),
                nationality=data.get('nationality', ''),
                sexuality=data.get('sexuality', ''),
                additionalConditions=json.dumps(data.get('additionalConditions', [])),
                sensorySensitivity=json.dumps(data.get('sensorySensitivity', []))
            )
            db.session.add(personal_details)
        
        db.session.commit()
        return jsonify({"message": "Details saved successfully"}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f'Unexpected error saving personal details: {e}')
        return jsonify({"error": "Unable to save details"}), 500

@auth_bp.route('/autism_get_personal_details', methods=['GET'])
@jwt_required()
def autism_get_personal_details():
    current_user_id = get_jwt_identity()
    personal_details = Autismpersonaldetails.query.filter_by(user_id=current_user_id).first()
    
    if personal_details:
        details = {
            "firstName": personal_details.firstName,
            "lastName": personal_details.lastName,
            "DOB": personal_details.DOB.strftime('%Y-%m-%d'),
            "gender": personal_details.gender,
            "postCode": personal_details.postCode,
            "city": personal_details.city,
            "countryOfResidence": personal_details.countryOfResidence,
            "highestEducation": personal_details.highestEducation,
            "ethnicity": personal_details.ethnicity,
            "nationality": personal_details.nationality,
            "sexuality": personal_details.sexuality,
            "additionalConditions": json.loads(personal_details.additionalConditions),
            "sensorySensitivity": json.loads(personal_details.sensorySensitivity)
        }
        return jsonify(details), 200
    else:
        return jsonify({"message": "No details found for the user"}), 404

####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### 

##### Sentiment #####
##### NLP Game Function ######

# Load a pre-trained model and tokenizer for sentiment analysis
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Create a sentiment analysis pipeline using the loaded model and tokenizer
# Initialize NLP model for sentiment analysis and intent recognition
nlp_sentiment = pipeline("sentiment-analysis")
nlp_intent = pipeline("text-classification", model=model, tokenizer=tokenizer)

@auth_bp.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    user_input = data.get('text', '').strip()

    # Check for empty input
    if not user_input:
        return jsonify({"feedback": "No response was provided.", "sentiment": "NONE", "score": 0.0})

    try:
        # Process the input with the NLP model
        results = nlp_sentiment(user_input)
        
        # Assuming the first result is the most relevant
        sentiment = results[0]['label']
        score = results[0]['score']

        # Generate detailed, contextual feedback
        if sentiment == 'POSITIVE':
            if score > 0.85:
                feedback_detail = "This is an exceptionally positive response, indicating strong enthusiasm or approval. Keep harnessing this positivity, perhaps by sharing your thoughts or insights with others who might benefit."
            else:
                feedback_detail = "This is a positive response, indicating satisfaction or a positive outlook. Consider exploring this topic further or using this positivity to motivate yourself and others."
        elif sentiment == 'NEGATIVE':
            if score > 0.85:
                feedback_detail = "This is a strongly negative response, indicating deep concerns or dissatisfaction. It may be beneficial to address these feelings directly, seek support, or consider constructive ways to express or alleviate these concerns."
            else:
                feedback_detail = "This is a negative response, suggesting some reservations or dissatisfaction. Reflecting on the reasons behind these feelings can be a first step towards understanding and addressing them."
        else:
            feedback_detail = "Your response is neutral, indicating a balanced or undecided viewpoint. While neutrality can be valuable, especially in objective analysis, consider if there are underlying feelings or opinions you haven't fully expressed."

        feedback = f"Sentiment: {sentiment} (Confidence: {score:.2f}). {feedback_detail}"

    except Exception as e:
        # Handle any errors during analysis
        feedback = f"An error occurred during sentiment analysis: {str(e)}"
        return jsonify({"error": feedback}), 500

    return jsonify({"feedback": feedback, "sentiment": sentiment, "score": score})


@auth_bp.route('/submit_game_feedback', methods=['POST'])
@jwt_required()
def submit_game_feedback():
    user_id = get_jwt_identity()
    data = request.get_json()

    new_feedback = AutismGameFeedback(
        user_id=user_id,
        scenario_id=data['scenario_id'],
        score=data.get('score', 0),
        response=data['response'],
        feedback=data['feedback'],
        sentiment=data['sentiment']
    )
    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully"}), 201

@auth_bp.route('/get_game_feedback', methods=['GET'])
@jwt_required()
def get_game_feedback():
    user_id = get_jwt_identity()
    feedbacks = AutismGameFeedback.query.filter_by(user_id=user_id).all()

    results = [{
        "scenario_id": feedback.scenario_id,
        "response": feedback.response,
        "feedback": feedback.feedback,
        "sentiment": feedback.sentiment,
        "score": feedback.score
    } for feedback in feedbacks]

    return jsonify(results), 200

####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### ####### 

###### Camera Function #####

def find_pupil_in_frame(frame):
    """Simplified pupil detection for a single frame."""
    try:
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        _, thresholded = cv2.threshold(gray_frame, 30, 255, cv2.THRESH_BINARY_INV)
        
        contours, _ = cv2.findContours(thresholded, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=lambda c: cv2.contourArea(c), reverse=True)
        
        if contours:
            (x, y), radius = cv2.minEnclosingCircle(contours[0])
            diameter = radius * 2
            return diameter
    except Exception as e:
        print(f"An error occurred in pupil detection: {e}")
    return None

def extract_pupil_features_from_video(video_path):
    """Processes a video file to extract pupil diameter features."""
    try:
        cap = cv2.VideoCapture(video_path)
        diameters = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            diameter = find_pupil_in_frame(frame)
            if diameter:
                diameters.append(diameter)
        
        cap.release()
        
        if diameters:
            average_diameter = np.mean(diameters)
            std_diameter = np.std(diameters)
            diff_diameter = max(diameters) - min(diameters)
            return average_diameter, std_diameter, diff_diameter
    except Exception as e:
        print(f"An error occurred in feature extraction: {e}")
    return None, None, None

from joblib import load
import os
import re

def numerical_sort(value):
    """ Helper function to sort files numerically """
    parts = re.compile(r'(\d+)').split(value)
    parts[1::2] = map(int, parts[1::2])
    return parts

def merge_chunks(input_folder, output_file):
    """Merge chunks into a single file."""
    chunk_files = sorted(
        [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.startswith('eye-tracking-model') or f.startswith('eye-tracking-scaler')],
        key=numerical_sort
    )
    with open(output_file, 'wb') as outfile:
        for chunk_file in chunk_files:
            with open(chunk_file, 'rb') as cf:
                outfile.write(cf.read())
            print(f'Merged {chunk_file} into {output_file}')

@auth_bp.route('/api/eye-tracking-data', methods=['POST'])
def process_eye_tracking_data():
    video_file = request.files['video']
    if video_file:
        with tempfile.TemporaryDirectory() as temp_dir:
            filename = secure_filename(video_file.filename)
            save_path = os.path.join(temp_dir, filename)
            video_file.save(save_path)

            # Assuming the function extract_pupil_features_from_video is defined elsewhere
            mean_pupil_diameter, std_pupil_diameter, diff_pupil_diameter = extract_pupil_features_from_video(save_path)

            if mean_pupil_diameter is not None:
                # Merge chunks for the model and scaler
                model_output_path = os.path.join(temp_dir, 'complete_eye-tracking-model.joblib')
                scaler_output_path = os.path.join(temp_dir, 'complete_eye-tracking-scaler.joblib')
                
                merge_chunks('app/AutismDetector/chunks/', model_output_path)
                merge_chunks('app/AutismDetector/chunks-scaler/', scaler_output_path)

                # Load the merged model and scaler
                model = load(model_output_path)
                scaler = load(scaler_output_path)

                # Prepare and scale new data for prediction
                new_data = pd.DataFrame({
                    'MeanPupilDiameter': [mean_pupil_diameter],
                    'StdPupilDiameter': [std_pupil_diameter],
                    'DiffPupilDiameter': [diff_pupil_diameter]
                })
                new_data_scaled = scaler.transform(new_data)

                # Make a prediction
                prediction = model.predict(new_data_scaled)
                prediction_result = "ASD" if prediction[0] == 1 else "Non-ASD"

                return jsonify({"message": "Video data received and processed", "prediction": prediction_result}), 200
            else:
                return jsonify({"error": "Failed to process video for features"}), 500

    return jsonify({"error": "No video data received"}), 400