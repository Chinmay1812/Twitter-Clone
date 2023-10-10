import JWT_SERVICE from "../../services/jwt";
import axios from "axios";
import {prismaClient} from '../../clients/db/index'
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";

interface GoogleTokenResult
{ 
        iss?: string;
        nbf?: string;
        aud?: string;
        sub?: string;
        email:string; 
        email_verified:string; 
        azp?:string; 
        name?:string;
        picture?:string; 
        given_name: string;
        family_name?:string; 
        iat?:string;
        exp?:string; 
        jti?:string; 
        alg?:string; 
        kid?:string; 
        typ?:string; 
}

const queries={
    verifyGoogleToken: async(parent:any,{token}:{token:string})=>{
        const resultToken=await UserService.verifyGoogleAuthToken(token);
        return resultToken;
    },


    getCurrentUser: async(parent:any,args:any,ctx:GraphqlContext)=>{

        console.log("ctx",ctx);
        const id=ctx.user?.id;
        if(!id) return null;

        const user=await UserService.getUserById(id);

        return user;
    },

    getUserById: async(parent:any,{id}:{id:string},
        ctx:GraphqlContext)=> UserService.getUserById(id),

};


const extraResolvers={

    User:{
        tweets:(parent:User)=> prismaClient.tweet.findMany({where:{author:{id:parent.id}}})
    }

}

export const resolvers={queries,extraResolvers};