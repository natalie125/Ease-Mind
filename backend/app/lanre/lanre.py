# flake8: noqa
from flask import request, jsonify
from app import models, bcrypt, db
from app.endpoints import auth_bp
import base64
import os
import time
import cv2
import numpy as np
from matplotlib import pyplot as plt
import time
from PIL import Image
from rembg import remove
import json
from flask_jwt_extended import jwt_required
# instructions
# add opencv to flask - pip install opencv-python
# add rembg to flask - pip install rembg
#

#############################################################
# ROUTE FOR LANRE'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
# @app.route('/lanre', methods=['GET', 'POST'])
# def lanre():
#     # if request.method == 'GET' or request.method == 'POST':
#     #     return "Lanre's App Requested"
#############################################################
# THIS ROUTE ALLOWS THE SAVING OF TRAINING DATA FOR THE OBJECT DETECTION MODEL
# ^^^^^^^^^^^^^^^^^^^^^^^
# @app.route('/lanre/training_data', methods=['POST'])
# def create_training_data():
#     image = request.form['image']
#     # if frontend sends no image return error
#     if image == "null":
#         return {"msg": "No image sent!"}, 415

#     # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
#     image = image[22:]
#     image_decoded = base64.b64decode(image)

#     # gets string of curr time and names file that
#     timestamp = str(int(time.time()))
#     filename = timestamp+".jpeg"

#     # saves decoded base 64 string to that image
#     with open(os.path.join("app/lanre/model_versions/dataset/training/", filename), "wb") as f:
#         f.write(image_decoded)


#     # read decoded image
#     current_dir = os.getcwd()
#     submitted_folder = current_dir + '/app/lanre/model_versions/dataset/training/'
#     image_path = submitted_folder + filename
#     im = Image.open(image_path) # read in image

#     im = im.convert("RGB")
#     # im.save(f"converted-{filename}", "JPEG")

#     im.save(f"/Users/lanresodeinde/Desktop/final_year_app/backend/app/lanre/model_versions/dataset/training/{filename}", "JPEG")

#     # im = Image.fromarray(image_decoded)
#     return {"msg": "image successfully saved in server!"}, 200



#############################################################
# THIS ROUTE ALLOW THE SAVING OF IMAGES FOR THE REFERNCE CHART
# FOR CROPPING AND EXTRACTING COLOURS FROM REFERENCE CHART
# ^^^^^^^^^^^^^^^^^^^^^^^
# @app.route('/lanre/reference_chart', methods=['POST'])
# def reference_chart():
#     print("Saving reference image...")
#     image = request.form['image']
#     # if frontend sends no image return error
#     if image == "null":
#         return {"msg": "No image sent!"}, 415

#     # removes header of base 64 encoded string i.e. first 22 chars and decodes the rest
#     image = image[22:]
#     image_decoded = base64.b64decode(image)
#     print("Getting time stamp...")
#     # gets string of curr time and names file that
#     timestamp = str(int(time.time()))
#     filename = timestamp+".png"

#     # saves decoded base 64 string to that image
#     with open(os.path.join("app/lanre/reference_chart/squares_from_camera2", "image2.png"), "wb") as f:
#         f.write(image_decoded)
#     print("Saved image...")

#     return {"msg": "image successfully saved in server!"}, 200



# #############################################################
# # THE MAIN ROUTE THAT HANDLES THE PREPROCESSING OF DETA AND RETURNING THE RESULT
# # ^^^^^^^^^^^^^^^^^^^^^^^
@auth_bp.route('/lanre', methods=['GET', 'POST'])
def dipstick_image_upload():
    if request.method == "POST":
        # if request.method == 'GET' or request.method == 'POST':
        #     return "Lanre's App Requested"

        image = request.form['image']

        email = request.form['email']
        print(email)
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
        with open(os.path.join("app/lanre/submitted_images", "image.png"), "wb") as f:
            f.write(image_decoded)
        print("Decoded")

        # variables
        current_dir = os.getcwd()
        submitted_folder = current_dir + '/app/lanre/submitted_images/'
        image_path = submitted_folder+ 'image.png'

        # remove background
        pillow_image = remove_background(image_path)
        cropped_image = np.array(pillow_image) # convert image back to numpy array
        cropped_image = cv2.cvtColor(cropped_image,cv2.COLOR_RGB2HSV)
        print("Background removed!")
        print(type(cropped_image))
        save_image_to_file(cropped_image)
        print("Cropped Image saved!")

        # slice image
        sliced_image = slice_image(cropped_image)
        save_image_to_file(sliced_image)
        print("Sliced Image saved!")

        # resize image
        resized_image = resize_image_dimensions(sliced_image)
        save_image_to_file(resized_image)
        print("Resized Image saved!")

        # draw rectangles and extract colour
        draw_rectangles_and_extract_colours(resized_image)
        save_image_to_file(resized_image)
        print("Rectangles drawn and colors extracted!")

        # check diagnoses
        diagnoses = check_dipstick(extracted_colours, reference_chart)
        print(diagnoses)

        # check that the user has an at dipstick email
        # if they do they are testing the app, save their results for evaluation
        if "@dipstik.com" in email:
            # save diagnosis user is doing evaluation
            save_diagnoses_result(email, diagnoses)

        return jsonify(diagnoses), 200
        # return {"msg": 1}, 200

