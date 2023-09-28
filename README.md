# High-level decisions
For now, we do not care about running the individual components in production-mode. Authentization and authorization is also not a priority right now. The assumption is the user will run the application on his local machine. Database migrations are also not a priority.

# Components

## Client
Vue 3 + Quasar as component framework, with codegenerated TS bindings for urql (GraphQL client for Svelte)

## Hasura
GraphQL + REST API for CRUD operations, utilizing postgres DB under the hood to store the data.

## Database
Postgres.

# Development
`docker-compose up` brings the entire stack up for development. You also want to run `npm install` in the `client` folder so the `node_modules` directory will also be populated on your host machine, so IntelliSense and similar features will work.

See the docker-compose files for port numbers of the individual services.

# Caveats

## npm install
When you add new packages to the client via `npm install`, restart the docker-compose stack with `docker-compose down -v && docker-compose up --build` so the container with the client will have the newly installed npm package.



## Manual

The execution can be in following states:
 - 'PLANNED' – in execution queue, ready to be executed ASAP
 - 'WAITING' – waiting in system(e.g. by cron) to be planned to execution queue
 - 'RUNNING' – is being executed
 - 'INCOMPLETE' – if something fails during execution and is being terminated
 - 'DONE' – execution successfully finished


### Effect of changes of record(CUD) on executions
 - When record is updated all the executions that are not in 'DONE' state will be destroyed and new will be planned(if records settings satisfies adequate conditions).
 - When new record is created and is active, new execution will be planned
 - When record is deleted all its executions are deleted aswell

### Effect of unexpected termination on running executions
 - If service TODO:


