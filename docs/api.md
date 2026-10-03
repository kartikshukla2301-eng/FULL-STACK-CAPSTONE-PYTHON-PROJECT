# TaskFlow Pro - REST API & WebSocket Protocol Documentation

All REST API requests require a valid Bearer JWT token in the `Authorization` header except `/api/v1/auth/register` and `/api/v1/auth/login`.

---

## 🔑 Authentication Endpoints

### 1. Register User
`POST /api/v1/auth/register`

#### Request Body
```json
{
  "email": "developer@example.com",
  "full_name": "Jane Doe",
  "password": "SecurePassword123!",
  "role": "developer"
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "email": "developer@example.com",
  "full_name": "Jane Doe",
  "role": "developer",
  "is_active": true,
  "created_at": "2026-10-03T23:30:00Z"
}
```

### 2. Login User
`POST /api/v1/auth/login` (Form-UrlEncoded)

#### Response (200 OK)
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer"
}
```

---

## 📁 Projects API

- `GET /api/v1/projects`: List all user-owned projects.
- `POST /api/v1/projects`: Create a new project workspace.
- `GET /api/v1/projects/{project_id}`: Retrieve project details.

---

## 📋 Tasks API

- `GET /api/v1/tasks?project_id={id}`: List tasks filtered by project.
- `POST /api/v1/tasks`: Create task in Kanban board.
- `PATCH /api/v1/tasks/{task_id}`: Update task fields (status, priority, estimate).
- `DELETE /api/v1/tasks/{task_id}`: Remove task.
- `GET /api/v1/tasks/export/csv?project_id={id}`: Stream CSV file download.

---

## ⚡ WebSocket Real-time Protocol

`WS /api/v1/ws/project/{project_id}`

### Event Payload Structure
```json
{
  "event": "task_updated",
  "data": {
    "id": 42,
    "status": "done",
    "updated_at": "2026-10-03T23:35:00Z"
  }
}
```
