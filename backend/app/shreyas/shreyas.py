# flake8: noqa
from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify, current_app
from app import models, bcrypt, db
import base64
import matplotlib.pyplot as plt
import numpy as np
import io
from PIL import Image
import tensorflow as tf
import os
import cv2
from flask_jwt_extended import jwt_required

file_path = os.path.abspath(os.path.join(
    'app/shreyas', 'tonsil_detector.h5'))
model = tf.keras.models.load_model(file_path)


def rescale(image):
    return image.astype('float32')/255.0


def resize_image(image_np, new_size):
    resize_image = cv2.resize(image_np, new_size)
    return resize_image


def convert_to_grayscale(images_np):
    gray_np = cv2.cvtColor(images_np, cv2.COLOR_BGR2GRAY)
    return gray_np


def apply_gaussian_blur(images_np):
    # second argument is kernel size. Larger the kernel size means wider distribution of weights
    # third argument is sigma - larger the sigma the more spread out the blur effect. Pixels far away have greater influence on final output
    # A larger kernel size can help to smooth out larger features in the image, while a larger sigma value can help to remove finer details and noise
    blurred_image_np = cv2.GaussianBlur(images_np, (7, 7), 15)
    return blurred_image_np


def calculate_gradient_mag_using_canny(grayscale_np, lower_thresh=0, upper_thresh=0):
    # second argument - grad mag threshold. Any edge with grad mag lower than this is discarded as weak edges
    # third argument - grad mag threshold but any edge with grad mag higher considered as strong edges
    grayscale_np = grayscale_np.astype(np.uint8)
    edges_np = cv2.Canny(grayscale_np, lower_thresh, upper_thresh)
    return edges_np


def get_circles_from_edges(edges, min_radius=0, max_radius=100):
    # first argument is the binary image of edges
    # Second argument is variation of hough transform -
    # variants include cv2.HOUGH_STANDARD, cv2.HOUGH_PROBABALISTIC, cv2.HOUGH_GRADIENT
    # third argument is resolution of accumulator array - represents ratio between image resolution and resolution of accumulator array - determines granularity of search - smaller leads to more finer search
    # fourth argument is the minimum distance between centers of detected circles
    # param1 is the higher threshold for the canny edge detector
    # fourth argument is Min and max radius of circles found
    circles = cv2.HoughCircles(edges, cv2.HOUGH_GRADIENT, 1, 20,
                               param1=50, param2=30, minRadius=min_radius, maxRadius=max_radius)

    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        distances = np.sqrt(
            (circles[:, 0] - edges.shape[1]/2)**2 + (circles[:, 1] - edges.shape[0]/2)**2)
        sorted_circles = circles[np.argsort(distances)]
        sorted_circles = np.expand_dims(sorted_circles, axis=0)
        return sorted_circles

    return circles


def crop_image(image_np, circle):
    square_size = circle[2] * 2
    x_start = circle[0]-circle[2]
    y_start = circle[1] - circle[2]
    cropped = image_np[y_start: y_start +
                       square_size, x_start:x_start+square_size]
    return cropped


def create_and_apply_circle_mask(image_np, circles):
    if circles is not None:
        circle = circles[0][0]
        mask = np.zeros(image_np.shape[:2], dtype=np.uint8)
        cv2.circle(mask, (circle[0], circle[1]),
                   circle[2], (255, 255, 255), -1)
        circle_result = cv2.bitwise_and(image_np, image_np, mask=mask)
        result = crop_image(circle_result, circle)
    else:
        result = np.zeros_like(image_np)
    return result


def pipeline(image):
    blurred_np = apply_gaussian_blur(image)
    gray_np = convert_to_grayscale(blurred_np)
    grad_mag_np = calculate_gradient_mag_using_canny(gray_np, 0, 5)
    circles = get_circles_from_edges(grad_mag_np, 70, 100)
    cropped_image_np = create_and_apply_circle_mask(image, circles)
    image = resize_image(cropped_image_np, (256, 256))
    image = rescale(image)
    return image


def convert_to_rgb_np(img):
    img = img.resize((256, 256))
    np_img = np.array(img)
    np_img = np_img[:, :, :3]
    return np_img


def make_tensorflow_compatible(np_img):
    np_img = np.expand_dims(np_img.astype(np.float32), axis=0)
    return np_img


def decode_image_json(image):
    # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
    image = image[22:]
    image_decoded = base64.b64decode(image)
    img = Image.open(io.BytesIO(image_decoded))
    return img


#############################################################
# GIVEN AN INPUT OF AN IMAGE, RETURNS A BINARY VALUE OF THE SCORE GIVEN BY THE MODEL WHETHER ITS TONSILLITIS OR NOT
# ^^^^^^^^^^^^^^^^^^^^^^^

@current_app.route('/shreyas', methods=['GET', 'POST'])
@jwt_required()
def shreyas():
    if request.method == 'POST':
        image = request.form['image']
        # if frontend sends no image return error
        if image == "null":
            return {"msg": "No image sent!"}, 415
        img = decode_image_json(image)
        # Convert the PIL image object to a NumPy array with RGB channels
        np_rgb_img = convert_to_rgb_np(img)
        np_processed_img = pipeline(np_rgb_img)
        # Convert the image to a format compatible with TensorFlow models
        tf_img = make_tensorflow_compatible(np_processed_img)
        prediction = model.predict(tf_img)
        print(prediction[0][0])
        if prediction[0][0] >= 0.5:
            msg = 1
        else:
            msg = 0
        return {"msg": msg}, 200
