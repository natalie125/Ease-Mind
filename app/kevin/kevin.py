from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db
import base64
import matplotlib.pyplot as plt
import numpy as np
import io
from PIL import Image
import tensorflow as tf
from sklearn import model_selection
import os
import pandas as pd


#############################################################
# ROUTE FOR Kevin's APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/kevin', methods=['GET', 'POST'])
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
    # resize img
    pil_image = img.resize((128, 128))
    # convert PIL to np.array
    img_arr = np.array(pil_image)

    # reshape img_arr to have correct dimensions wanted by ML model
    img_arr_reshaped = np.reshape(img_arr, (-1, 128, 128, 3))
    model = tf.keras.models.load_model('app\kevin\model_no_augment.h5')
    pred = model.predict(img_arr_reshaped)

    print(f'prediction made from the image itself{pred}')
    if (pred > 0.5):
        msg = 1
    else:
        msg = 0
    return  {"msg": msg}, 200
    



