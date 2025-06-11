import React from 'react'
import { Route, Routes} from "react-router"

import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'

const App = () => {
  // axios instance
  // react query tanstack query
  const {data, isLoading, error} = useQuery({
    queryKey: ['todos'], 
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me"); 
      return res.data; 
    },
  });
  
  console.log(data, isLoading, error);
  return <div className=' h-screen text-5xl ' data-theme = "night">
    <button onClick={() => toast.error("Hello world")}>Onclick </button>
    <Routes>
      <Route path='/' element = {<HomePage/>} />
      <Route path='/login' element = {<LoginPage/>} />
      <Route path='/signup' element = {<SignUpPage/>} />
      <Route path='/notifications' element = {<NotificationPage/>} />
      <Route path='/onboarding' element = {<OnboardingPage/>} />
      <Route path='/call' element = {<CallPage/>} />
      <Route path='/chat' element = {<ChatPage/>} />
    </Routes>

    <Toaster/>
  </div>
}

export default App