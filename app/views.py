from flask import request, render_template, flash, redirect, url_for
from app import app


#############################################################
# ROUTE FOR LANDING APP
# ^^^^^^^^^^^^^^^^^^^^^^^


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            # get info on the app the was requested
            app_requested = request.form['button']

            # redirect to the appropriate app
            return redirect(url_for(app_requested))

        except Exception as e:
            flash("Try again! An error occured")

    return render_template('index.html',
                           title='Larks App')


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
    return render_template('alex.html',
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

    return render_template('kevin.html',
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
            go_back()
            if page_requested == "back":
                return redirect(url_for('index'))
        except Exception as e:
            flash("Try again! An error occured")
    return render_template('lanre.html',
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
    return render_template('ramat.html',
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
    return render_template('shreyas.html',
                           title='Larks App')
