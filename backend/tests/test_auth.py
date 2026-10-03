import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_and_login(client: AsyncClient):
    # Test registration
    reg_payload = {
        "email": "testuser@example.com",
        "full_name": "Test User",
        "password": "SecretPassword123!",
        "role": "developer"
    }
    response = await client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert "id" in data

    # Test login
    login_payload = {
        "username": "testuser@example.com",
        "password": "SecretPassword123!"
    }
    response = await client.post("/api/v1/auth/login", data=login_payload)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
