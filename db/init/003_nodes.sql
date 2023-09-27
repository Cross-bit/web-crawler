
CREATE TYPE crawlingStatus AS ENUM ('ok', 'regex', 'extension', 'invalid_uri', 'data_download' );

/*
TODO: problem with first page... we will not get first page validation
*/

CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(256),
    url TEXT,
    crawl_time INT,
    record_id INT NOT NULL,
    FOREIGN KEY (record_id)
        REFERENCES records(id) ON DELETE CASCADE
);

COMMENT ON TABLE nodes IS 'Represents crawled sites for given record coresponding to the last execution.';

CREATE TABLE node_errors (
    id SERIAL,
    node_id INT NOT NULL,
    crawling_code crawlingStatus,
    PRIMARY KEY (id, node_id, crawling_code),
    FOREIGN KEY (node_id)
        REFERENCES nodes(id) ON DELETE CASCADE
);

-- Describes relations between
CREATE TABLE nodes_connections (
    id SERIAL PRIMARY KEY,
    id_from INT NOT NULL,
    id_to INT NOT NULL,
    record_id INT NOT NULL,
    FOREIGN KEY (id_from)
        REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_to)
        REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (record_id)
        REFERENCES records(id) ON DELETE CASCADE,
    CONSTRAINT edge_from_to_unique UNIQUE (id_from, id_to)
);

COMMENT ON TABLE nodes_connections IS 'Describes nodes graph connections.';

/*CREATE OR REPLACE FUNCTION notify_add_node()
RETURNS trigger AS 
$BODY$
BEGIN
PERFORM pg_notify('new node', NEW.*::text);
RETURN NEW;
END
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
ALTER FUNCTION notify_add_node()
OWNER TO postgres;

CREATE TRIGGER add_task_event_trigger
AFTER INSERT
ON test_table
FOR EACH ROW
EXECUTE PROCEDURE add_task_notify();*/




