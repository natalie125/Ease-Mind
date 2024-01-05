# flake8: noqa
from flask import request
from app.endpoints import auth_bp

# face processing imports
import cv2
import mediapipe as mp
from deepface import DeepFace

import base64
from shapely.geometry import Polygon
from numpy import ones,vstack
from numpy.linalg import lstsq

# speech processing imports
import librosa
import os

# general and development imports
import numpy as np
import pandas as pd
import time
import tensorflow as tf
import pickle

# Load paralysis analysis models.
face_model = pickle.load(open("app/ramat/face_model.sav", 'rb'))
speech_model = tf.keras.models.load_model('app/ramat/speech_model.h5')

# load face mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode = True)

# define landmarks of facial features
facial_features = {
    'right_eye_inner': [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382, 362], # inner corner -> outer corner -> inner_corner
    'left_eye_inner': [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155, 133],
    'right_eye_corners': [263, 362],  # outer -> inner
    'left_eye_corners': [33, 133 ],
    'right_cheek_line':[358, 423, 426, 436, 432],
    'left_cheek_line':[129, 203, 206, 216, 212],
    'mouth_corners': [61, 291],  # left -> right
    'inner_mouth': [62, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
                    292, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78],
    'right_mouth_outer': [0, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0],
    'left_mouth_outer' : [0, 17, 84, 181, 91, 146, 61, 185, 40, 39, 37 , 0],
    'mid_line': [10, 151, 9, 200, 199, 175, 152]
}

# function to return the coordinates of landmark points
def landmarks_to_coords(landmarks, facial_area, zipped=True):
    x_ords = []
    y_ords = []

    for point in facial_area:
        landmark = landmarks.landmark[point]
        x_ords.append(landmark.x)
        y_ords.append(landmark.y)

    if(zipped):
        return zip(x_ords, y_ords)
    else:
        return np.vstack((x_ords, y_ords)).T

# function to return the line of best fit using the least squares method when given landmark points
def get_line(coordinates):
    x_ords, y_ords = np.split(coordinates,2,axis=1)

    x_ords=x_ords.flatten()
    y_ords=y_ords.flatten()

    x_arr = vstack([x_ords,ones(len(x_ords))]).T
    m, c = lstsq(x_arr, y_ords)[0]

    return m, c

# function to reflect coordinates over a given line
def reflect_points(coordinates, m, c):
    reflected_coordinates = []
    for coord in coordinates:

        x = (-(m**2*coord[0]) - 2*m*c)/m**2
        y = ((m**2)*coord[1])/m**2
        reflected_coordinates.append([x,y])

    return reflected_coordinates

# function to calculate the symmetry between a feature on the left and the same feature on right side of the face
# reflects the feature on the right side to the left side over the mid-line of the face and
# gets the difference between the reflected right coordinates and the corresponsing left coordinates
def get_feature_symmetry(landmarks, mid_face, right_landmarks, left_landmarks):
    diff = 0
    mid_face_coordinates = landmarks_to_coords(landmarks, mid_face, False)
    right_coordinates = landmarks_to_coords(landmarks, right_landmarks, False)
    left_coordinates = landmarks_to_coords(landmarks, left_landmarks, False)
    m, c = get_line(mid_face_coordinates)
    reflected_right = reflect_points(right_coordinates, m, c)

    for index,  reflected_right_coord in enumerate(reflected_right):
        left_coord = left_coordinates[index]
        diff += abs(left_coord[0] - reflected_right_coord[0])
        diff += abs(left_coord[1] - reflected_right_coord[1])

    return diff

# calculates the area of a given feature
# feature should be closed
def calculate_feature_area(landmarks, facial_area):
    coordinates = landmarks_to_coords(landmarks, facial_area)
    feature = Polygon(coordinates)

    return feature.area

# calculates the gradient given a start point and an end point
def calculate_gradient(landmarks, facial_area):
    zipped_coords = landmarks_to_coords(landmarks, facial_area)
    coordinates = list(zipped_coords)

    return ((coordinates[0][1] - coordinates[1][1]) / (coordinates[0][0] - coordinates[1][0]))

# function to calculate ratio of area of feature
def calculate_area_ratio(right_area, left_area):
    areas = [right_area, left_area]

    area1 = areas[areas.index(max(areas))]
    area2 = areas[areas.index(min(areas))]

    return (area1 / area2)

