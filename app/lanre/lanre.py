# flake8: noqa
from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db

#############################################################
# ROUTE FOR ALEX'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/lanre', methods=['GET', 'POST'])
def lanre():
    if request.method == 'GET' or request.method == 'POST':
        return "Lanre's App Requested"