import os
import pytest
from flask_sqlalchemy import SQLAlchemy
from app import db, models, bcrypt, create_app

# TODO: This
# https://stackoverflow.com/questions/75523569/runtimeerror-a-sqlalchemy-instance-has-already-been-registered-on-this-flask

@pytest.fixture
def app():
    #basedir = os.path.abspath(os.path.dirname(__file__))
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'test.db')
    #db = SQLAlchemy(app)
    #db.create_all()
    app = create_app(testing=True)

    hashed_password = bcrypt.generate_password_hash("admin")
    admin = models.Users(email="admin@gmail.com", password=hashed_password)
    db.session.add(admin)
    db.session.commit()

    yield app

    db.session.remove()
    db.drop_all()
    #os.remove('./test.db')

