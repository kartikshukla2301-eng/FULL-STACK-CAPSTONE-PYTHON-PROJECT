import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_analytics_metrics(client: AsyncClient):
    # Register & Login
    await client.post("/api/v1/auth/register", json={
        "email": "lead@example.com",
        "full_name": "Tech Lead",
        "password": "LeadPassword123!"
    })
    login = await client.post("/api/v1/auth/login", data={
        "username": "lead@example.com",
        "password": "LeadPassword123!"
    })
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create project
    proj = await client.post("/api/v1/projects", json={
        "name": "Analytics Demo",
        "key": "ADM"
    }, headers=headers)
    project_id = proj.json()["id"]

    # Fetch analytics
    resp = await client.get(f"/api/v1/analytics/project/{project_id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_tasks" in data
    assert "completion_rate" in data
    assert "burndown" in data
    assert "velocity" in data
