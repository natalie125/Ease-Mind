# from flask import request, render_template, flash, redirect, url_for
from flask import Flask, render_template, Response, request, flash, redirect, url_for, session
from app import app, models, bcrypt, db
import datetime
import time
import os
import sys
# import numpy as np
from threading import Thread
from .forms import LoginForm, RegisterForm # for testing login and register

#############################################################
# ROUTE FOR LANDING APP
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            # get info on the app the was requested
            app_requested = request.form['button']
            print(app_requested)
            # redirect to the appropriate app
            return redirect(url_for(app_requested))

        except Exception as e:
            flash("Try again! An error occured")

    return render_template('index.html',
                           title='Larks App')


############################################################
#ROUTE FOR LOGIN
#^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/login', methods=['GET', 'POST'])
def login():

    form = LoginForm()
    if form.validate_on_submit():
        if True:
            print("Yes")
            # get first instance of user in db
            u = models.User_Login.query.filter_by(
                email=form.email.data).first()  # we need a database first

            # check username and password
            if u:
                if bcrypt.check_password_hash(u.password, form.password.data):
                    # login_user(u)
                    return redirect(url_for('alex'))
                    print('Login Successful!', 'success')
                else:
                    # app.logger.info(u.email + " unsuccesfull login at " + now)
                    print(f'Login unsuccessful. Please check email and password', 'danger')
                    print(f'Login unsuccessful. Please check email and password')
            else:
                # logger.info("unsuccesful login")
                flash(f'Login unsuccessful. Please check email and password', 'danger')
                print(f'Login unsuccessful. Please check email and password')

    return render_template('login.html',
                            form=form,
                           title='Login')


############################################################
# ROUTE FOR REGISTER
#^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/register', methods=['GET', 'POST'])
def register():
    # if current_user.is_authenticated:   # if current user is logged in
    #     return redirect(url_for('index'))
    form = RegisterForm()

    # if form is submitted
    if form.validate_on_submit():
        # encrypt password
        hashed_password = bcrypt.generate_password_hash(form.password1.data)
        # create record
        u = models.User_Login(email=form.email.data, password=hashed_password)
        print(u)
        db.session.add(u)    # add user to db
        try:
            db.session.commit()
        except:
            db.session.rollback()     # commit user to db

        # logger.info(u.email+" created an account at " + now)
        flash(f'Account Created!', 'success')
        print(f'Account Created!')
        return redirect(url_for('login'))   # redirect to login page
    else:
        return render_template('register.html',
                                form=form,
                               title='Sign Up')


#############################################################
# ROUTE FOR LANDING APP
# ^^^^^^^^^^^^^^^^^^^^^^^


# @app.route('/', methods=['GET', 'POST'])
# def index():
#     if request.method == 'POST':
#         try:
#             # get info on the app the was requested
#             app_requested = request.form['button']
#             print(app_requested)
#             # redirect to the appropriate app
#             return redirect(url_for(app_requested))
#
#         except Exception as e:
#             flash("Try again! An error occured")
#
#     return render_template('index.html',
#                            title='Larks App')


#############################################################
# ROUTE FOR ALEX'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/alex', methods=['GET', 'POST'])
def alex():
    if request.method == 'POST':
        try:
            # check which button was clicked
            page_requested = request.form['button']

            # redirect to home page if back button was clicked
            if page_requested == "back":
                return redirect(url_for('index'))
        except Exception as e:
            flash("Try again! An error occured")
    return render_template('alex/alex.html',
                           title='Larks App')

#############################################################
# ROUTE FOR KEVIN'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/kevin', methods=['GET', 'POST'])
def kevin():
    if request.method == 'POST':
        try:
            # check which button was clicked
            page_requested = request.form['button']

            # redirect to home page if back button was clicked
            if page_requested == "back":
                return redirect(url_for('index'))
        except Exception as e:
            flash("Try again! An error occured")

    return render_template('kevin/kevin.html',
                           title='Larks App')


#############################################################
# ROUTE FOR LANRE'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/lanre', methods=['GET', 'POST'])
def lanre():
    if request.method == 'POST':
        try:
            # check which button was clicked
            page_requested = request.form['button']

            # redirect to home page if back button was clicked
            if page_requested == "back":
                return redirect(url_for('index'))
        except Exception as e:
            flash("Try again! An error occured")
    return render_template('lanre/lanre.html',
                           title='Larks App')

