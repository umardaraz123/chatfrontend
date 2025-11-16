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

        <div className="menu-container">
          {/* Profile Section */}
          <div className="menu-profile-section">
            <div className="menu-profile-image">
              {!userDetails?.profilePic ? (
                <div className="user-icon">
                  <UserIcon size={40} />
                </div>
              ) : (
                <img src={userDetails?.profilePic} alt="Profile" />
              )}
            </div>
            <h2 className="menu-profile-name">{userDetails?.fullName || userDetails?.firstName || 'User'}</h2>
            <p className="menu-profile-email">{userDetails?.email || ''}</p>
          </div>

          {/* Menu Items */}
          <nav className="menu-nav">
            <Link 
              to="/dashboard/profile/edit" 
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <User2Icon size={20} />
                </div>
                <span className="menu-item-text">Edit Profile</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>

            <Link 
              to="/dashboard/chat" 
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <MessageCircleCode size={20} />
                </div>
                <span className="menu-item-text">Messages</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>

            <Link 
              to="/dashboard/swipe" 
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <HeartHandshake size={20} />
                </div>
                <span className="menu-item-text">Discover</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>

            <Link 
              to="/dashboard/friends" 
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <Users size={20} />
                </div>
                <span className="menu-item-text">Friends</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>

            <Link 
              to="/dashboard/matches" 
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <Heart size={20} />
                </div>
                <span className="menu-item-text">Matches</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>

            <Link 
              to="/dashboard/likes" 
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <HeartHandshake size={20} />
                </div>
                <span className="menu-item-text">My Likes</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>

            <Link 
              to="/dashboard/dropbox" 
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <LayoutDashboardIcon size={20} />
                </div>
                <span className="menu-item-text">My DropBox</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </nav>
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
