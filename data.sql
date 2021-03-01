-- username, password, first_name, last_name, therapist, email, is_admin

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL, 
  username TEXT NOT NULL,
  therapist TEXT,
  therapist_id INTEGER REFERENCES therapists (id),
  is_admin TEXT NULL,
  password TEXT NOT NULL
);

CREATE TABLE therapists
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL, 
  username TEXT NOT NULL,
  is_admin TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE Entries (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users (id),
  nrs1 INTEGER NOT NULL,
  nrs2 INTEGER NOT NULL,
  nrs3 INTEGER NOT NULL,
  nrs4 INTEGER NOT NULL,
  nrs5 INTEGER NOT NULL
);


INSERT INTO therapists (first_name, last_name, email, username, password, is_admin) VALUES
('Melanie', 'Downs', 'melanie@rmh.net', 'melanie@rmh.net', '12345', true);