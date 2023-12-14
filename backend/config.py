# added for SQLAlchemy
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# this places the database in the home directory as app.db
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

# here we can define the binds (other databases) that will be created by the app
SQLALCHEMY_BINDS = {
    'test': 'sqlite:///' + os.path.join(basedir, 'test.db'),
}

SQLALCHEMY_TRACK_MODIFICATIONS = True

WTF_CSRF_ENABLED = True
SECRET_KEY = 'a-very-secret-secret'
