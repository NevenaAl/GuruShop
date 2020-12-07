import "reflect-metadata";
import {Any, createConnection} from "typeorm";
import {config} from '../config/constants';
import {User} from './entity/User';
import isAuth from './handlers/checkAuth'
import * as express from 'express';
import  { ApolloServer, gql,PubSub}  from 'apollo-server-express';
// import {PubSub} from 'graphql-subscriptions'
import {json} from 'body-parser'
import path = require("path");
import http = require("http");
import {createServer} from 'http';
import appUse from './routes/Index'
import {importSchema} from 'graphql-import'
import {resolvers} from './resolvers/rootResolver'
import {redis} from './handlers/redis';
import {checkMail} from './routes/CheckMail';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {execute,subscribe, GraphQLSchema} from 'graphql';
const  {graphqlHTTP}  = require('express-graphql');
const {makeExecutableSchema}  = require("graphql-tools")

const typeDefs=importSchema(path.join(__dirname,"./schema/schema.graphql"));


console.clear();
(async()=>{
  
const pubsub = new PubSub();

const app = express();

const server = new ApolloServer({ typeDefs, resolvers,
  context(req){
    return {
      pubsub,
      req,
      redis,
      url: req.req.protocol + "://" + req.req.get("host")
    }
} });

app.use('/graphql',json())
app.use('/confirmMail/:id?',checkMail)
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