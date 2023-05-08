# flake8: noqa

from flask import  request
from app import app
import pickle
import base64
from shapely.geometry import Polygon
from numpy import ones,vstack
from numpy.linalg import lstsq

import cv2
import mediapipe as mp
from deepface import DeepFace
from deepface.commons import functions

import numpy as np
import os
import librosa
import pandas as pd
import tensorflow as tf
import time
import csv

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode = True)
facial_features = {
    'right_eye_inner': [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382, 362], # inner corner -> outer corner -> inner_corner
    'left_eye_inner': [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155, 133],
    'right_eye_corners': [263, 362],  # outer -> inner
    'left_eye_corners': [33, 133 ],
    'right_cheek_line':[358, 423, 426, 436, 432],
    'left_cheek_line':[129, 203, 206, 216, 212],
    'mouth_corners': [61, 291],  # left to right
    'inner_mouth': [62, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 
                    292, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78],
    'right_mouth_outer': [0, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0],
    'left_mouth_outer' : [0, 17, 84, 181, 91, 146, 61, 185, 40, 39, 37 , 0], 
    'mid_line': [10, 151, 9, 200, 199, 175, 152]                             
}

# function to return the coordinates of lanmark points 
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
    
# function to return the line of best fit uaing the least squaares method when given landmark points
def get_line(coordinates):
    x_ords, y_ords = np.split(coordinates,2,axis=1)

    x_ords=x_ords.flatten()
    y_ords=y_ords.flatten()

    A = vstack([x_ords,ones(len(x_ords))]).T
    m, c = lstsq(A, y_ords)[0]

    #print(str(m) + ", " + str(c))

    return m, c

# function to reflect coordinates over a given line
def reflect_points(coordinates, m, c):
    reflection_mat = np.array([[((1-m**2)/(1+m**2)), ((2*m)/(1+m**2))],
              [((2*m)/(1+m**2)), ((m**2-1)/(1+m**2))]])
    reflected_coordinates = []
    temp = []
    for coord in coordinates:
        #x = (((1 - m**2)*coord[0]) + 2*m*coord[1] - 2*m*c)/1+m**2
        #y = ((2*m*coord[0]) + (m**2 - 1)*coord[1] + (2*c))/1+m**2

        #np.matmul(, reflection_mat)

        x = (-(m**2*coord[0]) - 2*m*c)/m**2
        y = ((m**2)*coord[1])/m**2
        reflected_coordinates.append([x,y])

    return reflected_coordinates

# function to calculate the symmetry between a feature on the left and right side of the face
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

# calculates the gradients given a start point and en end point
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

    faces = DeepFace.extract_faces(image, grayscale = True,
                                            enforce_detection = False, detector_backend ="mtcnn")
    
    
    if (len(faces) > 1): # check there is more than 1 face in the image
        return ["ERROR", "multiple faces detected"]
    elif (len(faces) < 1 or (faces[0])['confidence'] == 0.0): # check if no face was detected  
        print(len(faces))
        print((faces[0])['confidence'])
        return ["ERROR", "no face detected"]
    
    print(faces)

    raw_face = (faces[0])['face']
    face = np.array(raw_face * 255, dtype = np.uint8)

    landmarks = None

    try:
        results = face_mesh.process(cv2.cvtColor(face, cv2.COLOR_GRAY2RGB))
        landmarks = results.multi_face_landmarks[0]
    except TypeError:
        return ["ERROR", "face unclear"]

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

def featureExtraction (raw_image):
    face_predictor_path = os.path.join(os.getcwd(),'app/ramat/shape_predictor_68_face_landmarks.dat')

    x_coords= np.array([])
    y_coords = np.array([])

    # load the predictor
    predictor = dlib.shape_predictor(face_predictor_path)
    # load the detector
    detector = dlib.get_frontal_face_detector()

    # convert the image from bytes to a cvs::Umat
    img = cv2.imdecode(raw_image, cv2.IMREAD_COLOR)

    # Convert image into grayscale
    grayscale_image = cv2.cvtColor(src=img, code=cv2.COLOR_BGR2GRAY)

    # Use detector to find landmarks
    faces = detector(grayscale_image)

    # check there is only 1 face in the imagea
    if (len(faces) < 1):
        return "None", [0], [0]
    elif (len(faces) > 1):
        return "Multi", [0], [0]

    face = faces[0]
    # create the landmark object
    landmarks = predictor(image=grayscale_image, box=face)

    # loop through all the points
    for n in range(0, 68):
        x = landmarks.part(n).x
        y = landmarks.part(n).y

        x_coords = np.append(x_coords, x)
        y_coords = np.append(y_coords, y)

    return "SUCCESS", x_coords,y_coords
   

def calculateFeatureArea(x,y):
    feature = Polygon(zip(x,y))
    return feature.area


def calculateSlope(leftCorner, rightCorner):
    return ((rightCorner[1] - leftCorner[1]) / (rightCorner[0] - leftCorner[0]))


