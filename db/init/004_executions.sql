CREATE TYPE executionState AS ENUM ('created', 'planned', 'waiting', 'running', 'incomplete', 'canceled', 'done');

/*
    'waiting' – waiting in system(e.g. by cron) to be planned to execution queue
    'planned' – in execution queue, ready to be executed ASAP (i.e. wating for free crawler)
    'running' – is being executed
    'incomplete' – if something fails during execution and is being terminated
    'canceled' – if for some reason the execution was cancelled by the user
    'done' – execution successfully finished
*/

CREATE TABLE executions (
    id SERIAL PRIMARY KEY,
    creation_time TIMESTAMP, /* this time is set by rest api, for internal purposes and not e.g. by DEFAULT NOW() */
    start_time TIMESTAMP,
    real_start_time TIMESTAMP,
    duration_time INT,
    sequence_number BIGINT,
    is_timed boolean, 
    state_of_execution executionState NOT NULL,
    record_id INT NOT NULL,
    FOREIGN KEY (record_id)
        REFERENCES records(id) ON DELETE CASCADE
);

COMMENT ON TABLE executions IS 'Creation time of the execution.';

COMMENT ON COLUMN executions.creation_time IS 'Creation time of the execution. This is a read-only field.';
COMMENT ON COLUMN executions.start_time IS 'When did the execution start';
COMMENT ON COLUMN executions.duration_time IS 'How much time the execution took.';
COMMENT ON COLUMN executions.is_timed IS 'Whether the execution should create the next execution.';
COMMENT ON COLUMN executions.state_of_execution IS 'The current state of the execution.';
COMMENT ON COLUMN executions.record_id IS 'The ID of the record to which the execution belongs.';
