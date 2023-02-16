CREATE TYPE executionStatus AS ENUM ('created', 'planned', 'waiting', 'running', 'incomplete', 'done');
/*
    'planned' – in execution queue, ready to be executed ASAP
    'waiting' – waiting in system(e.g. by cron) to be planned to execution queue
    'running' – is executed
    'incomplete' – if smth fails during execution
    'done' – execution succesfully done
*/

CREATE TABLE executions (
    id SERIAL PRIMARY KEY,
    creation TIME,
    execution_start TIME,
    execution_time TIME,
    execution_status executionStatus,
    owner INT NOT NULL,
    FOREIGN KEY (owner)
        REFERENCES records(id) ON DELETE CASCADE
);

COMMENT ON TABLE executions IS 'Represents all executions for given record.';