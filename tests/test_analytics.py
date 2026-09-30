def test_analytics_overview(client):
    resp = client.get("/api/v1/analytics/overview?range=30d")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_upgrades" in data
    assert "builder_utilization_rate" in data
    assert "hero_progress_percentage" in data
    assert "category_distribution" in data
    assert "activity_trends" in data
    assert len(data["activity_trends"]) > 0

def test_analytics_builders(client):
    resp = client.get("/api/v1/analytics/builders")
    assert resp.status_code == 200
    b_data = resp.json()
    assert "total" in b_data
    assert "busy" in b_data
    assert "free" in b_data
