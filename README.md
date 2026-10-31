# Task Manager REST API

A REST API built with Node.js, Express, MongoDB, JWT authentication, and bcrypt password hashing.

## Requirements

- Node.js 18+
- MongoDB local instance or MongoDB Atlas account
- Postman (recommended)

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and configure `MONGODB_URI` and a strong `JWT_SECRET`.

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## Authentication

Register and login endpoints are public. All `/api/tasks` endpoints require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Passwords are hashed with bcrypt before storage. A user can only access their own tasks.

## Endpoints

### 1. Register

`POST /api/auth/register`

Request:
```json
{
  "name": "Ritesh",
  "email": "ritesh@example.com",
  "password": "strongpass123"
}
```

Success `201`:
```json
{
  "message": "Registration successful",
  "user": {
    "id": "USER_ID",
    "name": "Ritesh",
    "email": "ritesh@example.com"
  }
}
```

### 2. Login

`POST /api/auth/login`

Request:
```json
{
  "email": "ritesh@example.com",
  "password": "strongpass123"
}
```

Success `200`:
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Ritesh",
    "email": "ritesh@example.com"
  }
}
```

### 3. Create task

`POST /api/tasks` — protected

Request:
```json
{
  "title": "Complete API assignment",
  "description": "Build and test the REST API",
  "status": "pending"
}
```

Success `201`:
```json
{
  "message": "Task created",
  "task": {
    "_id": "TASK_ID",
    "title": "Complete API assignment",
    "description": "Build and test the REST API",
    "status": "pending",
    "user": "USER_ID"
  }
}
```

### 4. Get all tasks

`GET /api/tasks` — protected

Success `200`:
```json
{
  "count": 1,
  "tasks": []
}
```

Only tasks owned by the authenticated user are returned.

### 5. Get one task

`GET /api/tasks/:id` — protected

Success `200`:
```json
{
  "task": {
    "_id": "TASK_ID",
    "title": "Complete API assignment",
    "description": "Build and test the REST API",
    "status": "pending",
    "user": "USER_ID"
  }
}
```

### 6. Update task

`PUT /api/tasks/:id` — protected

Request (send one or more fields):
```json
{
  "title": "Finish and test API",
  "status": "completed"
}
```

Success `200`:
```json
{
  "message": "Task updated",
  "task": {}
}
```

Allowed statuses: `pending`, `in-progress`, `completed`.

### 7. Delete task

`DELETE /api/tasks/:id` — protected

Success `200`:
```json
{
  "message": "Task deleted successfully"
}
```

## HTTP status codes

- `200` — successful read, update, delete, or login
- `201` — resource created
- `400` — invalid input or duplicate email
- `401` — missing/invalid token or invalid login credentials
- `404` — task or route not found
- `500` — unexpected server error

Validation errors return `400` with a message and an `errors` array.

## Postman testing order

1. Register a user.
2. Login and copy the returned token.
3. For each task request, select **Authorization → Bearer Token** and paste the token.
4. Create a task, list tasks, retrieve it by ID, update it, and delete it.
5. Remove the token and call `GET /api/tasks`; confirm the response is `401`.

## Notes

- Never commit `.env` or real credentials.
- Replace the example JWT secret with a long random value.
- This is an educational starter project. Test locally with your own MongoDB connection before submitting.
