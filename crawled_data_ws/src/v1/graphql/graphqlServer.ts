import fs from 'fs'
import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql'
import { GetAllEdgesByRecordIds, GetNodesByRecordIdsQuery as GetNodesByRecordIds } from '../../database/postgress/graphDataDatabase'
import { GetAllRecordsByIds, GetAllRecordsWithTags } from '../../database/postgress/recordsDatabase'
import {GetAllNodesDataByRecordIds, GetAllWebPages} from '../../services/GraphQL/graphqlService'



const filePath = __dirname + '/schema.graphql'
const schemaSrc = fs.readFileSync(filePath, 'utf8')


const schema = buildSchema(schemaSrc);

const rootResolver = {
    hello: (): string => 'Hello, GraphQL!',
    websites: async () => {

      const resutl = await GetAllWebPages();
      console.log(resutl);

      return resutl;

    },
    nodes: async ({ webPages: recordIds }: {webPages: any[]}) => {
    
      if (!recordIds) {
        return "Error";
      }

      const recordIdsParsed: number[] = recordIds.map(Number);

      const resutl = await GetAllNodesDataByRecordIds(recordIdsParsed);

      return resutl;
    },
};

const app = express();

app.use('/v1', graphqlHTTP({
    schema,
    rootValue: rootResolver,
    graphiql: true,
}));


export default app;



