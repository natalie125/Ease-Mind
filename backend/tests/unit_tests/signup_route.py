import pytest
import json
import time
from app import app

def post_register(email, password):
    return app.test_client().post(
        '/register',
        data=json.dumps({
            'email': email,
            'password': password
        }),
        headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    )

@pytest.mark.unit
def test_post_register_new_user():
    response = post_register(str(int(time.time())) + '@gmail.com', 'admin')
    assert response.status_code == 200
    assert response.json["msg"] == "New user added."
    assert response.json["token"] != None

@pytest.mark.unit
def test_post_register_existing_user():
    response = post_register('admin@gmail.com', 'admin')
    assert response.status_code == 409
    assert response.json['msg'] == "Username taken."

@pytest.mark.unit
def test_post_register_invalid_email():
    response = post_register('', 'admin')
    assert response.status_code == 400
    assert response.json['msg'] == "No email was provided."

@pytest.mark.unit
def test_post_register_invalid_password():
    response = post_register('admin@gmail.com', '')
    assert response.status_code == 400
    assert response.json['msg'] == "No password was provided."
