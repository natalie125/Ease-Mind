# from flask import request, render_template, flash, redirect, url_for
from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db
import datetime
import time
import os
import sys
import json
# import numpy as np
from threading import Thread
from .forms import LoginForm, RegisterForm  # for testing login and register
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from datetime import datetime, timedelta, timezone
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
#############################################################
# ROUTE FOR LANDING PAGE
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
# ROUTE FOR LOGIN - FOR TESTING
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        print("Request is POST!")
        print(request.data)
        # to convert byte data into utf characters
        data = json.loads(request.data.decode('utf-8'))



        print(data)
        print(data.get('credentials'))
        
        # flash(request)
        # return {"type": "POST"}
        u = models.User_Login.query.filter_by(
            email=data['credentials']['email']).first()
        # check username and password
        if u:
            if bcrypt.check_password_hash(u.password, data['credentials']['password']):
                # response = {"token": "test123"}
                print('Login Successful!', 'success')
                access_token = create_access_token(identity=data['credentials']['email'])
                print(access_token)
                response = {"token": access_token}
                return jsonify(response), 200
            else:
                print("Wrong Password")
                response = {"msg": "Bad Password"}
                return jsonify(response), 401

        else:
            print("Wrong username")
            response = {"msg": "Bad Username"}
            return jsonify(response), 401

    elif request.method == "GET":
        return {"type": "GET"}
    else:
        # app.logger.info(u.email + " unsuccesfull login at " + now)
        flash(f'Login unsuccessful. Please check email and password', 'danger')
        print(f'Login unsuccessful. Please check email and password!')
        response = {"msg": "Login unsuccessful"}
        return jsonify(response), 401

    # form = LoginForm()
    # if form.validate_on_submit():  # will need to remove when we implement backend API
    #     if True:
    #         print("Yes")
    #         # get first instance of user in db
    #         u = models.User_Login.query.filter_by(
    #             email=form.email.data).first()

    #         # check username and password
    #         if u:
    #             if bcrypt.check_password_hash(u.password, form.password.data):
    #                 # login_user(u)
    #                 # testing - redirect to alex route to check login works
    #                 response = {"token": "test123"}
    #                 print('Login Successful!', 'success')
    #                 return jsonify(response)
    #                 # return redirect(url_for('alex'))
    #                 # TODO: log something on the server side here

    #             else:
    #                 # app.logger.info(u.email + " unsuccesfull login at " + now)
    #                 flash(
    #                     f'Login unsuccessful. Please check email and password', 'danger')
    #                 print(f'Login unsuccessful. Please check email and password')
    #         else:
    #             # logger.info("unsuccesful login")
    #             flash(f'Login unsuccessful. Please check email and password', 'danger')
    #             print(f'Login unsuccessful. Please check email and password')

    # return render_template('login.html',
    #                        form=form,
    #                        title='Login')


############################################################
# ROUTE FOR REGISTER - FOR TESTING
# ^^^^^^^^^^^^^^^^^^^^^^^
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
        # add user to db
        db.session.add(u)
        try:
            db.session.commit()
        except:
            db.session.rollback()     # commit user to db

        flash(f'Account Created!', 'success')
        print(f'Account Created!')
        return redirect(url_for('login'))   # redirect to login page
    else:
        return render_template('register.html',
                               form=form,
                               title='Sign Up')


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


#############################################################
# ROUTE FOR RAMAT'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/ramat', methods=['GET', 'POST'])
def ramat():
    if request.method == 'POST':
        try:
            # check which button was clicked
            page_requested = request.form['button']

            # redirect to home page if back button was clicked
            if page_requested == "back":
                return redirect(url_for('index'))
        except Exception as e:
            flash("Try again! An error occured")
    return render_template('ramat/ramat.html',
                           title='Larks App')


#############################################################
# ROUTE FOR SHREYAS' APP
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/shreyas', methods=['GET', 'POST'])
def shreyas():
    if request.method == 'POST':
        try:
            # check which button was clicked
            page_requested = request.form['button']

            # redirect to home page if back button was clicked
            if page_requested == "back":
                return redirect(url_for('index'))
        except Exception as e:
            flash("Try again! An error occured")
    return render_template('shreyas/shreyas.html',
                           title='Larks App')
