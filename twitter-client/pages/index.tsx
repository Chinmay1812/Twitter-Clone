import { BiImageAlt} from 'react-icons/bi'
import React, { useCallback, useEffect, useState } from 'react'
import FeedCard from '@/components/FeedCard'
import { useCurrentUser } from '@/hooks/user';
import Image from 'next/image'
import { useCreateTweet, useGetAllTweets } from '@/hooks/tweet';
import Twitterlayout from '@/components/Layout/TwitterLayout';
import { graphQLClient } from '@/clients/api';
import { GetServerSideProps } from 'next';
import { getAllTweetsQuery, getSignedURLForTweetQuery } from '@/graphql/query/tweet';
import { Tweet } from '@/gql/graphql';
import toast from 'react-hot-toast';
import axios from 'axios';


interface HomeProps{
  tweets?:Tweet[]

}



export default function Home(props: HomeProps) {

  const {user}=useCurrentUser();

  const {mutateAsync}=useCreateTweet();
  const {tweets=props.tweets as Tweet[]}=useGetAllTweets()
  const [content,setContent]=useState('')
  const [imageURL,setImageURL]=useState('')
  



  const handleInputChangeFile=useCallback((input:HTMLInputElement)=>{

    return async(event:Event)=>{

      event.preventDefault();
      const file: File| null | undefined=input.files?.item(0);

      if(!file) return; 

      const {getSignedURLForTweet}=await graphQLClient.request(getSignedURLForTweetQuery,{

        imageName:file.name,
        imageType:file.type
      })



      if(getSignedURLForTweet)
      {
        toast.loading('Uploading...',{id:'2'})
        await axios.put(getSignedURLForTweet,file,{
          headers:{
            'Content-Type': file.type
          }
        })
        toast.success('Upload Completed',{id:'2'})

        const url=new URL(getSignedURLForTweet);
        const myFilePath=`${url.origin}${url.pathname}`
        
        setImageURL(myFilePath);
      }
    }

  },[])




  const handleSelectImage=useCallback(()=>{

    const input=document.createElement('input');
    input.setAttribute('type','file');
    input.setAttribute('accept','image/*')

    const handlerFn=handleInputChangeFile(input);

    input.addEventListener("change",handlerFn);


    input.click();


  },[handleInputChangeFile])

  
    const handleCreateTweet=useCallback(async()=>{

      mutateAsync({
        content,
        imageURL
      });
      setContent('');
      setImageURL('')
    },[content,mutateAsync,imageURL]);

  return (
      <Twitterlayout>
      <div className='col-span-6 border-r-[1px] border-l-[1px] border border-gray-400 h-screen overflow-auto no-scrollbar'>
          
          <div>
           <div className='border border-l-0 border-r-0 border-b-0 border-gray-600 p-5  hover:bg-slate-900 transition-all cursor-pointer'>
              <div className='grid grid-cols-12 gap-3'>
                <div className='col-span-1 '>
                  {
                  user?.profileImageURL && 
                  <Image 
                  className='rounded-full' 
                  src={user?.profileImageURL}
                  alt='user-image'
                  height={50} 
                  width={50}
                  />}
              </div> 
              <div className='col-span-11'>
                <textarea 
                value={content}
                onChange={(e)=>{setContent(e.target.value)}}
                className='w-full bg-transparent text-xl px-3 border-b border-slate-700' 
                placeholder='What is happening?!'
                rows={3}>
                </textarea>
                {
                  imageURL && <Image src={imageURL} alt='tweet-image' height={300} width={300} />

                }
                <div className='mt-2 flex justify-between items-center'>
                  <BiImageAlt onClick={handleSelectImage} className='text-xl'/>
                  <button
                   onClick={handleCreateTweet}

                   className='bg-[#1d9bf0] font-semibold text-sm px-4 py-2 rounded-full'>
                    Tweet
                  </button>
                </div>
                
              </div> 
            </div>
           </div>
          </div>
          {
            tweets?.map(tweet=> tweet ?<FeedCard key={tweet?.id} data={tweet as Tweet}/> : null)
          }
        </div>
      </Twitterlayout>
    
  )
}

export const getServerSideProps:GetServerSideProps<HomeProps>=async(context)=>{

  const allTweets=await graphQLClient.request(getAllTweetsQuery);

  return {

    props:{
      tweets: allTweets.getAllTweets as Tweet[]
    }


  }


}
function mutateAsync(arg0: { content: string; imageURL: string; }) {
  throw new Error('Function not implemented.');
}

