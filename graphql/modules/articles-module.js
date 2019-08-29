import { GraphQLModule } from '@graphql-modules/core';
import { gql } from 'apollo-server-express';
import {authModule} from "./auth-module";

export const articlesModule = new GraphQLModule({
  name: 'articles',
  imports: [authModule], //authModule must be imported, because this module uses currentUser in the context
  typeDefs: gql`
      type Article {
          id: ID!
          title: String!
          content: String!
      }
      type Mutation {
          publishArticle(title: String!, content: String!): Article!
      }
  `,
  resolvers: {
    Mutation: {
      publishArticle: (root, { title, content }, { currentUser }) =>
        createNewArticle(title, content, currentUser),
    },
  }
});
