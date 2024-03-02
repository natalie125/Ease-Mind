from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import EPersonalDetails, EATestResult, EAQuestion, SPINQuestion, SPINTestResult, DailyQuestion, DailyQAnswer 
from app.endpoints import auth_bp
from datetime import datetime
from sqlalchemy import extract
import spacy
from spacy.matcher import PhraseMatcher
import nltk
from nltk.corpus import wordnet as wn
from textblob import TextBlob
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

from app.models import SPINTestResult  # Ensure to import SPINTestResult model

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

def populate_questions():
    for q_text in daily_questions:
        question_exists = DailyQuestion.query.filter_by(question_text=q_text).first() is not None
        if not question_exists:
            new_question = DailyQuestion(question_text=q_text)
            db.session.add(new_question)
    
    db.session.commit()

@app.route('/dailyquestion/<int:question_id>', methods=['GET'])
def get_question(question_id):
    question = DailyQuestion.query.get(question_id)
    if question:
        return jsonify({'id': question.id, 'question_text': question.question_text}), 200
    else:
        return jsonify({'error': 'Question not found'}), 404

nltk.download('wordnet')

# Load spaCy model with word vectors
nlp = spacy.load("en_core_web_md")

# Define keywords for detection by category
keywords_by_category = {
    "hopelessness": ["hopeless", "pointless", "no future", "nothing matters", "give up"],
    "self_harm": ["self-harm", "cutting", "hurt myself", "end it all", "take my life"],
    "worthlessness": ["worthless", "unlovable", "failure", "not good enough", "hate myself"],
    "pain": ["can't take it anymore", "tired of living", "exhausted", "overwhelmed", "unbearable"],
    "isolation": ["all alone", "no one cares", "left behind", "no friends", "isolated"],
    "finality": ["final note", "last words", "won't see me", "goodbye", "my last"]
}

# Function to get synonyms from WordNet
def get_synonyms(word):
    synonyms = set()
    for syn in wn.synsets(word):
        for lemma in syn.lemmas():
            synonyms.add(lemma.name().replace('_', ' '))
    return list(synonyms)

# Expand each category of keywords with synonyms from WordNet
expanded_keywords_by_category = {category: set() for category in keywords_by_category}
for category, keywords in keywords_by_category.items():
    for keyword in keywords:
        expanded_keywords_by_category[category].update(get_synonyms(keyword))
        expanded_keywords_by_category[category].add(keyword)

# Function to analyze text for distress signals
def analyze_text_for_distress(text):
    doc = nlp(text)
    matched_categories = []

    for category, keywords in expanded_keywords_by_category.items():
        keyword_docs = [nlp(keyword) for keyword in keywords]  # Convert keywords to spaCy Docs
        matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        patterns = [nlp.make_doc(keyword) for keyword in keywords]
        matcher.add("DistressSignals", None, *patterns)
        matches = matcher(doc)
        if matches:
            matched_categories.append(category)
            continue

        for token in doc:
            for keyword_doc in keyword_docs:
                if token.similarity(keyword_doc) > 0.5:
                    matched_categories.append(category)
                    break

    return matched_categories

@app.route('/submit_dailyanswer', methods=['POST'])
def submit_answer():
    data = request.json
    question_id = data.get('question_id')
    answer_text = data.get('answer')
    
    answer = DailyQAnswer(question_id=question_id, answer=answer_text)
    db.session.add(answer)
    db.session.commit()
    
    categories = analyze_text_for_distress(answer_text)
    if categories:
        return jsonify({'message': 'Your response has been saved and will be reviewed.', 'categories': categories}), 200
    
    return jsonify({'message': 'Your response has been saved.'}), 200

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    responses = data['responses']
    results = []
    for response in responses:
        categories = analyze_text_for_distress(response)
        results.append({"response": response, "categories": categories})
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