# TODO: For debugging purposed - Remove later
def save_image_to_file(image):
    # saves to directory decoded base 64 string to that image
    im = Image.fromarray(image)
    im.save("/Users/lanresodeinde/Desktop/final_year_app/backend/app/lanre/submitted_images/output.png")
    # with open(os.path.join("app/lanre/shots", "output.png"), "wb") as f:
    #     f.write(image)


# define function to remove backgroup from dipstick using rembg
def remove_background(image_path):
    input = Image.open(image_path) # read in image
    output = remove(input) # crop backgroud using the remove function
    return output

# pillow_image = remove_background(image)
# cropped_image = np.array(pillow_image) # convert image back to numpy array


# Define function to crop out all the white space in the background
# Slice dipstick image with background removed to just the dipstick
def slice_image(image):
    # Convert image to grayscale
    h, s, v = cv2.split(image)
    gray = v

    # Apply threshold to the image
    ret, thresh = cv2.threshold(gray,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)

    # Find contours in the image
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    # print how many contours were found
    print(len(contours))

    # Iterate through the contours and select the one that corresponds to the dipstick
    for cnt in contours:
        # print("found")
        x, y, w, h = cv2.boundingRect(cnt)
        if x != 0 and y !=0:
            print(x,y, w, h)
            break

    # use these values obtained to slice out only the dipstick
    image_sliced = image[y:y+h, x:x+w]
    return image_sliced

# sliced_image = slice_image(cropped_image)


# resize image dimensions
def resize_image_dimensions(image):
    # set dimensions
    dim = (30, 475)
    # resize image
    resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
    return resized
# resized_image = resize_image_dimensions(sliced_image)


# extract colours from pad
parameter_names = ['leukocytes', 'nitrite', 'urobilinogen', 'protein', 'ph', 'blood', 'specific_gravity', 'ketones', 'bilirubin', 'glucose']

# variable to save the colours extracted on the pad
extracted_colours = {}

# fucntion for extracting colour from a specific point on the pad
def extract_colour(image, x1, y1, x2, y2):
    # extract colour from the middle of the square that is drawn on the pad
    midpoint_x = round((x1+x2)/ 2)
    midpoint_y = round((y1+y2) / 2)
    colour_on_pad = image[midpoint_y,midpoint_x]
    print(colour_on_pad)
    return colour_on_pad


# function for drawing the rectangles and extracting colours
def draw_rectangles_and_extract_colours(image):
    # variable of keeping track of the values we have added to the dictionary
    # increment after drawing on each pad
    index = 0

    # draw_rectangle on the first pad
    x1,y1 = 10,10
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the second pad
    x1,y1 = 10,40
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the third pad
    x1,y1 = 10,75
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the fourth pad
    x1,y1 = 10,105
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the fifth pad
    x1,y1 = 10,140
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the sixth pad
    x1,y1 = 10,170
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the seventh pad
    x1,y1 = 10,205
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the eighth pad
    x1,y1 = 10,235
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the ninth pad
    x1,y1 = 10,270
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # draw_rectangle on the tenth pad
    x1,y1 = 10,300
    x2,y2 = x1+10, y1+10
    rectangle = cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    colour = extract_colour(image, x1, y1, x2, y2)
    extracted_colours[parameter_names[index]] = colour
    index+=1

    # fig = plt.figure()
    # fig.add_subplot(1,1,1)
    # plt.imshow(rectangle)

# draw_rectangles_and_extract_colours(resized_image)

