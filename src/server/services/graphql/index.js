import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

import Resolvers from './resolvers';
import Schema from './schema';

/**
 * The makeExecutableSchema function throws an error when you 
 * define a query or mutation that is not in the schema. The 
 * resulting schema is executed by our GraphQL server resolving 
 * the data or running the mutations we request
 */
const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers
});

/**
 * We pass this as a schema parameter to the Apollo Server. 
 * The context property contains the request object of 
 * Express.js. In our resolver functions, we can access 
 * the request if we need to
 */
const server = new ApolloServer({
  schema: executableSchema,
  context: ({ req }) => req
});

// exports the initialized server object, 
// which handles all GraphQL requests
export default server;