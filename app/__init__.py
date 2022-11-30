from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# define the app
app = Flask(__name__)

# added to fix RuntimeError: Working outside of application context.
app.app_context().push()

# read configuration from config.py file
app.config.from_object('config')

# define the database
db = SQLAlchemy(app)

# helps us handle migrations
migrate = Migrate(app, db)

# import these python files from /app directory
from app import views, models
