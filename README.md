
# Components

## Client application
Vue 3 + Quasar as component framework with TS.

`container name: vue_frontend`

## Crawler backend
Node js + express + TS. Serves together as record and crawling REST API. Documented using swager docs accessible at: `http://localhost:5000/api/v1/docs/`.

`container name: crawler`

## Crawling engine
Parallel crawler written in C++ using C CURL to download pages.

The default communication is done via stdout and stdin.

Crawler specifies corresponding communication protocol in [CRAWLING_PROTOCOL.md](https://github.com/Cross-bit/web_crawler/blob/master/crawler/crawler_engine/src/CRAWLING_PROTOCOL.md)
(NOTE!!: Can be incomplete, or include some inaccuracies...)

`in dir: crawler`

## Crawled data read service
Node js + express + TS backend designed to cache crawled data, serve clients graph data requests and notify them on change.

Also exposes graphql endpoint: http://localhost:5500/api/v1/graphql

With following schema:

```graphql
type Query {
  websites: [WebPage!]!
  nodes(webPages: [ID!]): [Node!]!
}

type WebPage {
  identifier: ID!
  label: String!
  url: String!
  regexp: String!
  tags: [String!]!
  active: Boolean!
}

type Node {
  title: String
  url: String!
  crawlTime: String
  links: [Node!]!
  owner: WebPage!
}
```

`container name: crawled_data_ws`

## Rabbit MQ
Messaging queue that distributes newly crawled data among the services. 
In the application the Crawling backend serves as a producer and crawled data read service as a consumer.

`container name: rabbitmq`

## Database
Single Postgres database.

`container name: database`

## Crawling tester
Node js + express + TS. Generator for random HTML graphs, for crawling testing.

`container name: crawling_tester`

# Development
`docker-compose up` brings the entire stack up for development. You also want to run `npm install` in the `client` folder so the `node_modules` directory will also be populated on your host machine, so IntelliSense and similar features will work.

See the `docker-compose.yaml` and `.evn` files for port numbers of the individual services.

**Generating a Test Graph for Crawling:**

You can generate a test graph for crawling as follows:
- Visit http://localhost:7000/generate/{size_of_the_graph}.
- This will generate test graph and store it into a JSON file as well as generate the HTML static pages.
- The generated graph can be visualized at http://localhost:7000/graph.

The graph is now accessible from the host machine at http://localhost:7000/generate/node-{k}.html, where k is the node ID ranging from 0 to size_of_the_graph.

NOTE: Since the whole application runs in docker, for the purposes of the crawling, you have to use the name of the docker container `crawler_tester`.
So for crawling, the URL will be: `http://crawler_tester:7000/node-0.html`.
(but there is a default Example record in the database already)


<!--
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


-->