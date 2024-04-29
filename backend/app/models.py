from app import db
from sqlalchemy.orm import validates, relationship
from datetime import datetime, date

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(500), index=True, unique=True)
    password = db.Column(db.String(500))

    # Based on:
    # https://ed-a-nunes.medium.com/field-validation-for-backend-apis-with-python-flask-and-sqlalchemy-30e8cc0d260c
    @validates('email')
    def validate_email(self, key, email):
        # Check for empty email
        if not email:
            raise AssertionError('No email provided')
        # Check for already taken email
        if Users.query.filter(Users.email == email).first():
            raise AssertionError('Email is already in use')
        # Check for no '@' character
        if "@" not in email:
            raise AssertionError('Email address missing "@" symbol')
        # return email field and chain validate the password
        return email
    
    #relationship to EPersonalDetails. uselist=False to ensure one-to-one.
    epersonal_details = relationship('EPersonalDetails', back_populates='user', uselist=False)

    @validates('password')
    def validate_password(self, key, password):
        # Check for empty password
        if not password:
            raise AssertionError('No password provided')
        return password

class RootRadarMVPTest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500))

# ---------------------------------------------------------------------------- #
#Personal details for EaseMind
class EPersonalDetails(db.Model):
    __tablename__ = 'EPersonalDetails'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Reference to the Users table
    firstName = db.Column(db.String(500))
    lastName = db.Column(db.String(500))
    DOB = db.Column(db.Date)
    gender = db.Column(db.String(50))
    houseNumber = db.Column(db.String(100))
    streetName = db.Column(db.String(500))
    postCode = db.Column(db.String(100))
    city = db.Column(db.String(500))
    country = db.Column(db.String(500))
    highestEducation = db.Column(db.String(500))
    user = relationship('Users', back_populates='epersonal_details', uselist=False)  # Ensure one-to-one relationship

    @validates('DOB')
    def validate_DOB(self, key, DOB):
        if isinstance(DOB, date):
            birth_date = DOB
        else:
            birth_date = datetime.strptime(DOB, "%Y-%m-%d").date()
        
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if age < 18:
            raise AssertionError('You must be older than 18 to use this service.')
        
        return birth_date
    
#Anxiety test result for EaseMind
class EATestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = relationship('Users', backref='test_results')

#anxiety test questions for EaseMind
class EAQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500))

    def __repr__(self):
        return f'<EAQuestion {self.text}>'
    
# ---------------------------------------------------------------------------- #
# DepressiLess Models
class UserInformation(db.Model):
    __tablename__ = 'user_information'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    genderIdentity = db.Column(db.String(50), nullable=False)
    sexAssignedAtBirth = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    nationality = db.Column(db.String(120), nullable=False)
    sexualOrientation = db.Column(db.String(50), nullable=True)

    # Relationships
    mental_health_histories = db.relationship('UserMentalHealthHistory', backref='user', lazy=True)
    medical_histories = db.relationship('UserMedicalHistory', backref='user', lazy=True)
    questionnaire_forms = db.relationship('QuestionnaireForm', backref='user', lazy=True)
    chat_messages = db.relationship('ChatMessage', backref='user', lazy=True)
    text_classifications = db.relationship('TextClassification', backref='user', lazy=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserMentalHealthHistory(db.Model):
    __tablename__ = 'user_mental_health_history'

    id = db.Column(db.Integer, primary_key=True)
    psychiatricHistory = db.Column(db.Text, nullable=False)
    stressLevels = db.Column(db.Text, nullable=False)
    copingMechanisms = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user_information.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserMedicalHistory(db.Model):
    __tablename__ = 'user_medical_history'

    id = db.Column(db.Integer, primary_key=True)
    pastMedicalHistory = db.Column(db.Text, nullable=False)
    familyMedicalHistory = db.Column(db.Text, nullable=True)
    medicationHistory = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_information.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class QuestionnaireForm(db.Model):
    __tablename__ = 'questionnaire_form'

    id = db.Column(db.Integer, primary_key=True)
    currentMood = db.Column(db.Text, nullable=False)
    recentExperiences = db.Column(db.Text, nullable=True)
    emotionalState = db.Column(db.Text, nullable=True)
    emotionalTriggers = db.Column(db.Text, nullable=True)
    copingMethods = db.Column(db.Text, nullable=True)
    safetyCheck = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_information.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatMessage(db.Model):
    __tablename__ = 'chat_message'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user_information.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class TextClassification(db.Model):
    __tablename__ = 'text_classification'

    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text, nullable=False)
    classification = db.Column(db.String(120), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user_information.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
# ---------------------------------------------------------------------------- #
