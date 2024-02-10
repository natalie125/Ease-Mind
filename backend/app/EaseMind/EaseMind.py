from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import EPersonalDetails  # Ensure this import points to your actual model location
from app.endpoints import auth_bp
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.errorhandler(Exception)
def handle_unexpected_error(error):
    current_app.logger.error(f'Unexpected error: {error}')
    response = {"error": "An unexpected error occurred"}
    return jsonify(response), 500

@auth_bp.route('/submit_personal_details', methods=['POST'])
@jwt_required()  # Require the user to be authenticated
def submit_personal_details():
    current_user_id = get_jwt_identity()  # Get the user ID from the JWT token
    data = request.json

    dob_input = data.get('DOB')
    if not dob_input:
        return jsonify({"error": "DOB is required."}), 400

    try:
        dob = datetime.strptime(dob_input, '%Y-%m-%d').date()
        personal_details = EPersonalDetails(
            user_id=current_user_id,  # Set the user_id to the current user's ID
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

if __name__ == '__main__':
    app.run(debug=True)
