from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import EPersonalDetails, EATestResult, EAQuestion, SPINQuestion, SPINTestResult, PDQuestion, PDTestResult, DailyQuestion, DailyQAnswer, PTSDQuestion, PTSDResult
from app.endpoints import auth_bp
from datetime import datetime, timedelta
from sqlalchemy import extract
import traceback
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)
CORS(app)

@app.errorhandler(Exception)
def handle_unexpected_error(error):
    current_app.logger.error(f'Unexpected error: {error}')
    response = {"error": "An unexpected error occurred"}
    return jsonify(response), 500

@auth_bp.route('/submit_personal_details', methods=['POST'])
@jwt_required()
def submit_personal_details():
    current_user_id = get_jwt_identity()  # Get the user ID from the JWT token
    data = request.json

    dob_input = data.get('DOB')
    if not dob_input:
        return jsonify({"error": "DOB is required."}), 400
    
    try:
        dob = datetime.strptime(dob_input, '%Y-%m-%d').date()
        # Check if a record already exists for the current user
        personal_details = EPersonalDetails.query.filter_by(user_id=current_user_id).first()

        if personal_details:
            # If record exists, update it
            personal_details.firstName = data['firstName']
            personal_details.lastName = data['lastName']
            personal_details.DOB = dob
            personal_details.gender = data.get('gender', '')
            personal_details.houseNumber = data.get('houseNumber', '')
            personal_details.streetName = data['streetName']
            personal_details.postCode = data['postCode']
            personal_details.city = data['city']
            personal_details.country = data['country']
            personal_details.highestEducation = data.get('highestEducation', '')
        else:
            # If no record exists, create a new one
            personal_details = EPersonalDetails(
                user_id=current_user_id,
                firstName=data['firstName'],
                lastName=data['lastName'],
                DOB=dob,
                gender=data.get('gender', ''),
                houseNumber=data.get('houseNumber', ''),
                streetName=data['streetName'],
                postCode=data['postCode'],
                city=data['city'],
                country=data['country'],
                highestEducation=data.get('highestEducation', '')
            )
            db.session.add(personal_details)
        
        db.session.commit()
        return jsonify({"message": "Details saved successfully"}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f'Unexpected error saving personal details: {e}')
        return jsonify({"error": "Unable to save details"}), 500

@auth_bp.route('/get_epersonal_details', methods=['GET'])
@jwt_required()
def get_epersonal_details():
    current_user_id = get_jwt_identity()
    personal_details = EPersonalDetails.query.filter_by(user_id=current_user_id).first()
    
    if personal_details:
        details = {
            "firstName": personal_details.firstName,
            "lastName": personal_details.lastName,
            "DOB": personal_details.DOB.strftime('%Y-%m-%d'),
            "gender": personal_details.gender,
            "houseNumber": personal_details.houseNumber,
            "streetName": personal_details.streetName,
            "postCode": personal_details.postCode,
            "city": personal_details.city,
            "country": personal_details.country,
            "highestEducation": personal_details.highestEducation,
        }
        return jsonify(details), 200
    else:
        return jsonify({"message": "No details found for the user"}), 404
    
Testquestions = [
    "Feeling nervous, anxious or on edge?",
    "Not being able to stop or control worrying?",
    "Worrying too much about different things?",
    "Trouble relaxing?",
    "Being so restless that it is hard to sit still?",
    "Becoming easily annoyed or irritable?",
    "Feeling afraid as if something awful might happen?"
]

for q_text in Testquestions:
    # Check if the question already exists
    exists = EAQuestion.query.filter_by(text=q_text).first()
    
    if not exists:
        # Only add the question if it doesn't already exist
        Testquestion = EAQuestion(text=q_text)
        db.session.add(Testquestion)

# Commit once after adding all new questions to avoid multiple transactions
db.session.commit()

@auth_bp.route('/EAquestions', methods=['GET'])
@jwt_required()
def get_questions():
    questions = EAQuestion.query.all()
    questions_data = [{'id': question.id, 'text': question.text} for question in questions]
    return jsonify(questions_data), 200

@auth_bp.route('/submit_etest_result', methods=['POST'])
@jwt_required()
def submit_test_result():
    current_user_id = get_jwt_identity()
    data = request.json

    score = data.get('score')

    if score is None:
        return jsonify({"error": "Score is required."}), 400

    test_result = EATestResult(user_id=current_user_id, score=score)
    db.session.add(test_result)
    db.session.commit()

    return jsonify({"message": "Test score saved successfully"}), 201

