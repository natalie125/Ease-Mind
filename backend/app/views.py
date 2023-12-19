import os, time, json, base64
from datetime import timedelta
from app import app, bcrypt, db
from flask import request, jsonify
from .models import User_Login, User_Login_Test
from flask_jwt_extended import JWTManager, get_jwt_identity
from flask_jwt_extended import create_access_token, jwt_required

# import individual project python files
from app.kevin.kevin import *  # noqa: F403, F401
from app.lanre.lanre import *  # noqa: F403, F401
from app.ramat.ramat import *  # noqa: F403, F401
from app.shreyas.shreyas import *  # noqa: F403, F401
from app.rootsRadar.rootsRadar import *  # noqa: F403, F401

# ---------------------------------------------------------------------------- #

# Setup the Flask-JWT-Extended extension
# FIXME: The secret key needs to be .gitignored and saved in a secrets env not
#        in the repo.
app.config["JWT_SECRET_KEY"] = "comp3931-larks"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

# ---------------------------------------------------------------------------- #

# FIXME: This is awful and should be done with env variable or a test db.
#        It may also be useless if we can set up a proper test database that
#        doesn't require us to duplicate models.
USE_TEST_DATABASE = False # Set true to use the test database tables.
users = User_Login_Test if USE_TEST_DATABASE else User_Login

# ---------------------------------------------------------------------------- #

# FOLLOWING RESPONSE HEADERS ARE ADDED IN THE RESPONSE TO EVERY REQUEST TO
# PREVENT CLICKJACKING, XSS, ETC
@app.after_request
def add_header(response):
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# ---------------------------------------------------------------------------- #

@app.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data.decode('utf-8'))

    email = data['credentials']['email'];
    if email == '': return {"msg": "No email was provided."}, 400

    password = data['credentials']['password'];
    if password == '': return {"msg": "No password was provided."}, 400

    user = users.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Incorrect username or password."}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({"token": access_token, "email": user.email}), 200

# ---------------------------------------------------------------------------- #

@app.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data.decode('utf-8'))

    email = data['email'];
    if email == '': return {"msg": "No email was provided."}, 400

    password = data['password'];
    if password == '': return {"msg": "No password was provided."}, 400

    username_is_taken = users.query.filter_by(email=email).first()
    if username_is_taken: return {"msg": "Username taken."}, 409

    hashed_password = bcrypt.generate_password_hash(
        data['password']).decode('utf-8')

    new_user = users(email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return {"msg": "New user added.", "token": access_token}, 200

# ---------------------------------------------------------------------------- #

# PROOF OF CONCEPT OF UPLOADING IMAGES TO SERVER
# CURRENTLY SAVES IMAGE TO SHOTS FOLDER, BUT COULD BE EXTENDED TO PROCESS IMAGES
@app.route('/upload', methods=['POST'])
@jwt_required()
def upload():
    image = request.form['image']

    if image == "null":
        return {"msg": "No image was provided."}, 400

    # removes header of base 64 encoded string i.e. first 22 chars and decodes
    # the rest
    image = image[22:]
    image_decoded = base64.b64decode(image)

    timestamp = str(int(time.time()))
    filename = timestamp+".png"

    # saves decoded base 64 string to that image
    with open(os.path.join("shots", filename), "wb") as f:
        f.write(image_decoded)

    return {"msg": "Image saved successfully."}, 200

# ---------------------------------------------------------------------------- #

# ROUTE USED TO VERIFY A JWT SO MALICIOUS ACTORS CAN'T MANUALLY ADD A RANDOM
# SESSION STORAGE VARIABLE IN THE BROWSER ALLOWING THEM TO LOGIN
@app.route('/verification', methods=['POST'])
@jwt_required()
def verification():
    return {'user': get_jwt_identity()}
