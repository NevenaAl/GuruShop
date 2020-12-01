import "reflect-metadata";
import {createConnection} from "typeorm";
import {config} from '../config/constants';
import {User} from './entity/User';
import isAuth from './handlers/checkAuth'
import * as express from 'express';
import  { ApolloServer,gql, PubSub }  from 'apollo-server-express';
import {json} from 'body-parser'
import path = require("path");
import * as http from 'http'
import appUse from './routes/Index'
import {importSchema} from 'graphql-import'
import {resolvers} from './resolvers/rootResolver'

const typeDefs = importSchema(path.join(__dirname,"./schema/schema.graphql"));

console.clear();
(async()=>{
  
const pubsub = new PubSub();

const app = express();

const server = new ApolloServer({ typeDefs, resolvers,
  context(req){
    return {
      pubsub,
      req
    }
} });

app.use('/graphql',json())
app.use(express.json());
app.use(express.urlencoded());
app.use(isAuth);
app.use('/images',express.static(path.join(__dirname,'images')));
appUse(app);
server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

await createConnection()

httpServer.listen({port: config.port},()=>{
  console.log(`Server listening at http://localhost:${config.port}${server.graphqlPath}`);
  console.log(`WebSocket subscription ready at ws://localhost${config.port}${server.subscriptionsPath}`);
})

})()