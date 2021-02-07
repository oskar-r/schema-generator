import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import {mySchema} from '../schema';
 
//var schema = buildSchema(mySchema);
 
//var root = { hello: () => 'Hello world!' };
const server = new ApolloServer({ typeDefs:mySchema });

const app = express();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);