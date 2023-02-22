import { GraphQLClient } from 'graphql-request'
//import db from './connection'
import * as dbInterface from '../interface';

export const GetAllPlannedExecutions = async () => {
   // return await sdk.GetAllPlannedExecutions();

 //  db.query("SELECT * ")
   
}
/*
query GetAllPlannedExecutions {
   executions {
     id
     creation
     execution_start
     execution_status
     execution_time
     record {
       active
       boundary
       id
       label
       periodicity
       url
     }
   }
 }*/
 