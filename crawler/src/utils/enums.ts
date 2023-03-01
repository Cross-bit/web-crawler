
/*
*   Execution states
*/
export enum executionState {
    CREATED = 'created',
    PLANNED = 'planned',
    WAITING = 'waiting',
    RUNNING = 'running',
    INCOMPLETE = 'incomplete',
    DONE = 'done',
}

/*
    'planned' – in execution queue, ready to be executed
    'waiting' – waiting in system(e.g. by cron) to be planned to execution queue
    'running' – is beeing executed
    'incomplete' – if smth fails during execution and is beeing terminated
    'done' – execution succesfully finished
*/