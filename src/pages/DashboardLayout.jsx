// components/Layout.js
import React, { useEffect,useState } from 'react';
import { Outlet } from 'react-router-dom'; // For dynamic routing to render different content
import { useAuthStore } from '../store/useAuthStore'
import { 
  HeartHandshake, 
  LayoutDashboardIcon, 
  LogOut, 
  MessageCircleCode, 
  PowerOffIcon, 
  User2Icon,
  Users,  // Add this import
  Heart   // Add this import
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // useLocation hook
import { UserIcon } from 'lucide-react';
import { HiMenuAlt1 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { GiEgyptianProfile } from 'react-icons/gi';
const DashboardLayout = () => {
  const location = useLocation();
  const { getUserDetail, logout, userDetails } = useAuthStore();
  const [showMenu, setShowMenu] =useState(false);
  useEffect(() => {
    getUserDetail();
  }, [getUserDetail])
  return (
    <div className='dashboard-layout'>
      {/* Fixed Sidebar */}
      {showMenu && <div className="left">
        <div className="close-icon" onClick={() => setShowMenu(false)}>
         
            <IoCloseOutline />
          
        </div>

        <div className="top">
          <div className="user-info">
            {!userDetails?.profilePic ? <div className="user-icon">
              <UserIcon />
            </div> : <img src={userDetails?.profilePic} alt="Profile" width="50px" height='50px' />}

            <h2 className='user-name'>{userDetails?.firstName}</h2>
          </div>
          <ul className='links'>
            <li onClick={() => setShowMenu(false)}><Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
          <LayoutDashboardIcon />     Dashboard
            </Link></li>
            <li onClick={() => setShowMenu(false)}><Link
              to="/dashboard/profile"
              className={location.pathname === "/dashboard/profile" ? "active" : ""}
            >
             <GiEgyptianProfile /> Profile
            </Link></li>
            <li onClick={() => setShowMenu(false)}><Link
              to="/dashboard/chat"
              className={location.pathname === "/dashboard/chat" ? "active" : ""}
            >
           <MessageCircleCode />   Messages
            </Link></li>
            
         <li onClick={() => setShowMenu(false)}><Link
              to="/dashboard/swipe"
              className={location.pathname === "/dashboard/swipe" ? "active" : ""}
            >
           <HeartHandshake />   Discover
            </Link></li>
            <li onClick={() => setShowMenu(false)}>
  <Link 
    to="/dashboard/friends" 
    className={location.pathname === "/dashboard/friends" ? "active" : ""}
  >
    <Users size={20} />
    <span>Friends</span>
  </Link>
</li>

           <li onClick={() => setShowMenu(false)}>
             <Link to="/dashboard/matches" className="nav-item">
  <Users size={20} />
  <span>Matches</span>
</Link>
           </li>
<li onClick={() => setShowMenu(false)}>
<Link to="/dashboard/likes" className="nav-item">
  <Heart size={20} />
  <span>My Likes</span>
</Link></li>
            {/* <li onClick={() => setShowMenu(false)}><Link
              to="/dashboard/find-love-one"
              className={location.pathname === "/dashboard/find-love-one" ? "active" : ""}
            >
           <HeartHandshake />   Find Love
            </Link></li> */}

            {/* Add more sidebar links as needed */}
          </ul>
        </div>
        <div className="bottom">
          <button className="button" onClick={logout}>
            <LogOut className="size-5" />  Logout
          </button>
        </div>
      </div>}

      {/* Dynamic Content Area */}
      <main className='right'>
        <div className="menu-wrapper">
             {!userDetails?.profilePic ? <div className="user-image">
              <UserIcon />
            </div> : <div className="user-image"> <img src={userDetails?.profilePic} alt="Profile"  /> </div>}
          <div className="menu" onClick={() => setShowMenu(!showMenu)}>
        <HiMenuAlt1  />
          </div>
        </div>
        <Outlet /> {/* Dynamic content will be rendered here based on the route */}
      </main>
    </div>
  );
};

export default DashboardLayout;
