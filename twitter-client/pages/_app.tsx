import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider,QueryClient} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const inter = Inter({ subsets: ['latin'] })

const queryClient=new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return <div className={inter.className}>
    <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId='985594286990-7m4glmq7vm5jho1mdsgguqptq1af6jns.apps.googleusercontent.com'>
    <Component {...pageProps} />
    <Toaster/>
    <ReactQueryDevtools/>
    </GoogleOAuthProvider>
    </QueryClientProvider>
  </div>
}
// clientId='955871238965-kvq0ask0vmhv9vht3gc1pv2cu59s8ea0.apps.googleusercontent.com'