@auth_bp.route('/get_test_results', methods=['GET'])
@jwt_required()
def get_test_results():
    current_user_id = get_jwt_identity()
    granularity = request.args.get('granularity', 'monthly')  # Default to monthly if not specified

    # Base query
    base_query = EATestResult.query.filter_by(user_id=current_user_id)

    # Modify the query based on the granularity
    if granularity == 'yearly':
        results = base_query \
            .with_entities(
                extract('year', EATestResult.created_at).label('year'),
                db.func.avg(EATestResult.score).label('average_score')
            ) \
            .group_by('year') \
            .all()
        formatted_results = [{'date': str(year), 'score': average_score} for year, average_score in results]

    elif granularity == 'monthly':
        results = base_query \
            .with_entities(
                extract('year', EATestResult.created_at).label('year'),
                extract('month', EATestResult.created_at).label('month'),
                db.func.avg(EATestResult.score).label('average_score')
            ) \
            .group_by('year', 'month') \
            .all()
        formatted_results = [{'date': f"{int(year)}-{int(month):02d}", 'score': average_score} for year, month, average_score in results]

    elif granularity == 'daily':
        results = base_query.all()
        formatted_results = [{'date': result.created_at.strftime('%Y-%m-%d'), 'score': result.score} for result in results]

    if formatted_results:
        return jsonify(formatted_results), 200
    else:
        return jsonify({"message": "No test results found for the user"}), 404

SPIN_questions = [
    "I am afraid of people in authority.",
    "I am bothered by blushing in front of people.",
    "Parties and social events scare me.",
    "I avoid talking to people I don’t know.",
    "Being criticized scares me a lot.",
    "I avoid doing things or speaking to people for fear of embarrassment.",
    "Sweating in front of people causes me distress.",
    "I avoid going to parties.",
    "I avoid activities in which I am the center of attention.",
    "Talking to strangers scares me.",
    "I avoid having to give speeches.",
    "I would do anything to avoid being criticized.",
    "Heart palpitations bother me when I am around people.",
    "I am afraid of doing things when people might be watching.",
    "Being embarrassed or looking stupid are among my worst fears.",
    "I avoid speaking to anyone in authority.",
    "Trembling or shaking in front of others is distressing to me."
]

# Populate SPIN questions in the database if they don't already exist
for q_text in SPIN_questions:
    # Check if the question already exists
    exists = SPINQuestion.query.filter_by(text=q_text).first()
    
    if not exists:
        # Only add the question if it doesn't already exist
        question = SPINQuestion(text=q_text)
        db.session.add(question)

db.session.commit()

@auth_bp.route('/SPINquestions', methods=['GET'])
@jwt_required()
def get_SPIN_questions():
    questions = SPINQuestion.query.all()
    questions_data = [{'id': question.id, 'text': question.text} for question in questions]
    return jsonify(questions_data), 200

@auth_bp.route('/submit_SPIN_result', methods=['POST'])
@jwt_required()
def submit_SPIN_test_result():
    current_user_id = get_jwt_identity()
    data = request.json

    score = data.get('score')
    if score is None:
        return jsonify({"error": "Score is required."}), 400

    try:
        # Create a new SPIN test result instance
        test_result = SPINTestResult(user_id=current_user_id, score=score)
        # Add the new test result to the database session
        db.session.add(test_result)
        # Commit the session to save the test result
        db.session.commit()

        # Return a success message with the score
        return jsonify({"message": "SPIN test score saved successfully", "score": score}), 201
    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.error(f'Unexpected error saving SPIN test result: {e}')
        return jsonify({"error": "Unable to save SPIN test result"}), 500

