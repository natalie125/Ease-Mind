import pytest
from app import db
from app.models import Users
from pathlib import Path
import datetime

@pytest.mark.unit
def test_users_table_empty_email(app):
    try:
        test_entry = Users(email="", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        error = str(e)
    assert(error == "No email provided")

@pytest.mark.unit
def test_user_table_invalid_email(app):
    try:
        test_entry = Users(email="invalidemail.com", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        error = str(e)
    assert(error == 'Email address missing "@" symbol')

@pytest.mark.unit
def test_user_table_duplicate_email(app):
    try:
        test_entry = Users(email="is@taken.com", password="password")
        db.session.add(test_entry)
        test_entry = Users(email="is@taken.com", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        error = str(e)
    assert(error == "Email is already in use")

@pytest.mark.unit
def test_user_table_empty_password(app):
    try:
        test_entry = Users(email="valid@email.com", password="")
        db.session.add(test_entry)
    except AssertionError as e:
        error = str(e)
    assert(error == "No password provided")
