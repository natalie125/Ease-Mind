import base64
import os
import time
from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db

#############################################################
# ROUTE FOR LANRE'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
# @app.route('/lanre', methods=['GET', 'POST'])
# def lanre():
#     # if request.method == 'GET' or request.method == 'POST':
#     #     return "Lanre's App Requested"

# #############################################################
# # ROUTE SIMPLY PROVIDING A PROOF OF CONCEPT OF UPLOADING IMAGES TO SERVER
# # CURRENTLY SAVES IMAGE TO SHOTS FOLDER, BUT I IMAGINE WE DONT WANT TO DO THAT AND ONLY WANT TO PROCESS IMAGES
# # ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/dipstik/upload', methods=['POST'])
def dipstick_image_upload():
    # if request.method == 'GET' or request.method == 'POST':
    #     return "Lanre's App Requested"
    
    image = request.form['image']
    # if frontend sends no image return error
    if image == "null":
        return {"msg": "No image sent!"}, 415

    # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
    image = image[22:]
    image_decoded = base64.b64decode(image)

    # gets string of curr time and names file that
    timestamp = str(int(time.time()))
    filename = timestamp+".png"

    # saves decoded base 64 string to that image
    with open(os.path.join("app/lanre/shots", filename), "wb") as f:
        f.write(image_decoded)
    return {"msg": "image successfully saved in server!"}, 200




@app.route('/dipstik/model', methods=['POST'])
def dipstick_model():
    image = request.form['image']
    # if frontend sends no image return error
    if image == "null":
        return {"msg": "No image sent!"}, 415

    # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
    image = image[22:]
    image_decoded = base64.b64decode(image)

    # gets string of curr time and names file that
    timestamp = str(int(time.time()))
    filename = timestamp+".png"

    # saves decoded base 64 string to that image
    with open(os.path.join("shots", filename), "wb") as f:
        f.write(image_decoded)
    return {"msg": "image successfully saved in server!"}, 200