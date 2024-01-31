import os
import pytest
from flask_sqlalchemy import SQLAlchemy
from app import db, models, bcrypt, create_app

@pytest.fixture
def app():
    app = create_app(testing=True)

    hashed_password = bcrypt.generate_password_hash("admin")
    admin = models.Users(email="admin@gmail.com", password=hashed_password)
    db.session.add(admin)
    db.session.commit()

    yield app

    db.session.remove()
    db.drop_all()

