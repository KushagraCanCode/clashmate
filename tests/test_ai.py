def test_ai_insights(client):
    resp = client.get("/api/v1/ai/insights")
    assert resp.status_code == 200
    insights = resp.json()
    assert len(insights) > 0
    assert any(i["type"] in ["warning", "efficiency", "recommendation", "milestone"] for i in insights)

def test_ai_chat_grounded(client):
    payload = {
        "message": "Summarize my village and upgrade timers"
    }
    resp = client.post("/api/v1/ai/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "reply" in data
    assert "grounded_context" in data
    assert len(data["suggested_followups"]) > 0
    # Must mention Town Hall and progress
    assert "Town Hall" in data["reply"] or "Town Hall" in str(data["grounded_context"])
