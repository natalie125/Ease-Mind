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

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    PatientAge = db.Column(db.Float)
    GenesInMothersSide = db.Column(db.Float)
    InheritedFromFather = db.Column(db.Float)
    MaternalGene = db.Column(db.Float)
    PaternalGene = db.Column(db.Float)
    BloodCellCount_mcL = db.Column(db.Float)
    MothersAge = db.Column(db.Float)
    FathersAge = db.Column(db.Float)
    RespiratoryRate_breathsPerMin = db.Column(db.Float)
    HeartRate_ratesPermin = db.Column(db.Float)
    Gender = db.Column(db.Float)
    BirthAsphyxia = db.Column(db.Float)
    FolicAcidDetails_periConceptiona = db.Column(db.Float)
    HistoryOfSeriousMaternalIllness = db.Column(db.Float)
    HistoryOfRadiationExposure_xRay = db.Column(db.Float)
    HistoryOfSubstanceAbuse = db.Column(db.Float)
    AssistedConception_IVF_ART = db.Column(db.Float)
    HistoryOfAnomaliesInPreviousPregnancies = db.Column(db.Float)
    NumberOfPreviousAbortions = db.Column(db.Float)
    BirthDefects = db.Column(db.Float)
    WhiteBloodCellCount_thousand_per_microliter = db.Column(db.Float)
    BloodTestResult = db.Column(db.Float)
    Symptom1 = db.Column(db.Float)
    Symptom2 = db.Column(db.Float)
    Symptom3 = db.Column(db.Float)
    Symptom4 = db.Column(db.Float)
    Symptom5 = db.Column(db.Float)
    DisorderSubclass = db.Column(db.Float)
    DisorderSubclassPredicted = db.Column(db.Float)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class PATIENTS(db.Model):
    # ROW_ID = db.Column(db.Integer, primary_key=True)
    SUBJECT_ID = db.Column(db.Integer, primary_key=True)
    GENDER = db.Column(db.String(1))
    DOB = db.Column(db.Date)
    # DOD # Not required for demonstration
    # DOD_HOSP # Not required for demonstration
    # DOD_SSN # Not required for demonstration
    # EXPIRE_FLAG # Not required for demonstration

    MOTHER_SUBJECT_ID = db.Column(db.Integer, db.ForeignKey('patients.SUBJECT_ID'), nullable=True)
    FATHER_SUBJECT_ID = db.Column(db.Integer, db.ForeignKey('patients.SUBJECT_ID'), nullable=True)
    DESCENDENTS_CONSENT_FLAG = db.Column(db.Boolean, default=False)


class D_ICD_DIAGNOSES(db.Model):
    ROW_ID = db.Column(db.Integer, primary_key=True)
    ICD9_CODE = db.Column(db.String(10))
    SHORT_TITLE = db.Column(db.String(50))
    LONG_TITLE = db.Column(db.String(400))

class D_ITEMS(db.Model):
    ROW_ID = db.Column(db.Integer, primary_key=True)
    ITEMID = db.Column(db.String(10))
    LABEL = db.Column(db.String(100))
    ABBREVIATION = db.Column(db.String(80))
    DBSOURCE = db.Column(db.String(20))
    LINKSTO = db.Column(db.String(20))
    # CATEGORY # Not required for demonstration
    # UNITNAME # Not required for demonstration
    # PARAM_TYPE # Not required for demonstration
    # CONCEPTID # Not required for demonstration

class DIAGNOSES_ICD(db.Model):
    ROW_ID = db.Column(db.Integer, primary_key=True)
    SUBJECT_ID = db.Column(db.Integer, db.ForeignKey('patients.SUBJECT_ID'), nullable=False)
    # HADM_ID # Not required for demonstration
    SEQ_NUM = db.Column(db.Integer)
    ICD9_CODE = db.Column(db.String(10))

class CHARTEVENTS(db.Model):
    ROW_ID = db.Column(db.Integer, primary_key=True)
    SUBJECT_ID = db.Column(db.Integer, db.ForeignKey('patients.SUBJECT_ID'), nullable=False)
    # HADM_ID # Not required for demonstration
    # ICUSTAY_ID # Not required for demonstration
    ITEMID = db.Column(db.String(10), db.ForeignKey('d_items.ITEMID'), nullable=False)
    CHARTTIME = db.Column(db.Date)
    STORETIME = db.Column(db.Date)
    # CGID # Not required for demonstration
    VALUE = db.Column(db.String(200))
    VALUENUM = db.Column(db.Float)
    VALUEUOM = db.Column(db.String(20))
    # WARNING # Not required for demonstration
    # ERROR # Not required for demonstration

class LABEVENTS(db.Model):
    ROW_ID = db.Column(db.Integer, primary_key=True)
    SUBJECT_ID = db.Column(db.Integer, db.ForeignKey('patients.SUBJECT_ID'), nullable=False)
    # HADM_ID # Not required for demonstration
    ITEMID = db.Column(db.String(10), db.ForeignKey('d_items.ITEMID'), nullable=False)
    CHARTTIME = db.Column(db.Date)
    VALUE = db.Column(db.String(200))
    VALUENUM = db.Column(db.Float)
    VALUEUOM = db.Column(db.String(20))
    FLAG = db.Column(db.String(20))

class NOTEEVENTS(db.Model):
    ROW_ID = db.Column(db.Integer, primary_key=True)
    SUBJECT_ID = db.Column(db.Integer, db.ForeignKey('patients.SUBJECT_ID'), nullable=False)
    # HADM_ID # Not required for demonstration
    CHARTDATE = db.Column(db.Date)
    CHARTTIME = db.Column(db.Date)
    STORETIME = db.Column(db.Date)
    CATEGORY = db.Column(db.String(100))
    DESCRIPTION = db.Column(db.String(100))
    # CGID # Not required for demonstration
    # ISERROR # Not required for demonstration
    TEXT = db.Column(db.String(1000))

class DATETIMEEVENTS(db.Model):
    ROW_ID = db.Column(db.Integer, primary_key=True)
    SUBJECT_ID = db.Column(db.Integer, db.ForeignKey('patients.SUBJECT_ID'), nullable=False)
    # HADM_ID # Not required for demonstration
    # ICUSTAY_ID # Not required for demonstration
    ITEMID = db.Column(db.String(10), db.ForeignKey('d_items.ITEMID'), nullable=False)
    CHARTTIME = db.Column(db.Date)
    STORETIME = db.Column(db.Date)
    # CGID # Not required for demonstration
    VALUE = db.Column(db.Date)
    # VALUEUOM # Not required for demonstration
    # WARNING # Not required for demonstration
    # ERROR # Not required for demonstration
    # RESULTSTATUS # Not required for demonstration
    # STOPPED # Not required for demonstration

    # # HADM_ID # Not required for demonstration
    # CHARTDATE = db.Column(db.Date)
    # CHARTTIME = db.Column(db.Date)
    # STORETIME = db.Column(db.Date)
    # CATEGORY = db.Column(db.String(100))
    # DESCRIPTION = db.Column(db.String(100))
    # # CGID # Not required for demonstration
    # # ISERROR # Not required for demonstration
    # TEXT = db.Column(db.String(1000))

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
