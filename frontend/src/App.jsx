import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage, SettingsPage, SignUpPage, LoginPage, ProfilePage } from './pages'; 
import Navbar from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';
import {Loader} from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';

export const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log("Auth", authUser)

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />}/>
        <Route path='/signup' element={!authUser ? <SignUpPage />: <Navigate to={"/"} />}  />
        <Route path='/login' element={!authUser ? <LoginPage />: <Navigate to={"/"} />}  />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}  />
        <Route path='/settings' element={<SettingsPage /> }  />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;
