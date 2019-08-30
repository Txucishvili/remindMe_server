import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import {ApolloServer} from 'apollo-server-express';
import Routers from './controllers';
import {schema} from './graphql/index';
import {Users, Theater} from './mongoose/schemas';
import AuthenticationService from "./services/Authentication.service";

const mongooseURL = 'mongodb://opt:remindME122@ds213538.mlab.com:13538/remindme';

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


const server = new ApolloServer({
  schema,
  context: async ({req}) => {
    const user = await AuthenticationService.getUser(req.headers, Users);
    let validModels = {};

    if (!user) {
      console.warn('Not sign in');
      validModels = {
        Users
      };
    } else {
      user.role = 'ADMIN';
      validModels = {
        Users,
        Theater
      };
    }

    return {
      user,
      db: validModels
    };
  },
  playground: {
    endpoint: `http://localhost:${API_PORT}/graphql`
  }
});

server.applyMiddleware({app, path: '/graphql'});

// start

app.listen(API_PORT, () => {
  console.log(`🚀 LISTENING ON PORT http://localhost:${API_PORT}`);
});
