import { PubSub}  from "apollo-server-express"
import {Redis} from 'ioredis';

export interface Context {
    pubsub : PubSub;
    req : any;
    redis: Redis;
    url: String;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info : any
 ) => any;

 export interface ResolverMap {
     [key:string]:{
         [key:string]: Resolver |{ [key:string] : Resolver };
     };
 }