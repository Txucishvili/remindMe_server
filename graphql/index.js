import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './types';
import resolvers from './resolvers';
const logger = { log: e => console.error(e.stack) };

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger
});
