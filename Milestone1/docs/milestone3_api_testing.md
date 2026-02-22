# Milestone 3: API Testing Documentation

## Users Endpoints

### GET /api/users
Returns all users in the system.

**Method:** GET  
**Endpoint:** `http://localhost:3000/api/users`  
**Description:** Retrieves a list of all registered users with their details including user_id, full_name, email, role, and created_at timestamp.

### POST /api/users
Creates a new user in the system.

**Method:** POST  
**Endpoint:** `http://localhost:3000/api/users`  
**Description:** Adds a new user to the database. Requires full_name and email in the request body. Role defaults to 'student' if not specified.

**Example Request Body:**
```json
{
  "full_name": "Alex Johnson",
  "email": "alex.johnson@madonna.edu",
  "role": "student"
}
```

## Resources Endpoints

### GET /api/resources
Returns all available resources.

**Method:** GET  
**Endpoint:** `http://localhost:3000/api/resources`  
**Description:** Retrieves a list of all reservable resources including rooms, equipment, and lab spaces with their details such as name, type, location, capacity, and description.

### POST /api/resources
Creates a new resource in the system.

**Method:** POST  
**Endpoint:** `http://localhost:3000/api/resources`  
**Description:** Adds a new reservable resource to the database. Requires resource_name, resource_type, and location. Capacity and description are optional.

**Example Request Body:**
```json
{
  "resource_name": "Study Room C",
  "resource_type": "study_room",
  "location": "Library Floor 2",
  "capacity": 4,
  "description": "Small quiet study room with whiteboard"
}
```

## Reservations Endpoints

### GET /api/reservations
Returns all reservations in the system.

**Method:** GET  
**Endpoint:** `http://localhost:3000/api/reservations`  
**Description:** Retrieves a list of all reservations with details including reservation_id, user_id, resource_id, start_time, end_time, purpose, and status.

### POST /api/reservations
Creates a new reservation.

**Method:** POST  
**Endpoint:** `http://localhost:3000/api/reservations`  
**Description:** Creates a new reservation for a resource. Requires user_id, resource_id, start_time, and end_time. Purpose is optional and defaults to null if not provided.

**Example Request Body:**
```json
{
  "user_id": 1,
  "resource_id": 2,
  "start_time": "2026-02-15 14:00:00",
  "end_time": "2026-02-15 16:00:00",
  "purpose": "Team project discussion"
}
```

## Testing Notes

All endpoints return JSON responses and use appropriate HTTP status codes:
- 200 for successful GET requests
- 201 for successful POST requests
- 500 for server errors

Error responses include an error message in the following format:
```json
{
  "error": "Error message description"
}
```