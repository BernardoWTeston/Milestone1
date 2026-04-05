# Milestone 6: Logging and Error Handling Testing

## Example of Logged Request

**Console Output:**
```
[2026-03-30T15:42:13.582Z] GET /api/users
[2026-03-30T15:42:18.221Z] POST /api/reservations
[2026-03-30T15:42:25.903Z] GET /api/resources
```

**Description:** The request logger middleware logs every incoming HTTP request with a timestamp, method, and URL path. This helps track API usage and debug issues by showing the sequence of requests received by the server.

---

## Example of Handled Error Response

**Request:**
```bash
POST /api/reservations
```

**Scenario:** Database connection fails during the request

**Console Output:**
```
Access denied for user 'root'@'localhost' (using password: NO)
```

**Response (500):**
```json
{
  "error": "Access denied for user 'root'@'localhost' (using password: NO)"
}
```

**Description:** When an unexpected error occurs (like a database connection issue), the centralized error handler catches it, logs the error message to the console, and returns a consistent JSON error response to the client without exposing internal stack traces.

---

## Example of Validation Error

**Request:**
```bash
POST /api/reservations
Content-Type: application/json

{
  "user_id": 1,
  "resource_id": 2,
  "start_time": "2026-03-25 14:00:00"
}
```

**Response (400):**
```json
{
  "error": "end_time is required"
}
```

**Description:** The validation middleware checks for required fields before processing the request. When `end_time` is missing, it immediately returns a 400 Bad Request with a clear error message, preventing invalid data from reaching the database.

---

## Example of Business Logic Validation

**Request:**
```bash
POST /api/reservations
Content-Type: application/json

{
  "user_id": 1,
  "resource_id": 2,
  "start_time": "2026-03-25 14:00:00",
  "end_time": "2026-03-25 13:00:00"
}
```

**Response (400):**
```json
{
  "error": "End time must be after start time"
}
```

**Description:** Beyond checking if fields exist, the route validates business logic rules. In this case, it detects that the end time is before the start time and returns a clear validation error before attempting to insert invalid data.

---

## Reliability Improvements

1. **Request Logging** - All incoming requests are logged with timestamps for debugging
2. **Centralized Error Handling** - Errors are caught and handled consistently across all routes
3. **Clear Validation Messages** - Users receive specific, actionable error messages
4. **Server Stability** - Invalid requests don't crash the server; it continues running and handles subsequent requests normally