#
# capture = 0
# grey = 0
# neg = 0
# face = 0
# switch = 1
# rec = 0
#
#
# # make shots directory to save pics
# try:
#     os.mkdir('./shots')
# except OSError as error:
#     pass
#
# absolute_path = os.path.dirname(__file__)
# relative_path = 'saved_model/deploy.prototxt.txt'
# full_path = os.path.join(absolute_path, relative_path)
#
# model_absolute_path = os.path.dirname(__file__)
# model_relative_path = 'saved_model/res10_300x300_ssd_iter_140000.caffemodel'
# model_full_path = os.path.join(absolute_path, relative_path)
#
# # Load pretrained face detection model
# # net = cv2.dnn.readNetFromCaffe(full_path, model_full_path)
#
# # instatiate flask app
# # app = Flask(__name__, template_folder='./templates')
#
#
# camera = cv2.VideoCapture(0)
#
#
# def record(out):
#     global rec_frame
#     while (rec):
#         time.sleep(0.05)
#         out.write(rec_frame)
#
#
# def detect_face(frame):
#     global net
#     (h, w) = frame.shape[:2]
#     blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
#                                  (300, 300), (104.0, 177.0, 123.0))
#     net.setInput(blob)
#     detections = net.forward()
#     confidence = detections[0, 0, 0, 2]
#
#     if confidence < 0.5:
#         return frame
#
#     box = detections[0, 0, 0, 3:7] * np.array([w, h, w, h])
#     (startX, startY, endX, endY) = box.astype("int")
#     try:
#         frame = frame[startY:endY, startX:endX]
#         (h, w) = frame.shape[:2]
#         r = 480 / float(h)
#         dim = (int(w * r), 480)
#         frame = cv2.resize(frame, dim)
#     except Exception as e:
#         pass
#     return frame
#
#
# def gen_frames():  # generate frame by frame from camera
#     global out, capture, rec_frame
#     while True:
#         success, frame = camera.read()
#         if success:
#             # if (face):
#             #     frame = detect_face(frame)
#             if (grey):
#                 frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#             if (neg):
#                 frame = cv2.bitwise_not(frame)
#             if (capture):
#                 capture = 0
#                 now = datetime.datetime.now()
#                 p = os.path.sep.join(
#                     ['shots', "shot_{}.png".format(str(now).replace(":", ''))])
#                 cv2.imwrite(p, frame)
#
#             if (rec):
#                 rec_frame = frame
#                 frame = cv2.putText(cv2.flip(
#                     frame, 1), "Recording...", (0, 25), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 4)
#                 frame = cv2.flip(frame, 1)
#
#             try:
#                 ret, buffer = cv2.imencode('.jpg', cv2.flip(frame, 1))
#                 frame = buffer.tobytes()
#                 yield (b'--frame\r\n'
#                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
#             except Exception as e:
#                 pass
#
#         else:
#             pass
#
#
# @app.route('/video_feed')
# def video_feed():
#     return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
#
#
# @app.route('/requests', methods=['POST', 'GET'])
# def tasks():
#     global switch, camera
#     if request.method == 'POST':
#         if request.form.get('click') == 'Capture':
#             global capture
#             capture = 1
#         elif request.form.get('grey') == 'Grey':
#             global grey
#             grey = not grey
#         elif request.form.get('neg') == 'Negative':
#             global neg
#             neg = not neg
#         elif request.form.get('face') == 'Face Only':
#             global face
#             face = not face
#             if (face):
#                 time.sleep(4)
#         elif request.form.get('stop') == 'Stop/Start':
#
#             if (switch == 1):
#                 switch = 0
#                 camera.release()
#                 cv2.destroyAllWindows()
#
#             else:
#                 # camera = cv2.VideoCapture(0)
#                 switch = 1
#         elif request.form.get('rec') == 'Start/Stop Recording':
#             global rec, out
#             rec = not rec
#             if (rec):
#                 now = datetime.datetime.now()
#                 fourcc = cv2.VideoWriter_fourcc(*'XVID')
#                 out = cv2.VideoWriter('vid_{}.avi'.format(
#                     str(now).replace(":", '')), fourcc, 20.0, (640, 480))
#                 # Start new thread for recording the video
#                 thread = Thread(target=record, args=[out, ])
#                 thread.start()
#             elif (rec == False):
#                 out.release()
#
#     elif request.method == 'GET':
#         return render_template('lanre/lanre.html')
#     return render_template('lanre/lanre.html')
#
#
# #############################################################
# # ROUTE FOR RAMAT'S APP
# # ^^^^^^^^^^^^^^^^^^^^^^^
#
#
# @app.route('/ramat', methods=['GET', 'POST'])
# def ramat():
#     if request.method == 'POST':
#         try:
#             # check which button was clicked
#             page_requested = request.form['button']
#
#             # redirect to home page if back button was clicked
#             if page_requested == "back":
#                 return redirect(url_for('index'))
#         except Exception as e:
#             flash("Try again! An error occured")
#     return render_template('ramat/ramat.html',
#                            title='Larks App')
#
#
# #############################################################
# # ROUTE FOR SHREYAS' APP
# # ^^^^^^^^^^^^^^^^^^^^^^^
#
#
# @app.route('/shreyas', methods=['GET', 'POST'])
# def shreyas():
#     if request.method == 'POST':
#         try:
#             # check which button was clicked
#             page_requested = request.form['button']
#
#             # redirect to home page if back button was clicked
#             if page_requested == "back":
#                 return redirect(url_for('index'))
#         except Exception as e:
#             flash("Try again! An error occured")
#     return render_template('shreyas/shreyas.html',
#                            title='Larks App')
