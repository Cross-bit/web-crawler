CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  boundary TEXT NOT NULL,
  periodicity INTEGER NOT NULL,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL
);

INSERT INTO records (url, boundary, periodicity, label, active) VALUES ('http://www.example.com/', '/example.com/', 60, 'Example', TRUE);