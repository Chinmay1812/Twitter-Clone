import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Tweet } from './tweet';
import { User } from './user'
import { GraphqlContext } from '../interfaces';
import JWT_SERVICE from '../services/jwt';

export async function initServer(){
    const app=express();

    app.use(bodyParser.json());
    app.use(cors());
    const server = new ApolloServer<GraphqlContext>({
        typeDefs:`
        
        ${User.types}
        ${Tweet.types}
        
        type Query{
            ${User.queries}
            ${Tweet.queries}
        }

        type Mutation {
            ${Tweet.mutations}
        }

        `,
        resolvers:{
            Query : {
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries,
            },

            Mutation:{
                ...Tweet.resolvers.mutation,
            },

            ...Tweet.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers,
        },
      });

      
      await server.start();

      app.use('/graphql',expressMiddleware(server,{

        context:async({req,res})=>{

            return {
                user:req.headers.authorization ? 
                JWT_SERVICE.decodeToken(req.headers.authorization.split("Bearer ")[1]):undefined,
            };

         },

        },
         )
       )
      return app;
}