# compare colours to reference chart
reference_chart = {
    'leukocytes' : {
        'neg': [16,  75, 209],
        'trace': [15,  85, 213],
        '+70': [173,  50, 209],
        '++125':[167,  79, 163],
        '+++500': [154,  81, 139],
    },

    'nitrite' : {
    'neg': [21,  77, 204],
    'trace': [171,  46, 208],
    'pos': [166, 163, 165],
    },

    'urobilinogen': {
        '0.1'  : [14, 135, 202],
        '1' : [  3,  95, 203],
        '2' : [  1, 116, 189],
        '4' : [  1, 138, 195],
        '8' : [176, 158, 190],
    },
    'protein' :{
        'neg': [ 28, 146, 186],
        'trace': [ 34, 140, 172],
        '+30': [ 47,  98, 159],
        '++100':[ 44, 119, 135],
        '+++300': [ 63,  96, 128],
        '++++1000':[ 8, 134, 126],
    },
    'ph' : {
        '5'  : [ 13, 175, 200],
        '6': [ 20, 193, 203],
        '6.5' : [ 22, 179, 162],
        '7' : [ 34, 153, 143],
        '7.5' : [ 45, 141,  114],
        '8' : [ 72, 154,  96],
        '8.5' : [ 92, 173,  87],
    },
    'blood' : {
        'neg': [ 18, 210, 194],
        'trace': [ 23, 190, 166],
        '+25': [ 35, 138, 110],
        '++80':[ 48, 111, 108],
        '+++200':[ 78, 188,  57],
        'non_hemolysis+10': [ 27, 143, 176],
        '++80_rbc': [ 32, 135, 165],
    },
    'specific_gravity' :{
        '1.000': [ 90, 196,  61],
        '1.005': [ 84, 109,  74],
        '1.010': [54, 73, 83],
        '1.015': [ 39, 138, 101],
        '1.020': [ 28, 163, 117],
        '1.025' : [ 23, 205, 148],
        '1.030' : [ 20, 229, 169],
    },
    'ketones' : {
        'neg': [10,  70, 188],
        '+5': [6,  76, 188],
        '+15': [173,  97, 173],
        '++40': [169, 127, 104],
        '+++80': [169, 209,  77],
        '++++160': [164, 196, 74],
    },
    'bilirubin' : {
        'neg'  : [19,  85, 207],
        '+': [15, 96, 195],
        '++' : [12, 107, 182],
        '+++' : [3, 97, 174],
    },
    'glucose': {
        'neg' :[ 90, 117, 155],
        '+100': [ 70,  94, 127],
        '+250': [ 48, 116, 147],
        '++500' : [ 28, 135,  96],
        '+++1000': [ 12, 145, 105],
        '++++2000':[5, 206,  56],
    }
}

# # function for calculting the distance between the two colours
def eucledian_distance(extracted, reference):
    ed = (extracted[0] - reference[0])**2  + (extracted[1] - reference[1])**2 + (extracted[2] - reference[2])**2
    return ed

# this function takes the colour on one pad and the dictionary containing the reference colour for that pad and returns closest match
def check_parameter(colour_on_pad, reference_colours_for_pad):
    # define the variables
    ed = 0 # keep tract of eucledian disances
    lowest = '' # keeps track of lowest eucledian distance
    closest_match = '' # used to return the closest match

    # loop through the colours in the reference pads
    for parameter_name in reference_colours_for_pad:
        # get the reference colour for a particular pad
        colour = reference_colours_for_pad.get(parameter_name)

        # calculate eucledian distance between colour on pad and reference colour
        ed = eucledian_distance(colour_on_pad, colour)

        # find out which colour is the closest match
        # set lowest to the first comparison
        if lowest == '':
            lowest = ed
            closest_match = parameter_name

        # if a smaller value is found, update values
        if ed < lowest:
            lowest = ed
            closest_match = parameter_name

    return closest_match


# check the whole dipstick
def check_dipstick(extracted_colours,reference_chart):
    diagnoses = {}

    # check each value in the dipstick
    for parameter_name in extracted_colours:
        result = check_parameter(extracted_colours.get(parameter_name), reference_chart.get(parameter_name))
        diagnoses[parameter_name] = result

    return diagnoses

diagnoses = check_dipstick(extracted_colours, reference_chart)

# # get diagnoses
# print(diagnoses)


# Function used to save diagnosis result if a user decides to do an evaluation
def save_diagnoses_result(email, diagnoses):
    print("Saving user evaluation result...")
    print(diagnoses)
    print(email)
    # Remove the quotes using strip method
    email = email.strip('"')

    # added user's email
    user_diagnoses = {'email': email,
                      'results' : diagnoses}


    # read the contents of the file
    with open("app/lanre/submitted_images/user_evaluation_results.json", "r") as file:
        file_data = json.load(file)

    # append new diagnoses
    file_data.append(user_diagnoses)

    # write updated diagnosis to file
    with open("app/lanre/submitted_images/user_evaluation_results.json", "w") as file:
        # file.seek(0)
        json.dump(file_data, file, indent = 4)

    print("Saving user evaluation result... completed...")
