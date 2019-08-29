import { GraphQLModule } from '@graphql-modules/core';
import jwt from "jsonwebtoken";
import {gql} from "apollo-server-express";
import {Users} from "../../mongoose/schemas";

const HEADER_NAME = 'authorization';
const getUser = async (token) => {
  let decoded = {};
  const saltRounds = 10;

  const secret = 'secret_code_area';
  const issuer = 'app_init';
  const audience = 'app_record';

  await jwt.verify(token, secret, {
    issuer,
    audience,
  }, function (err, dec) {
    decoded = dec;
  });

  if (!decoded) return null;

  const user = await Users.findById(decoded.id);
  const {firstName, lastName, _id, email, l_status} = user;

  const userModel = {
    firstName,
    lastName,
    email,
    l_status,
    id: _id.toString()
  };

  return userModel;
};

export const authModule = new GraphQLModule({
  name: 'auth',
  typeDefs: gql`
      directive @auth on FIELD
      directive @protect(role: String) on FIELD
      
      type Query {
          me: User
      }
      
      type User {
          id: ID!
          username: String!
      }
  `,
  resolvers: {
    Query: {
      me: (root, args, { currentUser }) => currentUser,
    },
    User: {
      id: user => user._id,
      username: user => user.username,
    },
  },
  contextBuilder: async ({ req }) => {
    let authToken = null;
    let currentUser = null;

    console.log('hit');

    try {
      authToken = req.headers[HEADER_NAME];

      if (authToken) {
        currentUser = await getUser(authToken);
      }
    } catch (e) {
      console.warn(`Unable to authenticate using auth token: ${authToken}`);
    }

    console.log('currentUser', currentUser);

    return {
      authToken,
      currentUser,
    };
  },
});
