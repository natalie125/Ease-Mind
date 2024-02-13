from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import EPersonalDetails, EATestResult, EAQuestion
from app.endpoints import auth_bp
from datetime import datetime
from sqlalchemy import extract

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

if __name__ == '__main__':
    app.run(debug=True)
