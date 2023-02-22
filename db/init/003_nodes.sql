
CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    url TEXT,
    crawlTime TEXT,
    owner INT NOT NULL,
    FOREIGN KEY (owner)
        REFERENCES records(id) ON DELETE CASCADE
);

COMMENT ON TABLE nodes IS 'Represents crawled sites for given record coresponding to the last execution.';

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


