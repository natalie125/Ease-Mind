from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db

#############################################################
# ROUTE FOR ALEX'S APP
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/canopy', methods=['GET', 'POST'])
def canopy():
    if request.method == 'GET':
        return "Canopy Requested"