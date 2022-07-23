
/*
  Tags table.
*/

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(64) NOT NULL,
  UNIQUE (tag_name)
);

COMMENT ON TABLE tags IS 'Represents tags data.';

-- test data
INSERT INTO tags (tag_name) VALUES ('first');
INSERT INTO tags (tag_name) VALUES ('second');
INSERT INTO tags (tag_name) VALUES ('third');

/*
  Tags to records relation table.
*/

CREATE TABLE tags_records_relations(
  id SERIAL PRIMARY KEY,
  tag_id INT NOT NULL,
  record_id INT NOT NULL,
  FOREIGN KEY (tag_id)
    REFERENCES tags(id) ON DELETE CASCADE,
  FOREIGN KEY (record_id)
    REFERENCES records(id) ON DELETE CASCADE,
  CONSTRAINT record_tag_unique UNIQUE (tag_id, record_id)
);

COMMENT ON TABLE tags_records_relations IS 'Describes which tag is assigned to which record and vice versa.';

-- test data
INSERT INTO tags_records_relations (tag_id, record_id) VALUES ( (SELECT id FROM tags ORDER BY RANDOM () LIMIT 1), (SELECT id FROM records LIMIT 1) );
/*INSERT INTO tags_records_relations (tag_id, record_id) VALUES ( (SELECT id FROM tags ORDER BY RAND() LIMIT 1), (SELECT id FROM records LIMIT 1) );
INSERT INTO tags_records_relations (tag_id, record_id) VALUES ( (SELECT id FROM tags ORDER BY RAND() LIMIT 1), (SELECT id FROM records LIMIT 1) );*/