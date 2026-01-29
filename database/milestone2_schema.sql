DROP DATABASE IF EXISTS campus_reservation;
CREATE DATABASE campus_reservation;
USE campus_reservation;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role VARCHAR(30) NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
  resource_id INT AUTO_INCREMENT PRIMARY KEY,
  resource_name VARCHAR(120) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  location VARCHAR(120) NULL,
  capacity INT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  resource_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  purpose VARCHAR(255) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_reservations_users
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_reservations_resources
    FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
    ON DELETE CASCADE,

  CONSTRAINT chk_reservation_time
    CHECK (end_time > start_time)
);

CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_resource ON reservations(resource_id);
CREATE INDEX idx_reservations_time ON reservations(start_time, end_time);

INSERT INTO users (full_name, email, role) VALUES
('Marcus Rivera', 'marcus.rivera@madonna.edu', 'student'),
('Sophia Chen', 'sophia.chen@madonna.edu', 'admin'),
('Elijah Thompson', 'elijah.thompson@madonna.edu', 'student');

INSERT INTO resources (resource_name, resource_type, location, capacity, description) VALUES
('Innovation Lab B', 'lab_space', 'Engineering Building Floor 3', 12, 'Collaborative workspace with 3D printers and design tools'),
('Conference Room Delta', 'study_room', 'Student Union 204', 8, 'Private meeting room with projector and video conferencing'),
('Laptop Dell XPS 15', 'equipment', 'Technology Commons', NULL, 'High-performance laptop for video editing and design work'),
('Podcast Studio C', 'media_room', 'Communications Center Basement', 4, 'Soundproof room with microphones and recording equipment');

INSERT INTO reservations (user_id, resource_id, start_time, end_time, purpose, status) VALUES
(1, 2, '2026-02-05 14:00:00', '2026-02-05 16:30:00', 'Senior capstone presentation prep', 'active'),
(3, 1, '2026-02-07 09:00:00', '2026-02-07 12:00:00', 'Prototype testing and iteration', 'active'),
(1, 3, '2026-02-10 13:00:00', '2026-02-12 13:00:00', 'Final project video production', 'active');