# flake8: noqa

from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db
import pickle
import base64
from shapely.geometry import Polygon
import moviepy.editor as moviepy


import cv2
import numpy as np
import dlib
import os
import librosa
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
import base64
import soundfile as sf
from scipy.io.wavfile import read as read_wav




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
        print("NO FACE")
        return "None", [0], [0]
    elif (len(faces) > 1):
        print("MULTI FACE")
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
    voice_path =  os.path.join(directory,"app/ramat/temp.wav")

    print("-------------------------------------")
    print(type(directory))
    print(directory)
    print(voice_path)
    print("=====================================s")


    x , sr = librosa.load(voice_path)
    mean_mfcc = np.mean(librosa.feature.mfcc(y=x, sr=sr, n_mfcc=128),axis=1)
    print(mean_mfcc)
    mfcc_coeffs = pd.DataFrame([mean_mfcc])
    print(mfcc_coeffs.to_numpy().shape)
    print(mfcc_coeffs.to_numpy())


    return mfcc_coeffs.to_numpy().reshape(-1,16,8,1)



#############################################################
# ROUTE FOR RAMAT'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/ramat/image', methods=['GET', 'POST'])
def image():
    if request.method == 'GET':
        return "Ramat's App has been Requested"
    elif request.method == 'POST':

        face_model = pickle.load(open("app/ramat/droop_model.sav", 'rb'))

        image = request.form['image']

        # if frontend sends no image return error
        if image == "null":
            return {"msg": "No image sent!"}, 415

        # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
        image = image[22:]
        imageStr = base64.b64decode(image)
        
        #convert image string to array of bytes
        imageBytes = np.fromstring(imageStr, np.uint8)
        
        # get the calculations fo-r the inputted image
        image_calcs = getCalculations(imageBytes)

        # check the status of the calculations beftemore generating a prediction
        if (image_calcs[0] == "ERROR"):
            return {"msg": image_calcs[1]}, image_calcs[2]
        elif (image_calcs[0] == "SUCCESS"):
            prediction = face_model.predict([[image_calcs[1], image_calcs[2]]])
            return {"msg": prediction[0]}, 200

@app.route('/ramat/audio', methods=['GET', 'POST'])
def audio():
    if request.method == 'GET':
        return "Ramat's App has been Requested"
    elif request.method == 'POST':
        voice_model = load_model('app/ramat/model.h5')
        print(request)
        print(request.files)
        # print(request.files['audio'].read())


        print("-------------------------------------------------------")     

        audio_file = request.files['audio']

        if audio_file.filename != '':
            request.files['audio'].save("app/ramat/temp.wav")
        else:
            # if frontend sends no file return error
            return {"msg": "No audio sent!"}, 415

        features = voiceFeatureExtraction()


        prediction = voice_model.predict(features)
        print(prediction[0][0])
        return {"msg": str(prediction[0][0])}, 200



