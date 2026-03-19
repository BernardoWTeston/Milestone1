USE campus_reservation;

ALTER TABLE users ADD COLUMN password VARCHAR(255);

ALTER TABLE users MODIFY COLUMN role VARCHAR(20) DEFAULT 'user';