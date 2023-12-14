import pytest
from app import db, models
from pathlib import Path
import datetime


@pytest.mark.unit
def test1():
    assert 5 == 5


def test_login_database():
    error0 = True
    # test that the login database can be created
    try:
        db.create_all('test')
    except Exception as e:  # noqa: F841
        error0 = False

    try:
        # test for empty email
        test_entry = models.User_Login_Test(email="", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error1 = str(e)

    try:
        # test for email without "@" symbol
        test_entry = models.User_Login_Test(email="nope", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error2 = str(e)

    try:
        # test for already taken email
        test_entry = models.User_Login_Test(email="already@taken.com", password="password")
        db.session.add(test_entry)
        test_entry = models.User_Login_Test(email="already@taken.com", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error3 = str(e)

    try:
        # test for empty password
        test_entry = models.User_Login_Test(email="Pass@email.com", password="")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error4 = str(e)

    assert (error1 == "No email provided" and error2 == 'Email address missing "@" symbol'
            and error3 == "Email is already in use" and error4 == "No password provided" and error0)
