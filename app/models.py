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

# for join tables, make sure to explicitly name your models below them or they won't be able to find them
# during the create_all() process


# join table for the relationship of "a tree owns a patient" or "a patient belongs to a tree"
tree_patient = db.Table('tree_patient',
                        db.Column('tree_id', db.Integer, db.ForeignKey('pedigree_tree.id'), primary_key=True),
                        db.Column('patient_id', db.Integer, db.ForeignKey('pedigree_patient.id'), primary_key=True),
                        bind_key='canopy'
                        )


# join table for the relationship of "a patient is the parent of another patient" or "a patient is the child of another patient"
parent_child = db.Table('parent_child',
                        db.Column('parent_id', db.Integer, db.ForeignKey('pedigree_patient.id'), primary_key=True),
                        db.Column('child_id', db.Integer, db.ForeignKey('pedigree_patient.id'), primary_key=True),
                        bind_key='canopy'
                        )

# join table for the relationship of "a patient has this health condition" or "this health condition affects this patient"
patient_condition = db.Table('patient_condition',
                             db.Column('patient_id', db.Integer, db.ForeignKey('pedigree_patient.id'), primary_key=True),
                             db.Column('condition_id', db.Integer, db.ForeignKey('pedigree_health_condition.id'), primary_key=True),
                             bind_key='canopy'
                             )


# join table for the relationship of "a patient has these spouses" or "this patient is a spouse of this patient"
patient_spouse = db.Table('patient_spouse',
    db.Column('patient_id', db.Integer, db.ForeignKey('pedigree_patient.id'), primary_key=True),
    db.Column('spouse_id', db.Integer, db.ForeignKey('pedigree_patient.id'), primary_key=True),
    bind_key='canopy'
)

# table for family trees
class Pedigree_Tree(db.Model):
    __bind_key__ = 'canopy'
    __tablename__ = 'pedigree_tree'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)  # name of the tree
    owner = db.Column(db.String(500), nullable=False)  # syncs with the email column in the User_Login table

    # relationships
    nodes = db.relationship('Pedigree_Patient', secondary=tree_patient, backref=db.backref('node_of'))

    def __repr__(self):
        return f'<Pedigree_Tree: {self.name}>'


# table for patients
class Pedigree_Patient(db.Model):
    __bind_key__ = 'canopy'
    __tablename__ = 'pedigree_patient'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)  # name of the patient
    gender = db.Column(db.String(500), nullable=False)  # gender of the patient
    dob = db.Column(db.DateTime, nullable=False)  # their date of birth as a Python DateTime object
    dod = db.Column(db.DateTime)  # their date of death
    ethnicity = db.Column(db.String(500), nullable=False)  # ethnicity of the patient

    # relationships
    children = db.relationship('Pedigree_Patient', secondary=parent_child, primaryjoin=id==parent_child.c.parent_id, secondaryjoin=id==parent_child.c.child_id, backref=db.backref('parents'))
    spouses = db.relationship('Pedigree_Patient', secondary=patient_spouse, primaryjoin=id==patient_spouse.c.spouse_id, secondaryjoin=id==patient_spouse.c.patient_id, backref=db.backref('spouse_of'))
    conditions = db.relationship('Pedigree_Health_Condition', secondary=patient_condition, backref=db.backref('condition_of'))

    def __repr__(self):
        return f'<Pedigree_Patient: {self.name}>'


# table for health_conditions
class Pedigree_Health_Condition(db.Model):
    __bind_key__ = 'canopy'
    __tablename__ = 'pedigree_health_condition'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)  # name of the health condition
    hereditary = db.Column(db.Boolean, default=False)  # boolean for whether the condition is hereditary, default False
    disease_id = db.Column(db.String(500), nullable=False)  # the SNOMED concept ID for having the disease
    fh_condition_id = db.Column(db.String(500))  # the SNOMED concept ID to designate having a FH of the disease
    fh_condition_name = db.Column(db.String(500)) # the name of the FH condition

    # rules for the weighing of relationships in order to assign the family history of a condition
    male_parent = db.Column(db.Integer) # weight for the relationship of a male parent
    female_parent = db.Column(db.Integer) # weight for the relationship of a female parent
    male_grandparent = db.Column(db.Integer) # weight for the relationship of a male grandparent
    female_grandparent = db.Column(db.Integer) # weight for the relationship of a female grandparent

    def __repr__(self):
        return f'<Pedigree_Health_Condition: {self.name}>'


