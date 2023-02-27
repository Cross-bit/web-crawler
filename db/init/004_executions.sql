CREATE TYPE executionState AS ENUM ('created', 'planned', 'waiting', 'running', 'incomplete', 'done');
/*
    'planned' – in execution queue, ready to be executed ASAP
    'waiting' – waiting in system(e.g. by cron) to be planned to execution queue
    'running' – is beeing executed
    'incomplete' – if smth fails during execution and is beeing terminated
    'done' – execution succesfully finished
*/

CREATE TABLE executions (
    id SERIAL PRIMARY KEY,
    creation TIME,
    start_time TIME,
    execution_time TIME,
    state_of_execution executionState,
    record_id INT NOT NULL,
    FOREIGN KEY (record_id)
        REFERENCES records(id) ON DELETE CASCADE
);

COMMENT ON TABLE executions IS 'Represents all executions for given record.';