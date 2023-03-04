CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  boundary TEXT NOT NULL,
  periodicity_minute INTEGER NOT NULL,
  periodicity_hour INTEGER NOT NULL,
  periodicity_day INTEGER NOT NULL,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL
);

COMMENT ON TABLE records is 'Represents records of websites to be crawled';

INSERT INTO records (url, boundary, periodicity_minute, periodicity_hour, periodicity_day, label, active)
 VALUES ('http://www.example.com/', '/example.com/', 10, 0, 0,'Example', TRUE);

