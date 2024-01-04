import pytest
from app import app, db, models
import json
import time


#############################################################
# BEFORE RUNNING PYTESTS YOU HAVE TO MAKE SURE TESTING VARIABLE IS SET TO TRUE, OTHERWISE WE WILL WRITE TO app.db
# ^^^^^^^^^^^^^^^^^^^^^^^

@pytest.fixture()
def client():
    """
    Configures the app for testing
    :return: App for testing
    """
    client = app.test_client()
    yield client


@pytest.mark.unit
def test_register_new_client(client):
    """
    GIVEN: A POST request to the /register endpoint with login credentials
    WHEN: A user registers a new account
    THEN: A JSON with a welcome message should be generated

    Tests that we can make a POST request to the api with details and stores it in database
    """

    with client:
        mimetype = 'application/json'

        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }

        timestamp = str(int(time.time()))
        data = {
            'email': timestamp+'@gmail.com',
            'password': 'admin'
        }
        response = client.post(
            '/register', data=json.dumps(data), headers=headers)
        with app.app_context():
            assert response.status_code == 200

        models.User_Login_Test.query.filter_by(
            email=timestamp+'@gmail.com').delete()
        db.session.commit()


@pytest.mark.unit
def test_register_existing_client(client):
    """
    GIVEN: A POST request to the /register endpoint with existing login credentials
    WHEN: A user registers with an existing account
    THEN: A JSON with an error code should be returned indicating failure

    Tests that we can make a POST request to the api with details and it doesnt store in db
    """
    with client:
        mimetype = 'application/json'
        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }
        data = {
            'email': 'admin@gmail.com',
            'password': 'admin'
        }
        response = client.post(
            '/register', data=json.dumps(data), headers=headers)
        with app.app_context():
            assert response.status_code == 401
            assert response.json['msg'] == "Username taken"


@pytest.mark.unit
def test_register_missing_details(client):
    with client:
        mimetype = 'application/json'
        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }
        data = {
            'email': '',
            'password': ''
        }
        response = client.post(
            '/register', data=json.dumps(data), headers=headers)
        with app.app_context():
            assert response.status_code == 401
            assert response.json['msg'] == "One or more credentials not provided"