PD_Question = [
    "How many panic and limited symptoms attacks did you have during the week?",
    "If you had any panic attacks during the past week, how distressing (uncomfortable, frightening) were they while they were happening? (if you had more than one, give an average rating. If you didn’t have any panic attacks but did have limited symptom attacks, answer for the limited symptom attacks)",
    "During the past week, how much have you worried or felt anxious about when your next panic attack would occur or about fears related to the attacks (for example, that they could mean you have physical or mental health problems or could cause you social embarrassment)?",
    "During the past week were there any places or situations (e.g., public transportation, movie theatres, crowds, bridges, tunnels, shopping centres, being alone) you avoided, or felt afraid of (uncomfortable in, wanted to avoid or leave), because of fear of having a panic attack? Are there any other situations that you would have avoided or been afraid of if they had come up during the week, for the same reason? If yes to either question, please rate your level of fear and avoidance this past week.",
    "During the past week, were there any activities (e.g. physical exertion, sexual relations, taking a hot shower or bath, drinking coffee, watching an exciting or scary movie) that you avoided, or felt afraid of (uncomfortable doing, wanted to avoid or stop), because they caused physical sensations like those you feel during panic attacks or that you were afraid might trigger a panic attack? Are there any other activities that you would have avoided or been afraid of if they had come up during the week for that reason? If yes to either question, please rate your level of fear and avoidance of those activities this past week.",
    "During the past week, how much did the above symptoms altogether (panic and limited symptom attacks, worry about attacks, and fear of situations and activities because of attacks) interfere with your ability to work or carry out your responsibilities at home? (If your work or home responsibilities were less than usual this past week, answer how you think you would have done if the responsibilities had been usual)",
    "During the past week, how much did panic and limited symptom attacks, worry about attacks, and fear of situations and activities because of attacks interfere with your social life? (if you didn’t have many opportunities to socialize this past week, answer how you think you would have done if you did have opportunities.)"
]

for q_text in PD_Question :
    # Check if the question already exists
    exists = PDQuestion.query.filter_by(text=q_text).first()
    
    if not exists:
        # Only add the question if it doesn't already exist
        question = PDQuestion (text=q_text)
        db.session.add(question)

db.session.commit()

@auth_bp.route('/PDquestions', methods=['GET'])
@jwt_required()
def get_PD_questions():
    questions = PDQuestion.query.all()
    questions_data = [{'id': question.id, 'text': question.text} for question in questions]
    return jsonify(questions_data), 200

@auth_bp.route('/submit_PD_result', methods=['POST'])
@jwt_required()
def submit_PD_test_result():
    current_user_id = get_jwt_identity()
    data = request.json

    score = data.get('score')
    if score is None:
        return jsonify({"error": "Score is required."}), 400

    try:
        # Create a new PD test result instance
        test_result = PDTestResult(user_id=current_user_id, score=score)
        # Add the new test result to the database session
        db.session.add(test_result)
        # Commit the session to save the test result
        db.session.commit()

        # Explicitly return a status code
        return jsonify({"message": "PD test score saved successfully", "score": score}), 200
    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.error(f'Unexpected error saving PD test result: {e}')
        return jsonify({"error": "Unable to save PD test result"}), 500

daily_questions = [
    "How are you feeling today, really? Physically and mentally.",
    "What’s taking up most of your headspace right now?",
    "What was your last full meal, and have you been drinking enough water?",
    "How have you been sleeping?",
    "What have you been doing for exercise?",
    "What did you do today that made you feel good?",
    "What’s something you can do today that would be good for you?",
    "What’s something you’re looking forward to in the next few days?",
    "What’s something we can do together this week, even if we’re apart?",
    "What are you grateful for right now?"
]

for q_text in daily_questions :
    # Check if the question already exists
    exists = DailyQuestion.query.filter_by(question_text=q_text).first()
    
    if not exists:
        # Only add the question if it doesn't already exist
        question = DailyQuestion (question_text=q_text)
        db.session.add(question)

db.session.commit()

@auth_bp.route('/dailyquestion/<int:question_id>', methods=['GET'])
def get_question(question_id):
    question = DailyQuestion.query.get(question_id)
    if question:
        return jsonify({'id': question.id, 'question_text': question.question_text}), 200
    else:
        return jsonify({'error': 'Question not found'}), 404

# from model_predict.py
@auth_bp.route('/submit_dailyanswers', methods=['POST'])
def submit_answers():
    ease_mind_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'EaseMind'))
    tokenizer_path = os.path.join(ease_mind_directory, 'tokenizer.pickle')
    model_path = os.path.join(ease_mind_directory, 'my_model.h5')

    with open(tokenizer_path, 'rb') as handle:
        tokenizer = pickle.load(handle)

    model = load_model(model_path)

    data = request.json
    answers = data.get('answers')
    
    if not answers:
        return jsonify({'error': 'No answers provided'}), 400

    crisis_detected = False  # Initialize crisis detection flag

    for answer_data in answers:
        question_id = answer_data.get('question_id')
        answer_text = answer_data.get('answer')

        sequence = tokenizer.texts_to_sequences([answer_text])
        padded_sequence = pad_sequences(sequence, maxlen=100)
        prediction = model.predict(padded_sequence)

        word_detection = 'Yes' if prediction[0][0] > 0.5 else 'No'
        
        if word_detection == 'Yes':
            crisis_detected = True

        answer = DailyQAnswer(question_id=question_id, answer=answer_text, word_detection=word_detection)
        db.session.add(answer)

    db.session.commit()

    crisis_status = "Yes" if crisis_detected else "No"
    return jsonify({'message': 'Answers submitted successfully', 'crisis_status': crisis_status}), 200

