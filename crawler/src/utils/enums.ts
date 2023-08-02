
/*
*   Execution states
*/
export enum executionState {
    CREATED = 'created',
    WAITING = 'waiting',
    PLANNED = 'planned',
    RUNNING = 'running',
    CANCELED = 'canceled',
    INCOMPLETE = 'incomplete',
    DONE = 'done',
}

/*
    'created' – execution record is newly created and put in to the database
    'waiting' – waiting in system(e.g. by cron) to be put into the execution queue
    'planned' – in execution queue, ready to be executed (i. e. waiting for free crawler)
    'running' – is beeing executed
    'incomplete' – if smth fails during execution and is beeing terminated
    'done' – execution succesfully finished
*/


/**
 * Page crawling error codes
 */
export enum crawlingCode {
    OK = 'ok',
    REGEX = 'regex',
    EXTENSION = 'extension',
    INVALID_URI = 'invalid_uri'
}