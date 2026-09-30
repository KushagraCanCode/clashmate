def test_busy_mode_flow(client):
    # 1. Start Busy Mode
    payload = {
        "duration_label": "4 hours",
        "duration_seconds": 14400,
        "allow_critical_only": True,
        "notify_hero_finish": True,
        "notify_lab_finish": True
    }
    start_resp = client.post("/api/v1/busy-mode/start", json=payload)
    assert start_resp.status_code == 200
    data = start_resp.json()
    assert data["is_active"] is True
    assert data["duration_label"] == "4 hours"
    assert data["end_time"] is not None

    # 2. Check status
    status_resp = client.get("/api/v1/busy-mode/status")
    assert status_resp.status_code == 200
    st_data = status_resp.json()
    assert st_data["is_active"] is True

    # 3. End Busy Mode
    end_resp = client.post("/api/v1/busy-mode/end")
    assert end_resp.status_code == 200

    # 4. Check status again
    after_resp = client.get("/api/v1/busy-mode/status")
    assert after_resp.status_code == 200
    assert after_resp.json()["is_active"] is False
