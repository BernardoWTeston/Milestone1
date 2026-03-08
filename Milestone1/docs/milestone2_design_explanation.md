# Milestone 2: Database Schema Design Explanation

## Entities I Designed

**Users:**
This table stores all people who can access the reservation system. It tracks their basic information, role (student or admin), and when their account was created. Users are essential because they are the people making reservations and managing resources.

**Resources:**
This table stores all reservable items available on campus, including study rooms, lab spaces, and equipment. Each resource has a type, location, capacity, and description to help users understand what they're reserving. Resources need to be tracked so the system knows what's available and where.

**Reservations:**
This table connects users to resources for specific time periods. It stores when a reservation starts and ends, its current status, and the purpose of the reservation. This is the core transaction table that makes the entire system functional.

## Relationships

**How does a reservation connect to a user?**
Each reservation has a `user_id` foreign key that references the `users` table. This creates a one-to-many relationship where one user can make multiple reservations, but each reservation belongs to exactly one user. If a user is deleted, their reservations are automatically removed through CASCADE delete.

**How does a reservation connect to a resource?**
Each reservation has a `resource_id` foreign key that references the `resources` table. This creates a one-to-many relationship where one resource can have multiple reservations over time, but each reservation is for exactly one resource. If a resource is deleted, all its reservations are removed automatically.

## Assumptions

- Any registered user can make a reservation for any active resource
- Reservations must have both a start time and an end time
- The end time must be after the start time (enforced by CHECK constraint)
- Multiple users can reserve the same resource as long as times don't overlap (overlap checking will be handled at the API layer)
- Admins have the same reservation abilities as students but may have additional management permissions in future modules
- Resources can be temporarily deactivated using the `is_active` flag without deleting them
- Study rooms have a maximum capacity, but equipment does not

## One Design Decision I Made

I added a `purpose` field to the reservations table because knowing why someone is reserving a resource improves system transparency and can help administrators manage high-demand resources. For example, if a study room is consistently reserved for group projects, the campus might consider adding more group study spaces. This field also helps users remember what they reserved the resource for when viewing their reservation history.