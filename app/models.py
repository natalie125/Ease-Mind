from app import db

# Definition of the table named "User_Login" for storing user login information
# Usernames are unique, passwords are not
class User_Login(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(500), index=True, unique=True)
    password = db.Column(db.String(500))
