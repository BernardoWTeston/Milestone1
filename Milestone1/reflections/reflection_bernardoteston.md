# Individual Reflection — Bernardo Teston

**Course:** CSC 3210 — Application Development I: Backend  
**Project:** Campus Resource Reservation API

---

## What I Learned About Backend Development

Working through this project gave me a concrete understanding of what it actually takes to build a production-ready backend — not just routes that respond, but a system with real concerns like security, consistency, and maintainability. I learned how Express middleware composes into a pipeline where order matters: JSON parsing must come before routing, and the error handler must come last or it never catches anything. I also learned that authentication and authorization are two separate problems — verifying *who* a user is (JWT validation) versus verifying *what* they are allowed to do (role checks) — and that conflating them leads to subtle bugs.

Designing the database schema early in the project (Milestone 2) forced decisions that shaped every route written later. Getting the foreign keys, indexes, and constraints right upfront made the conflict detection query in reservations straightforward instead of a patch job.

---

## What I Learned About Working With a Shared Codebase

Maintaining a shared repository across milestones taught me that code you write today becomes the foundation someone else builds on tomorrow — even if that someone is a future version of yourself. Clear naming, consistent patterns, and avoiding duplication are not stylistic preferences; they are practical tools for keeping a codebase navigable as it grows.

I also learned how important it is to use environment variables rather than hardcoded credentials. When the same configuration value is defined in multiple places, it is only a matter of time before they diverge. Centralizing the JWT secret in `config.js` and the database settings in environment variables eliminated that class of error entirely.

---

## One Technical Challenge I Solved

The most concrete technical challenge was implementing reservation conflict detection. The naive approach — checking whether two reservations share a resource and overlap — is easy to get wrong. An off-by-one on the boundary conditions means either double-booking or blocking adjacent reservations that do not actually conflict.

I replaced an earlier multi-condition OR expression with the standard interval overlap formula:

```sql
start_time < requested_end AND end_time > requested_start
```

This single condition correctly identifies any overlap, including cases where one interval is fully contained within another or where they share only a single boundary point (which should *not* be treated as a conflict). Understanding why this formula works — by reasoning about when two intervals do *not* overlap and negating it — was a meaningful exercise in thinking precisely about data invariants.

---

## One Area I Would Improve Given More Time

The user management routes are inconsistent with the authentication flow. Currently, `POST /auth/register` is the intended way to create users, while `POST /api/users` existed as an admin-facing alternative that initially did not hash passwords. Given more time, I would consolidate these into a single, well-defined flow — for example, admins create users through the same registration endpoint, or a dedicated admin user-creation endpoint enforces all the same validation as registration.

More broadly, I would add automated tests. Every milestone was validated manually using curl or an API client, which is error-prone and does not scale. A suite of integration tests against a test database would catch regressions automatically and make the codebase easier to hand off.

---

## How This Project Represents My Skills Professionally

This project demonstrates that I can design and build a backend API from the ground up — schema design, route implementation, middleware architecture, authentication, and documentation — and do so in a way that reflects real engineering concerns rather than just passing tests.

The choices visible in the code — separating configuration from logic, extracting reusable query helpers, validating at the boundary, returning consistent JSON error shapes — reflect an understanding of *why* these patterns exist, not just that they exist. That kind of reasoning is what separates code that works from code that can be maintained and extended by a team over time.

I am proud of how the project evolved milestone by milestone. Each refinement pass improved something real: a security concern, a duplication, a confusing pattern. That iterative improvement is how professional software is actually built.
