from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
# define the app
app = Flask(__name__)

# added for hashing the passwords
bcrypt = Bcrypt(app)

# added to fix RuntimeError: Working outside of application context.
app.app_context().push()

# read configuration from config.py file
app.config.from_object('config')

# define the database
db = SQLAlchemy(app)

# helps us handle migrations
migrate = Migrate(app, db)

CORS(app)

# import these python files from /app directory
from app import views, models
