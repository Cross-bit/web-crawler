
CREATE TYPE crawlingStatus AS ENUM ('ok', 'regex', 'extension', 'invalid_uri');

/*
TODO: problem with first page... we will not get first page validation
*/

CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
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
    FOREIGN KEY (id_from)
        REFERENCES nodes(id),
    FOREIGN KEY (id_to)
        REFERENCES nodes(id),
    CONSTRAINT edge_from_to_unique UNIQUE (id_from, id_to)
);

COMMENT ON TABLE nodes_connections IS 'Describes nodes graph connections.';


