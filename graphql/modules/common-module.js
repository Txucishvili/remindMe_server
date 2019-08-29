import { GraphQLModule } from '@graphql-modules/core';
import { gql } from 'apollo-server-express';

export const commonModule = new GraphQLModule({
  name: 'common',
  typeDefs: gql`
      type Query {
          serverTime: String
      }
  `,
  resolvers: {
    Query: {
      serverTime: () => new Date(),
    },
  }
});
