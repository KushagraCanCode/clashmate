def test_upgrades_lifecycle(client):
    # 1. List upgrades
    resp = client.get("/api/v1/upgrades")
    assert resp.status_code == 200
    upgrades = resp.json()
    assert len(upgrades) > 0

    # 2. Add upgrade
    payload = {
        "target_type": "building",
        "target_name": "Wizard Tower",
        "from_level": 14,
        "to_level": 15,
        "builder_index": 5,
        "cost_type": "gold",
        "cost_amount": 18000000,
        "duration_seconds": 12 * 3600
    }
    create_resp = client.post("/api/v1/upgrades", json=payload)
    assert create_resp.status_code == 200
    upg_data = create_resp.json()
    assert upg_data["target_name"] == "Wizard Tower"
    assert upg_data["status"] == "active"
    upg_id = upg_data["id"]

    # 3. Complete upgrade
    comp_resp = client.post(f"/api/v1/upgrades/{upg_id}/complete")
    assert comp_resp.status_code == 200
    assert comp_resp.json()["status"] == "completed"