ptsd_questions = [
    "Any reminder brought back feelings about it",
    "I had trouble staying asleep",
    "Other things kept making me think about it",
    "I felt irritable and angry",
    "I avoided letting myself get upset when I thought about it or was reminded of it",
    "I thought about it when I didn't mean to",
    "I felt as if it hadn't happened or wasn't real",
    "I stayed away from reminders about it",
    "Pictures about it popped into my mind",
    "I was jumpy and easily startled",
    "I tried not to think about it",
    "I was aware that I still had a lot of feelings about it but I didn't deal with them",
    "My feelings about it were kind of numb",
    "I found myself acting or feeling as though I was back at that time",
    "I had trouble falling asleep",
    "I had waves of strong feelings about it",
    "I tried to remove it from my memory",
    "I had trouble concentrating",
    "Reminders of it caused me to have physical reactions such as sweating, trouble breathing, nausea or a pounding heart",
    "I had dreams about it",
    "I felt watchful or on-guard",
    "I tried not to talk about it",
]
for q_text in ptsd_questions :
    # Check if the question already exists
    exists = PTSDQuestion.query.filter_by(text=q_text).first()
    
    if not exists:
        # Only add the question if it doesn't already exist
        question = PTSDQuestion (text=q_text)
        db.session.add(question)

db.session.commit()

@auth_bp.route('/PTSDquestions', methods=['GET'])
@jwt_required()
def get_PTSD_questions():
    questions = PTSDQuestion.query.all()
    questions_data = [{'id': question.id, 'text': question.text} for question in questions]
    return jsonify(questions_data), 200

@auth_bp.route('/submit_PTSD_result', methods=['POST'])
@jwt_required()
def submit_PTSD_test_result():
    current_user_id = get_jwt_identity()
    data = request.json

    score = data.get('score')
    if score is None:
        return jsonify({"error": "Score is required."}), 400

    try:
        # Create a new PD test result instance
        test_result = PTSDResult(user_id=current_user_id, score=score)
        # Add the new test result to the database session
        db.session.add(test_result)
        # Commit the session to save the test result
        db.session.commit()

        # Explicitly return a status code
        return jsonify({"message": "PD test score saved successfully", "score": score}), 200
    except Exception as e:
        # Log the exception and return an error message
        current_app.logger.error(f'Unexpected error saving PTSD test result: {e}')
        return jsonify({"error": "Unable to save PD test result"}), 500

@auth_bp.route('/get_word_detection', methods=['GET'])
def get_word_detection_answers():
    # Calculate the date 14 days ago from now
    two_weeks_ago = datetime.utcnow() - timedelta(days=14)

    # Query the database for any 'yes' answers in the word_detection field within the last 2 weeks
    answers = DailyQAnswer.query.filter(
        DailyQAnswer.created_at >= two_weeks_ago,
        DailyQAnswer.word_detection.ilike('Yes')  # Case-insensitive comparison
    ).all()

    # Check if there are any such answers
    print(f"Answers found: {len(answers)}")
    risk_detected = len(answers) > 0

    return jsonify({'risk_detected': risk_detected})

# Ai chatbot
import openai
from dotenv import load_dotenv
import os
# Load environment variables
load_dotenv()

# Set your OpenAI API key here
openai.api_key = os.getenv("OPENAI_API_KEY")

@auth_bp.route('/aichat', methods=['POST'])
def chat_with_openai():
    # Ensure request has JSON content
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    # Extract the user message from the request
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "Missing 'message' in JSON payload"}), 400

    # Preparing the conversation history if available
    conversation_history = request.json.get('history', [])
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
    ] + conversation_history + [
        {"role": "user", "content": user_message},
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        # Append the latest response to the conversation history
        conversation_history.append({"role": "user", "content": user_message})
        conversation_history.append({"role": "assistant", "content": response.choices[0].message})

        # Return both the response and the updated conversation history
        return jsonify({
            "response": response.choices[0].message,
            "history": conversation_history
        })
    except Exception as e:
        app.logger.error('Unhandled Exception: %s', traceback.format_exc())
        return jsonify({"error": str(e)}), 500

    
if __name__ == '__main__':
    app.run(debug=True)