# flake8: noqa
from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db

#############################################################
# ROUTE FOR ALEX'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/kevin', methods=['GET', 'POST'])
def kevin():
    if request.method == 'GET' or request.method == 'POST':
        return "Kevin's App Requested"