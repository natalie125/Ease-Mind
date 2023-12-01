'''
This forms in this file are to be used to test login and register
'''
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms import PasswordField
from wtforms import BooleanField
from wtforms import ValidationError
from app import models
from wtforms.validators import InputRequired, EqualTo, Email


# login form
class LoginForm(FlaskForm):
    email = StringField('email', validators=[InputRequired()])
    password = PasswordField('password', validators=[InputRequired()])
    remember = BooleanField('Remember Me')


# sign up form
class RegisterForm(FlaskForm):
    # name = StringField('name', validators=[InputRequired(), Regexp("^([^0-9]*)$",
    #   message = "Name cannot contain digits")])
    # username = StringField('username', validators=[InputRequired(), Length(min=2, max=20)])
    email = StringField('email', validators=[InputRequired(), Email()])
    password1 = PasswordField('password1', validators=[InputRequired()])
    password2 = PasswordField('password2', validators=[EqualTo('password1'), InputRequired()])  # makes sure password1 equals password2

    # validate username
    def validate_email(self, email):
        # Strip trailing spaces from the email input
        email.data = email.data.strip()
        # get first instance of this username in the database
        # changer "User" to model name
        user = models.User_Login.query.filter_by(email=email.data).first()

        # if username found in database, raise error
        if user:
            raise ValidationError('email is already taken')