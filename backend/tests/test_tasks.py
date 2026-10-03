import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_project_and_task_crud(client: AsyncClient):
    # Register & Login user
    reg = await client.post("/api/v1/auth/register", json={
        "email": "manager@example.com",
        "full_name": "Project Manager",
        "password": "ManagerPassword123!",
        "role": "manager"
    })
    assert reg.status_code == 201

    login = await client.post("/api/v1/auth/login", data={
        "username": "manager@example.com",
        "password": "ManagerPassword123!"
    })
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create project
    proj_resp = await client.post("/api/v1/projects", json={
        "name": "TaskFlow Core",
        "description": "Core platform development",
        "key": "TFC"
    }, headers=headers)
    assert proj_resp.status_code == 201
    project_id = proj_resp.json()["id"]

    # Create task
    task_resp = await client.post("/api/v1/tasks", json={
        "title": "Build Auth API",
        "description": "Implement JWT endpoint",
        "status": "todo",
        "priority": "high",
        "project_id": project_id,
        "estimated_hours": 8.0
    }, headers=headers)
    assert task_resp.status_code == 201
    task_data = task_resp.json()
    assert task_data["title"] == "Build Auth API"

    # Patch task status to done
    task_id = task_data["id"]
    patch_resp = await client.patch(f"/api/v1/tasks/{task_id}", json={
        "status": "done",
        "actual_hours": 6.5
    }, headers=headers)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "done"
