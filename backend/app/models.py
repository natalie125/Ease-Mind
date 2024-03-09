from app import db
from sqlalchemy.orm import validates, relationship, backref
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

#Social Phobia Inventory Test Question for EaseMind
class SPINQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500))  # The text of the question

    def __repr__(self):
        return f'<SPINQuestion {self.text}>'

#Social Phobia Inventory Test Result for EaseMind
class SPINTestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)  # The score from the test
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp of the test

    user = relationship('Users', backref='spin_test_results') 

#daily question 
class DailyQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.String(500))

    def __repr__(self):
        return f'<DailyQuestion {self.question_text}>'

#daily question answers
class DailyQAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('daily_question.id'), nullable=False)
    answer = db.Column(db.Text)
    word_detection = db.Column(db.String(50))
    def __repr__(self):
        return f"<Answer {self.id}>"
    
#Panic disorder Question for EaseMind
class PDQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500))  # The text of the question

    def __repr__(self):
        return f'<PDQuestion {self.text}>'

#Panic disorder Test Result for EaseMind
class PDTestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)  # The score from the test
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp of the test

    user = relationship('Users', backref='pd_test_results') 
