import { PubSub}  from "apollo-server-express"

export interface Context {
    pubsub : PubSub;
    request : any;
}

export type Resolver = (
    parent: any,
    args: any,
    contect: Context,
    info : any
 ) => any;

 export interface ResolverMap {
     [key:string]:{
         [key:string]: Resolver |{ [key:string] : Resolver };
     };
 }