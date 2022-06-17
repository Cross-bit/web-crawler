
/*
  Tags table.
*/

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(64) NOT NULL,
  UNIQUE (tag_name)
);

-- test data
INSERT INTO tags (tag_name) VALUES ('one');
INSERT INTO tags (tag_name) VALUES ('two');
INSERT INTO tags (tag_name) VALUES ('three');

/*
  Tags to records relation table.
*/

CREATE TABLE tags_records_relations(
  id SERIAL PRIMARY KEY,
  tag_id INT NOT NULL,
  record_id INT NOT NULL,
  FOREIGN KEY (tag_id)
    REFERENCES tags(id),
  FOREIGN KEY (record_id)
    REFERENCES record(id)
);

-- test data
INSERT INTO tags_records_relations (tag_id, record_id) VALUES ( (SELECT id FROM tags LIMIT 1), (SELECT id FROM record LIMIT 1) );