import { PubSub}  from "apollo-server-express"

export interface Context {
    pubsub : PubSub;
    req : any;
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