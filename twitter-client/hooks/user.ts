import { graphQLClient } from "@/clients/api";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserQuery } from "@/graphql/query/user";

export const useCurrentUser=()=>{

    const query=useQuery({
        queryKey:['current-user'],  //This array is used as a cache key to identify this specific query
        queryFn: ()=>graphQLClient.request(getCurrentUserQuery)
    });
    return {...query,user: query.data?.getCurrentUser};
}


