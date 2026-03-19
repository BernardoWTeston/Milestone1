# Milestone 4: Middleware and Validation Testing

## Request That Fails Validation

**POST /api/users**

**Request Body:**
```json
{
  "email": "test@madonna.edu"
}
```

**Response (400):**
```json
{
  "error": "Missing required field: full_name"
}
```

**Description:** This request fails because the required field `full_name` is missing. The validation middleware catches this before any database operations occur.

---

## Handled Server Error

**POST /api/reservations**

**Request Body:**
```json
{
  "user_id": "invalid_string",
  "resource_id": 1,
  "start_time": "2026-03-01 10:00:00",
  "end_time": "2026-03-01 11:00:00"
}
```

**Response (500):**
```json
{
  "error": "An unexpected server error occurred"
}
```

**Description:** This request causes a database error due to invalid data type for user_id. The centralized error handler catches the exception and returns a consistent error message instead of exposing internal details.

---

## Successful Request After Validation

**POST /api/reservations**

**Request Body:**
```json
{
  "user_id": 1,
  "resource_id": 2,
  "start_time": "2026-03-15 14:00:00",
  "end_time": "2026-03-15 16:00:00",
  "purpose": "Group study session"
}
```

**Response (201):**
```json
{
  "reservation_id": 4
}
```

**Description:** This request passes all validation checks: all required fields are present, end_time is after start_time, the resource exists, and there are no conflicting reservations for the same time period.

---

## Business Rules Implemented

1. **End time must be after start time** - Prevents invalid time ranges for reservations
2. **Cannot reserve nonexistent resources** - Checks that resource_id exists in the database before creating reservation
3. **Resources cannot be created without a location** - Requires location field for all new resources
4. **Duplicate reservations rejected** - Prevents overlapping reservations for the same resource