import pytest
import json
import time
from app import app

def post_login(email, password):
    return app.test_client().post(
        '/login',
        data=json.dumps({
            'credentials': {
                'email': email,
                'password': password
            }
        }),
        headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    )

@pytest.mark.unit
def test_post_login_invalid_email():
    response = post_login('', 'admin')
    assert response.status_code == 400
    assert response.json['msg'] == "No email was provided."

@pytest.mark.unit
def test_post_login_invalid_password():
    response = post_login('admin@gmail.com', '')
    assert response.status_code == 400
    assert response.json['msg'] == "No password was provided."

@pytest.mark.unit
def test_post_login_incorrect_username():
    response = post_login('incorrect_email', 'admin')
    assert response.status_code == 401
    assert response.json['msg'] == "Incorrect username or password."

@pytest.mark.unit
def test_post_login_incorrect_password():
    response = post_login('admin@gmail.com', 'incorrect_password')
    assert response.status_code == 401
    assert response.json['msg'] == "Incorrect username or password."

@pytest.mark.unit
def test_post_login_valid_user():
    email = 'admin@gmail.com'
    response = post_login(email, 'admin')
    assert response.status_code == 200
    assert response.json['token'] != None
    assert response.json['email'] == email