# Test tables for the family pedigree app
# join table for the relationship of "a tree owns a patient" or "a patient belongs to a tree"
tree_patient_test = db.Table('tree_patient_test',
                             db.Column('tree_id', db.Integer, db.ForeignKey('pedigree_tree_test.id'), primary_key=True),
                             db.Column('patient_id', db.Integer, db.ForeignKey('pedigree_patient_test.id'), primary_key=True),
                             bind_key='canopy_test'
                             )

# join table for the relationship of "a patient is the parent of another patient" or "a patient is the child of another patient"
parent_child_test = db.Table('parent_child_test',
                             db.Column('parent_id', db.Integer, db.ForeignKey('pedigree_patient_test.id'), primary_key=True),
                             db.Column('child_id', db.Integer, db.ForeignKey('pedigree_patient_test.id'), primary_key=True),
                             bind_key='canopy_test'
                             )

# join table for the relationship of "a patient has this health condition" or "this health condition affects this patient"
patient_condition_test = db.Table('patient_condition_test',
                                  db.Column('patient_id', db.Integer, db.ForeignKey('pedigree_patient_test.id'), primary_key=True),
                                  db.Column('condition_id', db.Integer, db.ForeignKey('pedigree_health_condition_test.id'), primary_key=True),
                                  bind_key='canopy_test'
                                  )


# join table for the relationship of "a patient has these spouses" or "this patient is a spouse of this patient"
patient_spouse_test = db.Table('patient_spouse_test',
    db.Column('patient_id', db.Integer, db.ForeignKey('pedigree_patient_test.id'), primary_key=True),
    db.Column('spouse_id', db.Integer, db.ForeignKey('pedigree_patient_test.id'), primary_key=True),
    bind_key='canopy_test'
)

# table for family trees
class Pedigree_Tree_Test(db.Model):
    __bind_key__ = 'canopy_test'
    __tablename__ = 'pedigree_tree_test'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)  # name of the tree
    owner = db.Column(db.String(500), nullable=False)  # syncs with the email column in the User_Login table

    # relationships
    nodes = db.relationship('Pedigree_Patient_Test', secondary=tree_patient_test, backref=db.backref('node_of'))

    def __repr__(self):
        return f'<Pedigree_Tree_Test: {self.name}>'


# table for patients
class Pedigree_Patient_Test(db.Model):
    __bind_key__ = 'canopy_test'
    __tablename__ = 'pedigree_patient_test'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)  # name of the patient
    gender = db.Column(db.String(500), nullable=False)  # gender of the patient
    dob = db.Column(db.DateTime, nullable=False)  # their date of birth as a Python DateTime object
    dod = db.Column(db.DateTime)  # their date of death
    ethnicity = db.Column(db.String(500), nullable=False)  # ethnicity of the patient

    # relationships
    children = db.relationship('Pedigree_Patient_Test', secondary=parent_child_test, primaryjoin=id==parent_child_test.c.parent_id, secondaryjoin=id==parent_child_test.c.child_id, backref=db.backref('parents'))
    spouses = db.relationship('Pedigree_Patient_Test', secondary=patient_spouse_test,
                              primaryjoin=id == patient_spouse_test.c.spouse_id,
                              secondaryjoin=id == patient_spouse_test.c.patient_id, backref=db.backref('spouse_of'))
    conditions = db.relationship('Pedigree_Health_Condition_Test', secondary=patient_condition_test, backref=db.backref('condition_of'))

    def __repr__(self):
        return f'<Pedigree_Patient_Test: {self.name}>'


# table for health_conditions
class Pedigree_Health_Condition_Test(db.Model):
    __bind_key__ = 'canopy_test'
    __tablename__ = 'pedigree_health_condition_test'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)  # name of the health condition
    hereditary = db.Column(db.Boolean, default=False)  # boolean for whether the condition is hereditary, default False
    disease_id = db.Column(db.String(500), nullable=False)  # the SNOMED concept ID for having the disease
    fh_condition_id = db.Column(db.String(500))  # the SNOMED concept ID to designate having a FH of the disease
    fh_condition_name = db.Column(db.String(500))  # the name of the FH condition

    # rules for the weighing of relationships in order to assign the family history of a condition
    male_parent = db.Column(db.Integer) # weight for the relationship of a male parent
    female_parent = db.Column(db.Integer) # weight for the relationship of a female parent
    male_grandparent = db.Column(db.Integer) # weight for the relationship of a male grandparent
    female_grandparent = db.Column(db.Integer) # weight for the relationship of a female grandparent

    def __repr__(self):
        return f'<Pedigree_Health_Condition_Test: {self.name}>'
