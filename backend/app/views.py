# from flask import request, render_template, flash, redirect, url_for
import werkzeug
from flask import request, flash, jsonify
from app import app, models, bcrypt, db
import time
import os
import json
import base64
from .models import User_Login, User_Login_Test
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import JWTManager
from datetime import timedelta

# import everyone's individual python files
from app.alex.alex import *  # noqa: F403, F401
from app.kevin.kevin import *  # noqa: F403, F401
from app.lanre.lanre import *  # noqa: F403, F401
from app.ramat.ramat import *  # noqa: F403, F401
from app.shreyas.shreyas import *  # noqa: F403, F401
from app.rootsRadar.rootsRadar import *  # noqa: F403, F401

# Setup the Flask-JWT-Extended extension
# FIXME: The secret key needs to be .gitignored and saved in a secrets env not in the repo
app.config["JWT_SECRET_KEY"] = "comp3931-larks"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

#############################################################
# BEGINNING OF GLOBAL VARIABLES
# ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# keeps track of whether we are in testing mode, passed to functions that want to have different behaviour when testing
testing = False  # default should be False, explictly change to True whenever you want to run in Test mode

#############################################################
# BEGINNING OF HTTP ERROR HANDLERS
# ^^^^^^^^^^^^^^^^^^^^^^^

#############################################################
# REGISTER 400 ERROR
# ^^^^^^^^^^^^^^^^^^^^^^^
# HTTP Error for bad request is specifically No. 400


@app.errorhandler(werkzeug.exceptions.MethodNotAllowed)
def handle_bad_request(e):
    # Need to figure out how to request the "400Error" page on the React frontend
    return 'bad request!', 400

#############################################################
# FOLLOWING RESPONSE HEADERS ARE ADDED IN THE RESPONSE TO EVERY REQUEST TO PREVENT CLICKJACKING, XSS, ETC
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.after_request
def add_header(response):
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

#############################################################
# GETTER AND SETTER METHODS
# ^^^^^^^^^^^^^^^^^^^^^^^


def set_testing(setting):
    if (bool(setting)):
        testing = setting
    return testing


def get_testing():
    return testing

#############################################################
# ROUTE FOR LANDING PAGE
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/', methods=['GET', 'POST'])
def index():
    response = {"Larks App": "Welcome",
                "version": "1.4"}
    return jsonify(response)


############################################################
# ROUTE FOR LOGIN
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/login', methods=['POST'])
def login():
    print("Request is POST!")
    print(request.data)
    # to convert byte data into utf characters
    data = json.loads(request.data.decode('utf-8'))

    print(data)
    print(data.get('credentials'))

    # flash(request)
    # return {"type": "POST"}
    if (testing):
        u = models.User_Login_Test.query.filter_by(
            email=data['credentials']['email']).first()
    else:
        u = models.User_Login.query.filter_by(
            email=data['credentials']['email']).first()
    # check username and password
    if u:
        if bcrypt.check_password_hash(u.password, data['credentials']['password']):
            # response = {"token": "test123"}
            print('Login Successful!', 'success')
            # access_token = create_access_token(identity=data['credentials']['email'])
            access_token = create_access_token(identity=u.id)
            print(access_token)
            response = {"token": access_token,
                        "email": u.email}   # added by Alex in order to track the email of the logged in user
            return jsonify(response), 200
        else:
            print("Wrong Password")
            response = {"msg": "Bad Password"}
            return jsonify(response), 401

    else:
        print("Wrong username")
        response = {"msg": "Bad Username"}
        return jsonify(response), 401


############################################################
# ROUTE FOR REGISTER
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/register', methods=['POST'])
def register():
    print(testing)
    print(request.data)
    data = json.loads(request.data.decode('utf-8'))
    print(data['email'])
    if (data['email'] == '' or data['password'] == ''):
        return {"msg": "One or more credentials not provided"}, 401

    if (testing):
        username_database_check = models.User_Login_Test.query.filter_by(
            email=data['email']).first()
    else:
        username_database_check = models.User_Login.query.filter_by(
            email=data['email']).first()
    if username_database_check:
        print("Username already exists!")
        return {"msg": "Username taken"}, 409
    else:
        print("Valid!")
        hashed_password = bcrypt.generate_password_hash(
            data['password']).decode('utf-8')
        # check if we're in testing mode
        if (testing):
            new_user = User_Login_Test(
                email=data['email'], password=hashed_password)
        else:
            new_user = User_Login(
                email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=new_user.id)
        return {"msg": "New User Added!", "token": access_token}, 200


#############################################################
# ROUTE SIMPLY PROVIDING A PROOF OF CONCEPT OF UPLOADING IMAGES TO SERVER
# CURRENTLY SAVES IMAGE TO SHOTS FOLDER, BUT I IMAGINE WE DONT WANT TO DO THAT AND ONLY WANT TO PROCESS IMAGES
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/upload', methods=['POST'])
@jwt_required()
def upload():
    image = request.form['image']
    # if frontend sends no image return error
    if image == "null":
        return {"msg": "No image sent!"}, 415

    # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
    image = image[22:]
    image_decoded = base64.b64decode(image)

    # gets string of curr time and names file that
    timestamp = str(int(time.time()))
    filename = timestamp+".png"

    # saves decoded base 64 string to that image
    with open(os.path.join("shots", filename), "wb") as f:
        f.write(image_decoded)
    return {"msg": "image successfully saved in server!"}, 200

#############################################################
# ROUTE USED TO VERIFY A JWT
# NEEDED SO MALICIOUS ACTORS SIMPLY CANNOT MANUALLY ADD IN A RANDOM SESSION STORAGE VARIABLE IN THE BROWSER ALLOWING THEM TO LOGIN
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/verification', methods=['POST'])
@jwt_required()
def some_endpoint():
    current_user = get_jwt_identity()
    print(current_user)
    return {'user': current_user}