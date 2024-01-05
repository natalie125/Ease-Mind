import pytest
import json
import time

def post_register(app, email, password):
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
def test_post_register_new_user(app):
    response = post_register(app, str(int(time.time())) + '@gmail.com', 'admin')
    assert response.status_code == 200
    assert response.json["msg"] == "New user added."
    assert response.json["token"] != None

@pytest.mark.unit
def test_post_register_existing_user(app):
    response = post_register(app, 'admin@gmail.com', 'admin')
    assert response.status_code == 409
    assert response.json['msg'] == "Username taken."

@pytest.mark.unit
def test_post_register_invalid_email(app):
    response = post_register(app, '', 'admin')
    assert response.status_code == 400
    assert response.json['msg'] == "No email was provided."

@pytest.mark.unit
def test_post_register_invalid_password(app):
    response = post_register(app, 'admin@gmail.com', '')
    assert response.status_code == 400
    assert response.json['msg'] == "No password was provided."
