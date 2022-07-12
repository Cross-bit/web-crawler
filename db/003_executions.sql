
CREATE TABLE executions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    url TEXT,
    crawlTime TEXT,
    owner INT NOT NULL,
    FOREIGN KEY (owner)
        REFERENCES records(id) ON DELETE CASCADE
);

CREATE TABLE executions_connections (
    id SERIAL PRIMARY KEY,
    id_from INT NOT NULL,
    id_to INT NOT NULL,
    FOREIGN KEY (id_from)
        REFERENCES executions(id),
    FOREIGN KEY (id_to)
        REFERENCES executions(id)
);


