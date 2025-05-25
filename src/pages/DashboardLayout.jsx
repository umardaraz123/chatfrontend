// components/Layout.js
import React, { useEffect,useState } from 'react';
import { Outlet } from 'react-router-dom'; // For dynamic routing to render different content
import { useAuthStore } from '../store/useAuthStore'
import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // useLocation hook
import { UserIcon } from 'lucide-react';
import { HiMenuAlt1 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
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
            <li><Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              Dashboard
            </Link></li>
            <li><Link
              to="/dashboard/profile"
              className={location.pathname === "/dashboard/profile" ? "active" : ""}
            >
              Profile
            </Link></li>
            <li><Link
              to="/dashboard/chat"
              className={location.pathname === "/dashboard/chat" ? "active" : ""}
            >
              Messages
            </Link></li>
            <li><Link
              to="/dashboard/find-love-one"
              className={location.pathname === "/dashboard/find-love-one" ? "active" : ""}
            >
              Find Love
            </Link></li>

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
