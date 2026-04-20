Campus Resource Reservation API

## Project Description

This is a backend API system for managing campus resource reservations. The system allows users to reserve campus resources such as study rooms, lab spaces, and equipment through a RESTful API.

## Technologies Used

- Node.js - JavaScript runtime environment
- Express.js - Web application framework
- MySQL - Relational database management system
- GitHub - Version control and repository hosting

## How to Run the Server Locally

### Prerequisites

- Node.js installed on your machine
- npm (comes with Node.js)
- MySQL running locally with the `campus_reservation` database

### Setup Instructions

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

The server will run on `http://localhost:3000` by default. Set the `PORT` environment variable to use a different port.

## API Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login and receive JWT token | No |
| GET | /api/users | List all users | No |
| POST | /api/users | Create a new user | No |
| GET | /api/resources | List all resources | No |
| POST | /api/resources | Create a new resource | Admin only |
| GET | /api/reservations | List all reservations | No |
| POST | /api/reservations | Create a reservation | Yes |

## Refinement and Optimization

### What was cleaned up or improved

**Centralized configuration (`src/config.js`)**
The JWT secret key was duplicated across `auth.js` and `authMiddleware.js`. It is now defined once in `src/config.js` and imported where needed. This eliminates the risk of the two values going out of sync.

**Reusable database helpers (`src/db/queries.js`)**
Repeated patterns like `SELECT * FROM table` and `SELECT * FROM table WHERE id = ?` were extracted into `findAll`, `findById`, and `findWhere` helper functions. Route handlers now call these helpers instead of writing raw SQL each time.

**Removed duplicate field validation in routes**
`users.js` previously validated `full_name` and `email` both via the `validate` middleware and again manually inside the handler. The redundant manual checks were removed — the middleware already guarantees those fields are present before the handler runs.

**Simplified conflict detection query in reservations**
The overlap check used a complex three-condition OR expression. It was replaced with the standard interval overlap condition (`start_time < end_time AND end_time > start_time`), which is shorter, correct, and easier to read.

**Excluded password from user SELECT**
`GET /api/users` previously returned the hashed password for every user. The query now selects only `user_id, full_name, email, role`, avoiding unnecessary data exposure.

**Cleaned up `validateRequest.js`**
Trailing blank lines were removed and the error message format was made consistent with the rest of the API (`"field is required"` instead of `"Missing required field: field"`).

### Why these changes matter for maintainability

- A single source of truth for configuration means one change propagates everywhere.
- Shared query helpers mean database interaction patterns only need to be tested and corrected in one place.
- Removing duplicated validation logic means future changes to validation rules require editing only one location.
- Cleaner, shorter route handlers are easier to read, review, and debug.
- Not returning sensitive fields by default reduces security risk without extra effort at call sites.
