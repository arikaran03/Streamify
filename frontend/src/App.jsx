import React from 'react'
import { Navigate, Route, Routes} from "react-router"

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
  const {data:authData, isLoading, error} = useQuery({
    queryKey: ['authUser'], 
    queryFn: async () => {
      const res = await axiosInstance.get("http://localhost:5173/api/"); 
      return res.data; 
    },
    retry : false, // Disable retry on failure
  });
  
  // console.log(data, isLoading, error);
  const authUser = authData?.user;

  return <div className=' h-screen text ' data-theme = "night">
    <button onClick={() => toast.error("Hello world")}>Onclick </button>
    <Routes>
      <Route path='/' element = {authUser?<HomePage/>: <Navigate to="/login" />} />
      <Route path='/login' element = {!authUser ? <LoginPage/> : <Navigate to="/"/>} />
      <Route path='/signup' element = { !authUser ? <SignUpPage/> : <Navigate to="/"/>} />
      <Route path='/notifications' element = {authUser ? <NotificationPage/> : <Navigate to="/login" />} />
      <Route path='/onboarding' element = {authUser ? <OnboardingPage/> : <Navigate to="/login" />} />
      <Route path='/call' element = {authUser ? <CallPage/> : <Navigate to="/login" />} />
      <Route path='/chat' element = {authUser ? <ChatPage/> : <Navigate to="/login" />} />
    </Routes>

    <Toaster/>
  </div>
}

export default App