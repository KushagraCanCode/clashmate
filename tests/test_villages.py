def test_get_village_summary(client):
    # Auto provisions demo user
    resp = client.get("/api/v1/villages/active/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert "village" in data
    assert "stats" in data
    assert data["village"]["town_hall"] == 15
    assert data["stats"]["total_builders"] == 6
    assert data["stats"]["progress_percentage"] > 0
    assert "next_event" in data["stats"]

def test_get_buildings(client):
    resp = client.get("/api/v1/buildings")
    assert resp.status_code == 200
    buildings = resp.json()
    assert len(buildings) > 0
    # Check category filter
    resp_defenses = client.get("/api/v1/buildings?category=defenses")
    assert resp_defenses.status_code == 200
    for b in resp_defenses.json():
        assert b["category"] == "defenses"

def test_get_heroes(client):
    resp = client.get("/api/v1/heroes")
    assert resp.status_code == 200
    heroes = resp.json()
    hero_names = [h["name"] for h in heroes]
    assert "Archer Queen" in hero_names
    assert "Barbarian King" in hero_names
