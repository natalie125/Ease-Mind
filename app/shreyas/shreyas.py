from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db

#############################################################
# ROUTE FOR ALEX'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/shreyas', methods=['GET', 'POST'])
def shreyas():
    if request.method == 'GET' or request.method == 'POST':
        return "Shreyas's App Requested"