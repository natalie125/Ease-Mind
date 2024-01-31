from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import models, bcrypt, db
from app.endpoints import auth_bp
import base64
import matplotlib.pyplot as plt
import numpy as np
import io
from PIL import Image
import tensorflow as tf
from sklearn import model_selection
import os
import pandas as pd
import cv2

from flask_jwt_extended import jwt_required
#############################################################
# ROUTE FOR Kevin's APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@auth_bp.route('/kevin', methods=['GET', 'POST'])
@jwt_required()
def kevin():

    # Code for handling image upload to server - taken from shared code base.
    image = request.form['image']
    # if frontend sends no image return error
    if image == "null":
        return {"msg": "No image sent!"}, 415



    # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
    image = image[22:]
    image_decoded = base64.b64decode(image)
    img = Image.open(io.BytesIO(image_decoded))
    # resize img - size based on model being used.
    IMG_DIMS = 224



    # resize image and convert to numpy array
    pil_image = img.resize((IMG_DIMS, IMG_DIMS))
    img_arr = np.array(pil_image)

    # convert do data used by model
    img_arr = img_arr.astype('uint8')



    # apply CLAHE - Contrast Limited Adaptive Histogram Equalisation
    img_arr = clahe(img_arr)


    # apply SoG - Shades of Gray algorithm.
    img_arr = SoG(img_arr)


    # reshape img_arr to have correct dimensions wanted by ML model
    img_arr_reshaped = np.reshape(img_arr, (-1, IMG_DIMS, IMG_DIMS, 3))


    # Load model
    model = tf.keras.models.load_model('app\kevin\TL-210-effNet.h5')


    # perform prediction on preprocessed image
    pred = model.predict(img_arr_reshaped)


    # print(f'prediction made from the image itself{pred[0][0]}')

#    decide what page user is routed to upon returned response
    if pred > 0.5:
        msg = 1
    else:
        msg = 0


    #  format prediction
    pred = pred[0][0] * 100
    pred = str(pred)
    pred = pred[:5] + "%"

    return  {"msg": msg, "pred": pred}, 200



def clahe(image):
    hsv_img = cv2.cvtColor(image,cv2.COLOR_BGR2HSV)
#   Split the image to only consider value aspect of image
    h,s,v = cv2.split(hsv_img)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    v = clahe.apply(v)
    # Merge the 3 channels back together
    hsv_eq = cv2.merge([h,s,v])
    # Convert the image back to BGR format, where itll be used by the Machine Learning algorithm.
    img_bgr = cv2.cvtColor(hsv_eq,cv2.COLOR_HSV2BGR)
    return img_bgr


# Code taken from Kaggle Notebook found at following link:
# https://www.kaggle.com/code/apacheco/shades-of-gray-color-constancy
# Being used under the Apache 2.0 open license from the Kaggle Notebook
# No major modifications made to the code.
def SoG(img,power=6, gamma=None):
    """
    img (numpy array): the original image with format of (h, w, c)
    power (int): the degree of norm, 6 is used in reference paper
    gamma (float): the value of gamma correction, 2.2 is used in reference paper
    """
    img_dtype = img.dtype

    if gamma is not None:
        img = img.astype('uint8')
        look_up_table = np.ones((256,1), dtype='uint8') * 0
        for i in range(256):
            look_up_table[i][0] = 255 * pow(i/255, 1/gamma)
        img = cv2.LUT(img, look_up_table)

    img = img.astype('float32')
    img_power = np.power(img, power)
    rgb_vec = np.power(np.mean(img_power, (0,1)), 1/power)
    rgb_norm = np.sqrt(np.sum(np.power(rgb_vec, 2.0)))
    rgb_vec = rgb_vec/rgb_norm
    rgb_vec = 1/(rgb_vec*np.sqrt(3))
    img = np.multiply(img, rgb_vec)

    # Andrew Anikin suggestion
    img = np.clip(img, a_min=0, a_max=255)

    return img.astype(img_dtype)


