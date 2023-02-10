from app import db
from sqlalchemy.orm import validates

# Definition of the table named "User_Login" for storing user login information
# emails are unique, passwords are not
class User_Login(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(500), index=True, unique=True)
    password = db.Column(db.String(500))

    # Going off of this tutorial: https://ed-a-nunes.medium.com/field-validation-for-backend-apis-with-python-flask-and-sqlalchemy-30e8cc0d260c
    @validates('email')
    def validate_email(self, key, email):
        # Check for empty email
        if not email:
            raise AssertionError('No email provided')
        # Check for already taken email
        if User_Login.query.filter(User_Login.email == email).first():
            raise AssertionError('Email is already in use')
        # Check for no '@' character
        if "@" not in email:
            raise AssertionError('Email address missing "@" symbol')
        # return email field and chain validate the password
        return email

    @validates('password')
    def validate_password(self, key, password):
        # Check for empty password
        if not password:
            raise AssertionError('No password provided')
        return password

# exact same table as above, but the test version
# Definition of the table named "User_Login" for storing user login information
# emails are unique, passwords are not
class User_Login_Test(db.Model):
    __bind_key__ = 'test'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(500), index=True, unique=True)
    password = db.Column(db.String(500))

    # Going off of this tutorial: https://ed-a-nunes.medium.com/field-validation-for-backend-apis-with-python-flask-and-sqlalchemy-30e8cc0d260c
    @validates('email')
    def validate_email(self, key, email):
        # Check for empty email
        if not email:
            raise AssertionError('No email provided')
        # Check for already taken email
        if User_Login_Test.query.filter(User_Login_Test.email == email).first():
            raise AssertionError('Email is already in use')
        # Check for no '@' character
        if "@" not in email:
            raise AssertionError('Email address missing "@" symbol')
        # return email field and chain validate the password
        return email

    @validates('password')
    def validate_password(self, key, password):
        # Check for empty password
        if not password:
            raise AssertionError('No password provided')
        return password

########################################
# FAMILY PEDIGREE TABLES
# ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

# table for family trees
class Pedigree_Tree(db.Model):
    __bind_key__ = 'canopy'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False) # name of the tree
    owner = db.Column(db.String(500), nullable=False) # syncs with the email column in the User_Login table

# table for patients
class Pedigree_Patient(db.Model):
    __bind_key__ = 'canopy'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False) # name of the patient
    dob = db.Column(db.DateTime, nullable=False) # their date of birth as a Python DateTime object
    ethnicity = db.Column(db.String(500), nullable=False) # ethnicity of the patient

# table for health_conditions
class Pedigree_Health_Conditions(db.Model):
    __bind_key__ = 'canopy'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False) # name of the health condition
    hereditary = db.Column(db.Boolean, default=False) # boolean for whether the condition is hereditary, default False

# join table for the relationship of "a tree owns a patient" or "a patient belongs to a tree"
tree_patient = db.Table('tree_patient',
    db.Column('tree_id', db.Integer, db.ForeignKey('pedigree_tree.id')),
    db.Column('patient_id', db.Integer, db.ForeignKey('pedigree_patient.id'))
)

# join table for the relationship of "a patient is the parent of another patient" or "a patient is the child of another patient"

# join table for the relationship of "a patient has this health condition" or "this health condition affects this patient"