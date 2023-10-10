import axios from "axios";
import { prismaClient } from "../clients/db";
import JWT_SERVICE from "./jwt";

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


class UserService{

    public static async verifyGoogleAuthToken(token:string){

        const googleToken=token;
        const googleOauthURL=new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOauthURL.searchParams.set('id_token',googleToken);//This line sets the id_token parameter in the URL's search parameters with the value of the googleToken. This is how the ID token is passed to the tokeninfo endpoint for validation.
        console.log(googleOauthURL);
        const {data}=await axios.get<GoogleTokenResult>(  // <GoogleTokenResult> is used to specify the expected response data type.
            //after sending credentials to google , a data is received with details 
            googleOauthURL.toString(),
            {responseType : 'json'},
            
        );
        
        const user=await prismaClient.user.findUnique({where:{email:data.email}})// checking if user exist in DB or not

        if(!user)
        {
            await prismaClient.user.create({
                data:{
                    email:data.email,
                    firstName:data.given_name,
                    lastName:data.family_name,
                    profileImageURL: data.picture,
                },
            });
        }

        const userInDb=await prismaClient.user.findUnique({
            where : {email:data.email},
        });
        console.log(userInDb);
        if(!userInDb){
            throw new Error("User with email not found");
        }

        const userToken=await JWT_SERVICE.generateTokenForUser(userInDb);
        console.log(userToken);
        return userToken;

    }

    public static getUserById(id: string){
        return prismaClient.user.findUnique({where:{id}});
    }

}

export default UserService;