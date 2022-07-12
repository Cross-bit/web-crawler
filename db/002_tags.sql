
/*
  Tags table.
*/

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(64) NOT NULL,
  UNIQUE (tag_name)
);

-- test data
INSERT INTO tags (tag_name) VALUES ('first tag');
INSERT INTO tags (tag_name) VALUES ('second tag');
INSERT INTO tags (tag_name) VALUES ('third tag');

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
    REFERENCES records(id) ON DELETE CASCADE
);

-- test data
INSERT INTO tags_records_relations (tag_id, record_id) VALUES ( (SELECT id FROM tags ORDER BY RANDOM () LIMIT 1), (SELECT id FROM records LIMIT 1) );
/*INSERT INTO tags_records_relations (tag_id, record_id) VALUES ( (SELECT id FROM tags ORDER BY RAND() LIMIT 1), (SELECT id FROM records LIMIT 1) );
INSERT INTO tags_records_relations (tag_id, record_id) VALUES ( (SELECT id FROM tags ORDER BY RAND() LIMIT 1), (SELECT id FROM records LIMIT 1) );*/