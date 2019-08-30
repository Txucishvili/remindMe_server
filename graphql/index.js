import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './types';
import resolvers from './resolvers';
import AuthDirective from "./directives/Auth.directive";
import RolesDirective from "./directives/Roles.directive";
const logger = { log: e => console.error(e.stack) };

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuth: AuthDirective,
    roles: RolesDirective
  },
  logger
});
