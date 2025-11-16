import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SignUpStep1 from './pages/SignUpStep1'
import VerifyOTPSignup from './pages/VerifyOTPSignup'
import SignUpDetails from './pages/SignUpDetails'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import Listings from './pages/Listings'
import DashBoard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage_New'
import EditProfilePage from './pages/EditProfilePage'
import EditProfileFlow from './pages/EditProfileFlow'
import DashboardEdit from './pages/DashboardEdit'
import LikesPage from './pages/LikesPage'
import MatchesPage from './pages/MatchesPage'
import ChatContent from './pages/ChatContent'
import SwipePage from './pages/SwipePage';
import FriendsPage from './pages/FriendsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyOTPPage from './pages/VerifyOTPPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
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
          <Route path="/dashboard/profile/edit" element={authUser ? <EditProfilePage /> : <Navigate to="/login" />} />
          <Route path="/dashboard/profile/edit-flow" element={authUser ? <EditProfileFlow /> : <Navigate to="/login" />} />
          <Route path="/dashboard/profile-edit" element={authUser ? <DashboardEdit /> : <Navigate to="/login" />} />
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
        <Route path='/signup/step1' element={!authUser ? <SignUpStep1/> : <Navigate to='/' /> } />
        <Route path='/signup/verify' element={!authUser ? <VerifyOTPSignup/> : <Navigate to='/' /> } />
        <Route path='/signup/details' element={!authUser ? <SignUpDetails/> : <Navigate to='/' /> } />
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/' /> }/>
        <Route path='/forgot-password' element={!authUser ? <ForgotPasswordPage/> : <Navigate to='/' /> }/>
        <Route path='/verify-otp' element={!authUser ? <VerifyOTPPage/> : <Navigate to='/' /> }/>
        <Route path='/reset-password' element={!authUser ? <ResetPasswordPage/> : <Navigate to='/' /> }/>
        {/* <Route path='/setting' element={authUser ? <SettingPage/> : <Navigate to='/login' />}   />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login' />} /> */}
         </Routes>
         <Toaster />
    </div>
  )
}

export default App