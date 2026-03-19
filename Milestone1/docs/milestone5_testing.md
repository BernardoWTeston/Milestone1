# Milestone 5: Authentication and Authorization Testing

## Successful Login Example

**POST /auth/login**

**Request Body:**
```json
{
  "email": "admin@madonna.edu",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "email": "admin@madonna.edu",
    "role": "admin"
  }
}
```

**Description:** User successfully logs in with valid credentials. The server returns a JWT token that must be included in subsequent authenticated requests.

---

## Protected Route Accessed with Valid Token

**POST /api/reservations**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "user_id": 1,
  "resource_id": 2,
  "start_time": "2026-03-20 10:00:00",
  "end_time": "2026-03-20 12:00:00",
  "purpose": "Team meeting"
}
```

**Response (201):**
```json
{
  "reservation_id": 5
}
```

**Description:** An authenticated user successfully creates a reservation. The JWT token in the Authorization header is verified by the authMiddleware before allowing access to the route.

---

## Access Denied Due to Missing or Incorrect Role

**POST /api/resources**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Token belongs to a user with role "user", not "admin")*

**Request Body:**
```json
{
  "resource_name": "Conference Room E",
  "resource_type": "meeting_room",
  "location": "Building 5"
}
```

**Response (403):**
```json
{
  "error": "Access denied"
}
```

**Description:** A regular user attempts to create a resource, which requires admin role. The roleMiddleware checks the user's role from the JWT token and denies access because the user does not have the required admin role.

---

## Missing Authorization Header

**POST /api/reservations**

**Request Body:**
```json
{
  "user_id": 1,
  "resource_id": 2,
  "start_time": "2026-03-20 10:00:00",
  "end_time": "2026-03-20 12:00:00"
}
```

**Response (401):**
```json
{
  "error": "Missing authorization header"
}
```

**Description:** Request to protected route without authentication token is rejected by authMiddleware.

---

## Authentication Features Implemented

1. **Password Hashing** - User passwords are hashed using bcrypt before storage
2. **JWT Authentication** - Tokens are issued on successful login and verified on protected routes
3. **Role-Based Authorization** - Admin role required for resource creation
4. **Protected Routes** - Reservation creation requires authentication