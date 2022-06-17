CREATE TABLE record (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  boundary TEXT NOT NULL,
  periodicity INTEGER NOT NULL,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL,
  tags TEXT
);

INSERT INTO record (url, boundary, periodicity, label, active, tags) VALUES ('http://www.example.com/', '/example.com/', 60, 'Example', TRUE, '');