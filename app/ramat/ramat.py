# flake8: noqa

from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db
import pickle
import base64
from shapely.geometry import Polygon

import cv2
import numpy as np
import dlib
import os


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


#############################################################
# ROUTE FOR RAMAT'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/ramat', methods=['GET', 'POST'])
def ramat():
    if request.method == 'GET':
        return "Ramat's App has been Requested"
    elif request.method == 'POST':

        model = pickle.load(open("app/ramat/droop_model.sav", 'rb'))

        image = request.form['image']

        # if frontend sends no image return error
        if image == "null":
            return {"msg": "No image sent!"}, 415

        # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
        image = image[22:]
        imageStr = base64.b64decode(image)
        
        #convert image string to array of bytes
        imageBytes = np.fromstring(imageStr, np.uint8)
        
        # get the calculations for the inputted image
        image_calcs = getCalculations(imageBytes)

        # check the status of the calculations before generating a prediction
        if (image_calcs[0] == "ERROR"):
            return {"msg": image_calcs[1]}, image_calcs[2]
        elif (image_calcs[0] == "SUCCESS"):
            prediction = model.predict([[image_calcs[1], image_calcs[2]]])
            return {"msg": prediction[0]}, 200


