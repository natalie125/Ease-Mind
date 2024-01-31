import os, time, json, base64
from datetime import timedelta
from app import bcrypt, db
from flask import request, jsonify, Blueprint, current_app
from .models import Users
from flask_jwt_extended import JWTManager, get_jwt_identity
from flask_jwt_extended import create_access_token, jwt_required

auth_bp = Blueprint('auth', __name__)

# import individual project python files
from app.kevin.kevin import *  # noqa: F403, F401
from app.lanre.lanre import *  # noqa: F403, F401
from app.ramat.ramat import *  # noqa: F403, F401
#from app.shreyas.shreyas import *  # noqa: F403, F401
from app.rootsRadar.rootsRadar import *  # noqa: F403, F401

# ---------------------------------------------------------------------------- #

@auth_bp.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data.decode('utf-8'))

    email = data['credentials']['email'];
    if email == '': return {"msg": "No email was provided."}, 400

    password = data['credentials']['password'];
    if password == '': return {"msg": "No password was provided."}, 400

    user = Users.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Incorrect username or password."}), 401

    token = create_access_token(user.id, expires_delta=timedelta(hours=1))

    return jsonify({"token": token, "email": user.email}), 200

# ---------------------------------------------------------------------------- #

@auth_bp.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data.decode('utf-8'))

    email = data['email'];
    if email == '': return {"msg": "No email was provided."}, 400

    password = data['password'];
    if password == '': return {"msg": "No password was provided."}, 400

    username_is_taken = Users.query.filter_by(email=email).first()
    if username_is_taken: return {"msg": "Username taken."}, 409

    hashed_password = bcrypt.generate_password_hash(
        data['password']).decode('utf-8')

    new_user = Users(email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return {"msg": "New user added.", "token": access_token}, 200

# ---------------------------------------------------------------------------- #

# PROOF OF CONCEPT OF UPLOADING IMAGES TO SERVER
# CURRENTLY SAVES IMAGE TO SHOTS FOLDER, BUT COULD BE EXTENDED TO PROCESS IMAGES
@auth_bp.route('/upload', methods=['POST'])
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
@auth_bp.route('/verification', methods=['POST'])
@jwt_required()
def verification():
    return {'user': get_jwt_identity()}
