import { useCurrentUser } from '@/hooks/user';
import React, { useCallback, useMemo } from 'react'
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import Image from 'next/image'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';
import { graphQLClient } from '@/clients/api';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {useRouter} from 'next/router'


interface TwitterlayoutProps{
    children:React.ReactNode,
}



interface TwitterSidebarButton{
    title: string,
    icon : React.ReactNode,
    link : string
  }
  




  const Twitterlayout: React.FC<TwitterlayoutProps>=(props)=>{
    const {user}=useCurrentUser();
    const queryClient=useQueryClient();
    const router=useRouter();

    const sidebarMenuItems: TwitterSidebarButton[]=useMemo(()=>[
      {
        title : 'Home',
        icon : <BiHomeCircle/>,
        link : '/'
      },
      {
        title :'Explore',
        icon : <BiHash/>,
        link : '/'
      },
      {
        title :'Notification',
        icon : <BsBell/>,
        link : '/'
      },
      {
        title :'Messages',
        icon : <BsEnvelope/>,
        link : '/'
      },
      {
        title :'Bookmarks',
        icon : <BsBookmark/>,
        link : '/'
      },
      {
        title :'Twitter Blue',
        icon : <BiMoney/>,
        link : '/'
      },
      {
        title :'Profile',
        icon : <BiUser/>,
        link : `/${user?.id}`
      }
    
    ],[user?.id])

    const handleLoginWithGoogle=useCallback(async(cred:CredentialResponse)=>{

        const googleToken=cred.credential
        if(!googleToken) return toast.error(`Google Token not found`)

        const {verifyGoogleToken}=await graphQLClient.request(verifyUserGoogleTokenQuery, {token:googleToken})

        toast.success("Verified Success");

        if(verifyGoogleToken)
        {
            window.localStorage.setItem('__twitter_token',verifyGoogleToken)
        }

        await queryClient.invalidateQueries(["current-user"]);

    },[queryClient]);

    return (

        <div className='grid grid-cols-12 h-screen w-screen sm:px-56'>

          <div className='col-span-1 sm:col-span-3 pt-1 sm:justify-end pr-4 flex relative'>
            <div>
            <div className='text-4xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all'>
            <BsTwitter/>
            </div>
            <div className='mt-4 text-2xl pr-4'>
              <ul>
                {sidebarMenuItems.map((item)=>(
                  <li key={item.title}>
                    <Link className='flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-5 py-3 w-fit cursor-pointer' href={item.link}>
                    <span className='text-3xl'>{item.icon}</span>
                    <span className='hidden sm:inline'>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
                  <div className='mt-5 px-3'>
                  <button className='hidden sm:block bg-[#1d9bf0] font-semibold text-lg px-4 py-2 rounded-full w-full'>Tweet</button>
                  </div>
                    
                  <div className='mt-5 px-3'>
                  <button className='block sm:hidden bg-[#1d9bf0] font-semibold text-lg px-4 py-2 rounded-full w-full'>
                    <BsTwitter/>
                   </button>
                  </div>

            </div>

            </div>

            <div className='absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full'>
              {
              user && user.profileImageURL && <><Image 
              className='rounded-full'
              src={user?.profileImageURL} 
              alt="user-img" 
              height={50}
              width={50}
              />
              <div className='hidden sm:block'>
              <h3 className='text-xl'>
                {user.firstName} {user.lastName}
              </h3>
            </div>
            </>
            }
            </div>
            
          
        </div>

        <div className='col-span-11 sm:col-span-6 border-r-[1px] border-l-[1px] border border-gray-400 h-screen overflow-auto no-scrollbar'>
          
          {props.children}

        </div>

        <div className='col-span-0 sm:col-span-3 p-5 w-fit'>
          
        {!user && <div className=' p-12 bg-slate-700'>
            <h4 className='my-2 text-xl'>New to Twitter?</h4> 
          <GoogleLogin  onSuccess={handleLoginWithGoogle}></GoogleLogin>
          </div>
          }
        </div>
      </div>


    )
  };


  export default Twitterlayout;