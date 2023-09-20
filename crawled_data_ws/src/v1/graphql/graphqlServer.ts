import fs from 'fs'
import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql'


const filePath = __dirname + '/schema.graphql'
const schemaSrc = fs.readFileSync(filePath, 'utf8')


const websitesData = [
  {
    identifier: '1',
    label: 'Example.com',
    url: 'https://www.example.com',
    regexp: '',
    tags: ['example', 'website'],
    active: true,
  },
];


const nodesData = [
  {
    title: 'Homepage',
    url: 'https://www.example.com',
    crawlTime: '2023-09-20T12:00:00Z',
    links: [],
    owner: websitesData[0],
  },
  // Add more node data as needed
];

const schema = buildSchema(schemaSrc);


const rootResolver = {
    hello: (): string => 'Hello, GraphQL!',
    websites: () => websitesData,
    nodes: ({ webPages: recordIds }: {webPages: any[]}) => {
      
      if (!recordIds) {
        // Return all nodes if no specific webPages are provided
        return nodesData;
      }

      // Filter nodes by the provided webPages
      return nodesData.filter((node) => recordIds.includes(node.owner.identifier));
    },
};

const app = express();

app.use('/v1', graphqlHTTP({
    schema,
    rootValue: rootResolver,
    graphiql: true,
}));


export default app;



