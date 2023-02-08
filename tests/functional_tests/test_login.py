import pytest
from app import app
from app import db, models
import json


@pytest.fixture()
def client():
    """
    Configures the app for testing
    :return: App for testing
    """
    client = app.test_client()
    yield client


@pytest.mark.functional
def test_GET_request(client):
    """
    GIVEN: A GET request to the / endpoint
    WHEN: A user visits the application
    THEN: A JSON with a welcome message should be generated

    Tests that we can make a GET request to the api
    """
    response = client.get('/')
    assert response.status_code == 200
    response2 = client.post('/')
    assert response2.status_code == 200


@pytest.mark.functional
def test_GET_request_to_login_route(client):
    """
    GIVEN: A GET request to the /login endpoint
    WHEN: A GET request is made
    THEN: A JSON with a message should be generated along with a 405 method not allowed code

    Tests that we cannot make a GET request to the api
    """
    response = client.get('/login')
    assert response.status_code == 405
    assert response.json['type'] == 'GET'


@pytest.mark.functional
def test_token_generated(client):
    """
    GIVEN: A valid username and valid password
    WHEN: A post request is made to the login route
    THEN: A token should be generated and returned

    Make a post request with valid credentials to the app,
    a token should be returneed
    """
    with client:
        mimetype = 'application/json'

        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }

        data = {
            'credentials': {
                'email': 'admin@gmail.com',
                'password': 'admin'
            }
        }

        url = '/login'

        response = client.post(url, data=json.dumps(data), headers=headers)

        assert response.status_code == 200
        assert response.json['token'] != ''


@pytest.mark.functional
def test_incorrect_email(client):
    """
    GIVEN: A incorrect email and valid password
    WHEN: A post request is made to the login route
    THEN: A token should be not generated. A 401 error should be returned

    Make a post request with invalid credentials to the app,
    a token should not be returned
    """
    with client:
        mimetype = 'application/json'

        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }

        data = {
            'credentials': {
                'email': 'ad@gmail.com',
                'password': 'admin'
            }
        }

        url = '/login'

        response = client.post(url, data=json.dumps(data), headers=headers)

        # assert a success response code and message
        assert response.status_code == 401
        assert response.json['msg'] == 'Bad Username'


@pytest.mark.functional
def test_incorrect_password(client):
    """
    GIVEN: A correct email and incorrect password
    WHEN: A post request is made to the login route
    THEN: A token should be not generated. A 401 error should be returned

    Make a post request with invalid credentials to the app,
    a token should not be returned
    """
    with client:
        mimetype = 'application/json'

        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }

        data = {
            'credentials': {
                'email': 'admin@gmail.com',
                'password': 'a'
            }
        }

        url = '/login'

        response = client.post(url, data=json.dumps(data), headers=headers)

        # assert a failure response code and message
        assert response.status_code == 401
        assert response.json['msg'] == 'Bad Password'


@pytest.mark.functional
def test_incorrect_credentials(client):
    """
    GIVEN: A wrong username and wrong password
    WHEN: A post request is made to the login route
    THEN: A token should be not generated. A 401 error should be returned

    Make a post request with invalid credentials to the app,
    a token should notbe returneed
    """
    with client:
        mimetype = 'application/json'

        headers = {
            'Content-Type': mimetype,
            'Accept': mimetype
        }

        data = {
            'credentials': {
                'email': 'ad@gmail.com',
                'password': 'a'
            }
        }

        url = '/login'

        response = client.post(url, data=json.dumps(data), headers=headers)

        # assert a failure response code and a token exists
        assert response.status_code == 401
