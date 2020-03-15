import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import Routers from './controllers';
import {schema} from './graphql/index';
import {FinderModel, Reminders, Theater, Tokens, Users} from './mongoose/schemas';
import AuthenticationService from "./services/Authentication.service";
import {config, environment} from "./config/config";
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from './webpack.config';
import webpack from 'webpack';

console.log('config', config);


const mongooseURL = config.MONGO_URL;

// app
const API_PORT = config.APP_PORT;

const app = express();
// app.use(webpackMiddleware(webpack(webpackConfig)));

mongoose.connect(mongooseURL, {useNewUrlParser: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
// app.use(logger("dev")); // TODO: uncomment

// Ruting init
app.use(Routers);

// init mongoose
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("🗂 MongoDB connected"));

const server = new ApolloServer({
  schema,
  context: async ({req}) => {
    const tokenCheck = await AuthenticationService.checkUser(req.headers, {Users, Tokens});
    const decodeToken = await AuthenticationService.jsonDecode(req.headers.authorization);
    let validModels = {};

    // TODO: some Token validations correction
    // TODO: Auth and Public db correction

    console.log('tokenCheck:', tokenCheck);

    if (tokenCheck.error) {
      switch (tokenCheck.type) {
        case 2:
          throw new AuthenticationError('Error tokenExp');
        case 3:
          throw new AuthenticationError('Error on User');
        default:
          console.log('Default');
      }
    }

    if (tokenCheck.error && tokenCheck.type === 0) {
      console.warn('Not sign in');
      validModels = {
        Users,
        Tokens
      };
    } else if (tokenCheck.error && tokenCheck.type === 1) {
      console.log('Not valid Token');
      validModels = {
        Users,
        Tokens
      };
    } else if (!tokenCheck.error && tokenCheck.data) {
      tokenCheck.data.role = 'ADMIN';
      validModels = {
        Users,
        Tokens,
        Theater,
        Reminders,
        FinderModel
      };
    }

    return {
      user: tokenCheck.data ? tokenCheck.data : false,
      db: validModels
    };
  },
  introspection: true,
  playground: environment.isDevelopment,
});

server.applyMiddleware({app, path: '/graphql'});
console.log('process.env.PORT', process.env.PORT);
// start
app.listen(process.env.PORT || API_PORT, () => {
  console.log(`🚀 LISTENING ON PORT http://localhost:${API_PORT}`);
});
