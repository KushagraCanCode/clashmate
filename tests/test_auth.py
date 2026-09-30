def test_demo_login(client):
    response = client.post("/api/v1/auth/demo")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "chief_arthur"

def test_register_and_login(client):
    reg_payload = {
        "full_name": "Chief Strategist",
        "username": "chief_strategist_test",
        "email": "strategist@clashmate.io",
        "password": "strongPassword123!",
        "country": "Germany",
        "timezone": "Europe/Berlin"
    }
    reg_resp = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 200
    assert "access_token" in reg_resp.json()

    # Login
    login_payload = {
        "username_or_email": "chief_strategist_test",
        "password": "strongPassword123!"
    }
    login_resp = client.post("/api/v1/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

def test_login_invalid_password(client):
    payload = {
        "username_or_email": "chief_arthur",
        "password": "wrong_password_999"
    }
    resp = client.post("/api/v1/auth/login", json=payload)
    assert resp.status_code == 401
