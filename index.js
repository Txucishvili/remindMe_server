import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import Routers from './controllers';
import {schema} from './graphql/index';
import {Users, Theater, Tokens, Reminders, FinderModel} from './mongoose/schemas';
import AuthenticationService from "./services/Authentication.service";

const mongooseURL = 'mongodb://opt:remindME122@ds213538.mlab.com:13538/remindme';

// app
const API_PORT = 3001;

const app = express();
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

const httpServer = http.createServer(app);

// For http
httpServer.listen(8080);

const server = new ApolloServer({
  schema,
  context: async ({req}) => {
    const tokenCheck = await AuthenticationService.checkUser(req.headers, {Users, Tokens});
    const decodeToken = await AuthenticationService.jsonDecode(req.headers.authorization);
    let validModels = {};

    console.log('tokenCheck:', tokenCheck);

    if (tokenCheck.error) {
      switch (tokenCheck.type) {
        case 1:
          throw new AuthenticationError('Error on Decode Token');
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
  playground: true,
});

server.applyMiddleware({app, path: '/graphql'});

// start

app.listen(API_PORT, () => {
  console.log(`🚀 LISTENING ON PORT http://localhost:${API_PORT}`);
});
