# flake8: noqa

from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db

#############################################################
# ROUTE FOR ALEX'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/ramat', methods=['GET', 'POST'])
def ramat():
    if request.method == 'GET' or request.method == 'POST':
        return "Ramat's App has been Requested"