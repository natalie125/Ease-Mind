# added for SQLAlchemy
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# this places the database in the home directory as app.db
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

SQLALCHEMY_TRACK_MODIFICATIONS = True

WTF_CSRF_ENABLED = True
# TODO: Add a secrets file!!
SECRET_KEY = 'a-very-secret-secret'
JWT_SECRET_KEY = 'super-duper-secret'
