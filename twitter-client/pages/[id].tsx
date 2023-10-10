import Twitterlayout from "@/components/Layout/TwitterLayout";
import type {GetServerSideProps, NextPage} from "next";
import { BsArrowLeftShort } from "react-icons/bs";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { useRouter } from "next/router";
import { graphQLClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { User } from "@/gql/graphql";


interface ServerProps{
    userInfo?:User
}




const UserProfilePage: NextPage<ServerProps>=(props)=>{

    const router=useRouter();

    return (
        <div>
            <Twitterlayout>
                <div>
                    <nav className="flex items-center gap-3 py-3 px-3">
                        <BsArrowLeftShort className="text-4xl"/>
                        <div>
                            <h1 className="text-2xl font-bold">Chinmay Jain</h1>
                            <h1 className="text-sm font-bold text-slate-500">{props.userInfo?.tweets?.length} Tweets</h1>
                        </div>
                    </nav>

                    <div className="p-4 border-b border-slate-800">
                   { props.userInfo?.profileImageURL && <Image src={props.userInfo?.profileImageURL} 
                   className="rounded-full" 
                   alt="user-img" 
                   width={100} 
                   height={100}
                   />}
                   <h1 className="text-2xl font-bold">Chinmay Jain</h1>
                    </div>
                    <div>
                        {props.userInfo?.tweets?.map(tweet=><FeedCard data={tweet as Tweet} key={tweet?.id} />)}
                    </div>
                </div>
            </Twitterlayout>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<ServerProps>=async(context)=>{
    const id=context.query.id as string|undefined

    if(!id) return {notFound:true}

    const userInfo=await graphQLClient.request(getUserByIdQuery,{id})

    if(!userInfo?.getUserById) return {notFound:true,props:{user:undefined}}


    return {
        props:{
            userInfo:userInfo.getUserById as User,
        },
    };
}


export default UserProfilePage;