import { User } from '@prisma/client';
import JWT from "jsonwebtoken"
import { JWTUser } from '../interfaces';

const JWT_SECRET="$uper@1234.";

class JWT_SERVICE{
    public static async generateTokenForUser(user:User)
    {
        const payload:JWTUser={
            id:user?.id,
            email:user?.email,
        }
        const token=JWT.sign(payload,JWT_SECRET);
        return token;
    }

    public static decodeToken(token:string){

        try{
            return JWT.verify(token,JWT_SECRET) as JWTUser;
        }catch(error){
            return null;
        }
        
    }



}
export default JWT_SERVICE;

// user?.id: This is called optional chaining, denoted by the ?. operator. It ensures that if the user object is null or undefined, accessing the id property won't throw an error, and the result will be undefined.