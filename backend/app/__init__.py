from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from pathlib import Path
from flask_jwt_extended import JWTManager

# Globals defined here so they can be imported.
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

# Application factory based on:
# https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xv-a-better-application-structure
def create_app(testing=False):
    app = Flask(__name__)
    app.app_context().push()
    app.config.from_object('config')

    if testing:
        app.config.update({
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite://",
        })

    # If "app.py" exists in the outside folder we are in the EC2 instance and
    # we DO NOT want to include the CORS(app).
    path = Path("app.py")
    if not Path.is_file(path):
        CORS(app) # Enables CORS
        print("Running locally - CORS has been enabled.")
    else:
        print("Running on EC2 - CORS not enabled in __init__.py")

    bcrypt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    db.create_all()

    from app.endpoints import auth_bp
    app.register_blueprint(auth_bp)

    # TODO: Logging

    # Add headers to every request to prevent clickjacking, XSS, etc.
    @app.after_request
    def add_header(response):
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response

    return app

from app import models
