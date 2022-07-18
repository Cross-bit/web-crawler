CREATE TABLE executions (
    id SERIAL PRIMARY KEY,
    creation TIME,
    execution_started TIME,
    execution_ended TIME,
    execution_status VARCHAR(32),
    owner INT NOT NULL,
    FOREIGN KEY (owner)
        REFERENCES records(id) ON DELETE CASCADE
);

COMMENT ON TABLE executions IS 'Represents all executions for given record.';