def getCalculations(raw_image):
    status, x, y = featureExtraction(raw_image)

    if (status == "None"):
        return ["ERROR", "no face detected",  422]
    elif (status == "Multi"):
        return ["ERROR", "multiple faces detected", 422]
    else:
        rightEyeArea = calculateFeatureArea(x[36:42], y[36:42])
        leftEyeArea = calculateFeatureArea(x[42:48], y[42:48])
        mouthSlope = calculateSlope([x[48], y[48]], [x[54], y[54]])

        eyeRatio = abs(leftEyeArea/rightEyeArea)

        return ["SUCCESS", eyeRatio, mouthSlope]
    

def voiceFeatureExtraction():
    directory = os.getcwd()
    voice_path =  os.path.join(directory,"app/ramat/voice.wav")

    x , sr = librosa.load(voice_path)

    mean_mfcc = np.mean(librosa.feature.mfcc(y=x, sr=sr, n_mfcc=128),axis=1)
    mfcc_coeffs = pd.DataFrame([mean_mfcc])

    return mfcc_coeffs.to_numpy().reshape(-1,16,8,1)

def times_to_csv(filename, model_load, face_extraction, voice_extraction, total):
    # field names 
    header = ['model_time', 'face_extraction_time', 'voice_extraction_time', 'total_time'] 

    with open(filename, 'a', newline='') as file: 
        writer = csv.writer(file)
        writer.writerow(header)
        writer.writerow([model_load, face_extraction, voice_extraction, total])




#############################################################
# ROUTE FOR RAMAT'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/ramat', methods=['GET', 'POST'])
def image_and_audio():
    if request.method == 'GET':
        return "Ramat's App has been Requested"
    elif request.method == 'POST':
        total_time_start = time.time()

        model_load_start = time.time()

        face_model = pickle.load(open("app/ramat/droop_model.sav", 'rb'))
        voice_model = tf.keras.models.load_model('app/ramat/speech_model.h5')

        model_load_end = time.time()
        model_load_time = model_load_end - model_load_start
        print("model load time: " + str(model_load_time))

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
        
        f = open("demofile2.txt", "w")
        f.write(image)
        f.close()

        # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
        image = image.split("base64,")[1]

        f = open("demofile2.txt", "a")
        f.write("\n")
        f.write("_____________________________________________________________________________________")
        f.write(image)
        f.close()

        imageStr = base64.b64decode(image)
        
        #convert image string to array of bytes
        image_bytes = np.fromstring(imageStr, np.uint8)

        print("_____________________________________")
        print(type(image_bytes))
        print(image_bytes.shape)
        print(image_bytes.shape)
        print("_____________________________________")

        
        image_feature_extraction_start = time.time()
        # get the calculations for the inputted image
        face_calculations = face_feature_extraction(image_bytes)
        image_feature_extraction_end = time.time()
        face_extraction_time = image_feature_extraction_end - image_feature_extraction_start
        print("image feature extraction time: " + str(image_feature_extraction_end - image_feature_extraction_start))

        # check the status of the calculations beftemore generating a prediction
        if (face_calculations[0] == "ERROR"):
            total_time_end = time.time()
            total_time = total_time_end - total_time_start

            print("total time: " + str(total_time_end - total_time_start))
            times_to_csv("complete_v2", model_load_time, face_extraction_time, voice_extraction_time, total_time)

            
            return {"msg": face_calculations[1]}, 422
        elif (face_calculations[0] == "SUCCESS"):
            print([face_calculations[1]])
            face_prediction = face_model.predict_proba([face_calculations[1]])

            ###########################
            # Handle audio
            # -----------

            # only bother predicting voice if image is valid
            voice_feature_extraction_start = time.time()
            features = voiceFeatureExtraction()
            voice_feature_extraction_end = time.time()
            voice_extraction_time = voice_feature_extraction_end - voice_feature_extraction_start
            print("voice feature extraction time: " + str(voice_feature_extraction_end - voice_feature_extraction_start))

            audio_prediction = voice_model.predict(features)

            total_time_end = time.time()
            total_time = total_time_end - total_time_start
            print("total time: " + str(total_time_end - total_time_start))

            print()

            times_to_csv("stress_test_v2.csv", model_load_time, face_extraction_time, voice_extraction_time, total_time)

            # return probability of droop being present
            return {"msg": {"face_prediction": face_prediction[0][1], "voice_prediction":str(audio_prediction[0][0])}}, 200
        

@app.route('/ramat/audio', methods=['GET', 'POST'])
def audio():
    if request.method == 'GET':
        return "Ramat's App has been Requested"
    elif request.method == 'POST':
        voice_model = load_model('app/ramat/model.h5')
        # print(request)
        # print(request.files)
        # print(request.files['audio'].read())


        # print("-------------------------------------------------------")     

        audio_file = request.files['audio']

        if audio_file.filename != '':
            request.files['audio'].save("app/ramat/voice.wav")
        else:
            # if frontend sends no file return error
            return {"msg": "No audio sent!"}, 415

        features = voiceFeatureExtraction()


        prediction = voice_model.predict(features)
        # print(prediction[0][0])
        return {"msg": str(prediction[0][0])}, 200


       



