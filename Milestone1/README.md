# Campus Resource Reservation API

## Project Overview

The Campus Resource Reservation API is a RESTful backend system that allows students and staff to discover and reserve campus resources such as study rooms, lab spaces, and equipment. The system supports user registration and authentication, role-based access control, conflict detection for overlapping reservations, and structured error handling throughout.

This project was built as the backend for a course in Application Development, progressing through eight milestones covering database design, CRUD implementation, middleware, authentication, logging, and final integration.

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web application framework |
| MySQL | Relational database |
| mysql2 | MySQL driver with Promise support |
| bcrypt | Password hashing |
| jsonwebtoken | JWT-based authentication |
| GitHub | Version control and repository hosting |

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm (bundled with Node.js)
- MySQL (v8 or later) running locally or remotely

### Steps

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Milestone1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values (see Environment Variables below).

4. Initialize the database (see Database Initialization Steps below).

5. Start the server:
   ```bash
   npm start
   ```

The server listens on `http://localhost:3000` by default.

---

## Environment Variables

Create a `.env` file in the `Milestone1/` directory with the following variables:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_reservation
SECRET_KEY=a_long_random_secret_string
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | _(empty)_ |
| `DB_NAME` | Database name | `campus_reservation` |
| `SECRET_KEY` | Secret used to sign JWT tokens | `your_secret_key` |

---

## Database Initialization Steps

1. Open a MySQL client and run the main schema file to create the database and tables:
   ```bash
   mysql -u root -p < database/milestone2_schema.sql
   ```

2. Apply the schema migration that adds the password column:
   ```bash
   mysql -u root -p < database/milestone5_update.sql
   ```

3. Verify the setup:
   ```sql
   USE campus_reservation;
   SHOW TABLES;
   -- Expected: reservations, resources, users
   ```

**Tables created:**

- `users` — stores registered users with hashed passwords and roles (`user`, `admin`)
- `resources` — stores campus resources (rooms, labs, equipment) with location and capacity
- `reservations` — stores time-based reservations linking users to resources, with conflict prevention

---

## Authentication Overview

The API uses **JSON Web Tokens (JWT)** for authentication.

1. Register a user via `POST /auth/register` — passwords are hashed with bcrypt before storage.
2. Log in via `POST /auth/login` — on success, the server returns a signed JWT valid for 24 hours.
3. For protected routes, include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your_token>
   ```

**Roles:**
- `user` (default) — can view resources, create and delete their own reservations
- `admin` — full access, including creating/updating/deleting resources and managing all users and reservations

---

## API Endpoint Summary

### Auth

| Method | Route | Description | Auth Required |
|--------|-------|-------------|:---:|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive a JWT token | No |

### Users

| Method | Route | Description | Auth Required |
|--------|-------|-------------|:---:|
| GET | `/api/users` | List all users | Yes |
| GET | `/api/users/:id` | Get a single user by ID | Yes |
| PUT | `/api/users/:id` | Update a user | Admin |
| DELETE | `/api/users/:id` | Delete a user | Admin |

### Resources

| Method | Route | Description | Auth Required |
|--------|-------|-------------|:---:|
| GET | `/api/resources` | List all resources | No |
| GET | `/api/resources/:id` | Get a single resource by ID | No |
| POST | `/api/resources` | Create a new resource | Admin |
| PUT | `/api/resources/:id` | Update a resource | Admin |
| DELETE | `/api/resources/:id` | Delete a resource | Admin |

### Reservations

| Method | Route | Description | Auth Required |
|--------|-------|-------------|:---:|
| GET | `/api/reservations` | List all reservations | Yes |
| GET | `/api/reservations/:id` | Get a single reservation by ID | Yes |
| POST | `/api/reservations` | Create a reservation | Yes |
| PATCH | `/api/reservations/:id/status` | Update reservation status | Admin |
| DELETE | `/api/reservations/:id` | Delete a reservation | Yes (owner or admin) |

---

## How to Run the Project Locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd Milestone1

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your MySQL credentials and a secret key

# 4. Set up the database
mysql -u root -p < database/milestone2_schema.sql
mysql -u root -p < database/milestone5_update.sql

# 5. Start the server
npm start
# Server runs at http://localhost:3000
```

### Quick test after startup

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Jane Doe", "email": "jane@example.com", "password": "secret"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com", "password": "secret"}'

# List resources (no auth needed)
curl http://localhost:3000/api/resources
```

---

## Project Structure

```
Milestone1/
├── src/
│   ├── app.js              # Express app setup and middleware registration
│   ├── server.js           # Server entry point
│   ├── config.js           # Centralized configuration (SECRET_KEY)
│   ├── db.js               # MySQL connection pool
│   ├── db/
│   │   └── queries.js      # Reusable database helpers (findAll, findById, findWhere)
│   ├── routes/
│   │   ├── auth.js         # Registration and login
│   │   ├── users.js        # User CRUD
│   │   ├── resources.js    # Resource CRUD
│   │   └── reservations.js # Reservation CRUD with conflict detection
│   └── middleware/
│       ├── authMiddleware.js    # JWT verification
│       ├── roleMiddleware.js    # Role-based access control
│       ├── validateRequest.js   # Required field validation
│       ├── errorHandler.js      # Centralized error responses
│       └── requestLogger.js     # HTTP request logging
├── database/
│   ├── milestone2_schema.sql    # Full database schema with sample data
│   └── milestone5_update.sql    # Migration: adds password column
├── .env.example            # Template for environment variables
├── package.json
└── README.md
```