def face_feature_extraction(raw_image):
    # convert the image from bytes to a cvs::Umat
    image = cv2.imdecode(raw_image, cv2.IMREAD_COLOR)

    # extract faces from image, also regularises it by making the face 224 x 224 and straightening it
    faces = DeepFace.extract_faces(image, grayscale = True,
                                            enforce_detection = False, detector_backend ="mtcnn")


    if (len(faces) > 1): # check there is more than 1 face in the image
        return ["ERROR", "multiple faces detected"]
    elif (len(faces) < 1 or (faces[0])['confidence'] == 0.0): # check if no face was detected
        return ["ERROR", "no face detected"]

    raw_face = (faces[0])['face']
    face = np.array(raw_face * 255, dtype = np.uint8)

    landmarks = None

    try:
        # extract landmarks from face, if not all features are presnt/detectable a TypeError is thrown
        results = face_mesh.process(cv2.cvtColor(face, cv2.COLOR_GRAY2RGB))
        landmarks = results.multi_face_landmarks[0]
    except TypeError:
        return ["ERROR", "face unclear"]

    # perform feature extraction
    right_eye_gradient = calculate_gradient(landmarks, facial_features['right_eye_corners'])
    left_eye_gradient = calculate_gradient(landmarks, facial_features['left_eye_corners'])
    right_eye_area = calculate_feature_area(landmarks, facial_features['right_eye_inner'])
    left_eye_area = calculate_feature_area(landmarks, facial_features['left_eye_inner'])

    mouth_gradient = calculate_gradient(landmarks, facial_features['mouth_corners'])
    inner_mouth_area = calculate_feature_area(landmarks, facial_features['inner_mouth'])
    right_mouth_area = calculate_feature_area(landmarks, facial_features['right_mouth_outer'])
    left_mouth_area = calculate_feature_area(landmarks, facial_features['left_mouth_outer'])

    cheek_line_sim = get_feature_symmetry(landmarks, facial_features['mid_line'],
                                            facial_features['right_cheek_line'], facial_features['left_cheek_line'])

    eye_sim = get_feature_symmetry(landmarks, facial_features['mid_line'],
                                            facial_features['right_eye_inner'], facial_features['left_eye_inner'])

    mouth_sim = get_feature_symmetry(landmarks, facial_features['mid_line'],
                                            facial_features['right_mouth_outer'], facial_features['left_mouth_outer'])

    eye_area_ratio = calculate_area_ratio(right_eye_area, left_eye_area)
    mouth_area_ratio = calculate_area_ratio(right_mouth_area, left_mouth_area)

    return ["SUCCESS", [cheek_line_sim, eye_area_ratio, right_eye_gradient, left_eye_gradient, mouth_area_ratio, mouth_gradient, inner_mouth_area]]


def voice_feature_extraction():
    # get the voice file
    directory = os.getcwd()
    voice_path =  os.path.join(directory,"app/ramat/voice.wav")

    # load the voice file to get the audio as a floating point time series as well as it's sampling rate
    y , sr = librosa.load(voice_path)

    # extract mean Mel frequency cepstral coefficients
    mean_mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=128), axis=1)
    mfcc_coeffs = pd.DataFrame([mean_mfcc])

    os.remove(voice_path)

    return mfcc_coeffs.to_numpy().reshape(-1,16,8,1)

#############################################################
# ROUTE FOR RAMAT'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@auth_bp.route('/ramat', methods=['GET', 'POST'])
def image_and_audio():
    if request.method == 'GET':
        return "Ramat's App has been Requested"
    elif request.method == 'POST':

        # get the image and audio from the request
        image = request.form['image']
        audio_file = request.files['audio']

        # if frontend sends no image return error
        if image == "null":
            return {"msg": "No image sent!"}, 415

        if audio_file.filename != '':
            request.files['audio'].save("app/ramat/voice.wav")
        else:
            # if frontend sends no file return error
            return {"msg": "No audio sent!"}, 415

        # removes header of base 64 encoded string and decodes it
        image = image.split("base64,")[1]
        image_str = base64.b64decode(image)

        #convert image string to array of bytes
        image_bytes = np.fromstring(image_str, np.uint8)

        # get the calculations for the inputted image
        face_extract_result = face_feature_extraction(image_bytes)

        # check the status of the calculations before generating a prediction
        if (face_extract_result[0] == "ERROR"):
            return {"msg": face_extract_result[1]}, 422
        elif (face_extract_result[0] == "SUCCESS"):
            # face prediction as probability
            face_prediction = face_model.predict_proba([face_extract_result[1]])

            ###########################
            # Handle audio
            # -----------)

            # get the mfccs for the inputted audio
            voice_extract_result = voice_feature_extraction()

            # voice prediction as probability
            audio_prediction = speech_model.predict(voice_extract_result)

            # return probability of droop being present
            return {"msg": {"face_prediction": face_prediction[0][1], "speech_prediction": np.float64(audio_prediction[0][0])}}, 200
    else:
        # return 'not implemented' status code for any other request method
        return "", 501
