import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {ApolloServer, gql} from 'apollo-server-express';
import Routers from './controllers';
import {schema} from './graphql/index';
import {Users, Posts, Theater} from './mongoose/schemas';
import {commonModule} from "./graphql/modules/common-module";
import {authModule} from "./graphql/modules/auth-module";
import {articlesModule} from "./graphql/modules/articles-module";
import {resolversComposition} from "./graphql/modules/resolvers-composition";
import {GraphQLModule} from "@graphql-modules/core";

import typeDefs from './graphql/types';
import resolvers from './graphql/resolvers';

const mongooseURL = 'mongodb://opt:remindME122@ds213538.mlab.com:13538/remindme';
import {
  IsAuthDirective,
  HasRoleDirective,
} from './graphql/directives';


// app
const API_PORT = 3001;

const app = express();
mongoose.connect(mongooseURL, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(logger("dev"));

// Ruting init
app.use(Routers);

// init mongoose
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("🗂 MongoDB connected"));

const saltRounds = 10;

const secret = 'secret_code_area';
const issuer = 'app_init';
const audience = 'app_record';

const getUser = async (token) => {
  let decoded = {};

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

const graphqRootModule = new GraphQLModule({
  imports: [commonModule],
  resolversComposition,
});


// const {schema, context} = graphqRootModule;
// console.log('context', schema);

const server = new ApolloServer({
  schema,
  context: async ({req}) => {
    const token = req.headers.authorization || '';
    const user = await getUser(token);

    if (!user) {
      console.warn('Not sign in');
    }

    return { user, db: { Users,  Theater, Posts } };
  },
  playground: {
    endpoint: `http://localhost:${API_PORT}/graphql`
  },
  schemaDirectives: {
    isAuth: IsAuthDirective,
    hasRole: HasRoleDirective,
  },
});

// const server = new ApolloServer({
//   schema,
//   playground: {
//     endpoint: `http://localhost:${API_PORT}/graphql`
//   },
//   // context: async ({req}) => {
//   //   const token = req.headers.authorization || '';
//   //
//   //   // try to retrieve a user with the token
//   //   const user = await getUser(token);
//   //   console.log('Auth -', user);
//   //
//   //   // optionally block the user
//   //   // we could also check user roles/permissions here
//   //   if (!user) {
//   //     // throw new Error('Please sign in');
//   //   }
//   //
//   //   // add the user to the context
//   //   return {
//   //     me: user
//   //   };
//   // }
// });

server.applyMiddleware({app, path: '/graphql'});


// start
app.listen(API_PORT, () => {
  console.log(`🚀 LISTENING ON PORT http://localhost:${API_PORT}`);
});
