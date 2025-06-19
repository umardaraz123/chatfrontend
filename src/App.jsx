import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import Listings from './pages/Listings'
import DashBoard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import LikesPage from './pages/LikesPage'
import MatchesPage from './pages/MatchesPage'
import ChatContent from './pages/ChatContent'
import SwipePage from './pages/SwipePage';
import FriendsPage from './pages/FriendsPage'
import { Routes,Route, Navigate, useLocation } from 'react-router-dom'
import DropBoxPage from './pages/DropBoxPage'
import { useAuthStore } from './store/useAuthStore'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
import DashboardLayout from './pages/DashboardLayout'
const App = () => {
  const {authUser,checkAuth,isCheckingAuth}= useAuthStore();
  const location = useLocation();
  
  useEffect(()=>{
    console.log('🚀 App component mounted, calling checkAuth...');
 checkAuth()
  },[checkAuth])
  console.log('Auth Debug:', { 
    authUser: authUser ? 'User exists' : 'No user', 
    isCheckingAuth, 
    pathname: location.pathname,
    userDetails: authUser ? { id: authUser._id, email: authUser.email } : null
  });
  
  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className='main-loader'>
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Check if current route includes "dashboard"
  const isDashboardRoute = location.pathname.includes('/dashboard');
  
  return (
    <div >
      {!isDashboardRoute && <Navbar />}
      <Routes>
        <Route path='/' element={ <HomePage />} />
        <Route path="/" element={authUser ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route path="/dashboard/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={authUser ? <DashBoard /> : <Navigate to="/login" />} />
          <Route path='/dashboard/find-love-one' element={authUser ? <Listings /> : <Navigate to='/login' />} />
          <Route path='/dashboard/chat' element={authUser ? <ChatContent /> : <Navigate to='/login' />} />
          <Route path="/dashboard/swipe" element={<SwipePage />} />
          <Route path="/dashboard/matches" element={<MatchesPage />} />
          <Route path="/dashboard/likes" element={<LikesPage />} />
          <Route path="/dashboard/friends" element={<FriendsPage />} />
          <Route path="/dashboard/dropbox" element={<DropBoxPage />} />
          {/* Add more nested routes for other dashboard pages */}
        </Route>
       
       
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to='/' /> } />
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/' /> }/>
        {/* <Route path='/setting' element={authUser ? <SettingPage/> : <Navigate to='/login' />}   />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login' />} /> */}
         </Routes>
         <Toaster />
    </div>
  )
}

export default App