# flake8: noqa
from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db
import base64
import matplotlib.pyplot as plt
import numpy as np
import io
from PIL import Image
import tensorflow as tf
import os
#############################################################
# ROUTE FOR SHREYAS'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
file_path = os.path.abspath(os.path.join(
    'app/shreyas', 'tonsil_detector.h5'))
model = tf.keras.models.load_model(file_path)


def rescale(image):
    return image/255.0


def resize_256_by_256(image):
    return tf.image.resize(image, size=[256, 256])


def color_correct(image):
    image = tf.image.adjust_contrast(image, contrast_factor=1.5)
    image = tf.image.adjust_brightness(image, delta=0.2)
    # image = tf.cast(image, tf.float32)/255.0
    return image


def rgb_to_ycbcr(rgb_image):
    R, G, B = tf.split(rgb_image, num_or_size_splits=3, axis=-1)
    Y = 0.299 * R + 0.587 * G + 0.114 * B
    Cb = -0.169 * R - 0.331 * G + 0.5 * B + 128
    Cr = 0.5 * R - 0.419 * G - 0.081 * B + 128
    ycbcr_image = tf.stack([Y, Cb, Cr], axis=3)
    ycbcr_image = tf.squeeze(ycbcr_image, axis=-1)
    return ycbcr_image


def pipeline(image):
    image = resize_256_by_256(image)
    image = color_correct(image)
    image = rgb_to_ycbcr(image)
    image = rescale(image)
    return image


def convert_to_rgb(np_img):
    # Convert the image to 3 channels (if it is not already)
    if np_img.ndim == 2:
        np_img = np.tile(np_img[:, :, np.newaxis], [1, 1, 3])

    # Convert the image to RGB (if it is not already)
    if np_img.shape[2] > 3:
        np_img = np_img[:, :, :3]

    return np_img


def convert_to_rgb_np(img):
    np_img = np.array(img)
    np_rgb_img = convert_to_rgb(np_img)
    return np_rgb_img


def make_tensorflow_compatible(np_img):
    return np.expand_dims(np_img.astype(np.float32), axis=0)


def make_prediction(img):
    return model.predict(img)


@app.route('/shreyas', methods=['GET', 'POST'])
def shreyas():
    if request.method == 'POST':
        image = request.form['image']
        # if frontend sends no image return error
        if image == "null":
            return {"msg": "No image sent!"}, 415

        # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
        image = image[22:]
        image_decoded = base64.b64decode(image)
        img = Image.open(io.BytesIO(image_decoded))
        # Convert the PIL image object to a NumPy array with RGB channels
        np_rgb_img = convert_to_rgb_np(img)
        # Convert the image to a format compatible with TensorFlow models
        tf_img = make_tensorflow_compatible(np_rgb_img)
        tf_img_preprocessed = pipeline(tf_img)
        prediction = make_prediction(tf_img_preprocessed)
        print(prediction[0][0])
        if prediction[0][0] >= 0.5:
            msg = 1
        else:
            msg = 0
        return {"msg": msg}, 200
