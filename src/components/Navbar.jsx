import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'
import { MessageSquare,Settings,LogOut,User, LogIn, ShieldUser } from 'lucide-react'
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { Home } from 'lucide-react'
import { Heart } from 'lucide-react'
import Logo from '../../src/images/logo.png'

const Navbar = () => {
  const{logout,authUser} = useAuthStore()

  return (
    <header
    className="custom-header "
  >
    <div className="container">
      <div className="main-wrapper">
        <div className="Logo">
          <Link
            to="/"
            
          >
           <img src={Logo} alt="logo" className='logo-image' />            
          </Link>
        </div>
  
        <div className="flex items-center gap-4">
       
{authUser && (
  <div className='links-wrapper'>
  <Link to="/dashboard" className='button'>
  < MdOutlineDashboardCustomize />
  <span className="link-text">Dashboard</span>
</Link>


<button className="button" onClick={logout}>
  <LogOut className="size-5" />
  <span className="link-text">Logout</span>
</button>
  </div>
)}
{!authUser && (
 <div className='links-wrapper'>
  <Link to="/login" className='link-wrapper'>
  <ShieldUser />
  <span className="link-text">Login</span>
</Link>
<Link to="/signup" className='link-wrapper'>
   <ShieldUser />
  <span className="link-text">Signup</span>
</Link>


  </div>
)}
        </div>
      </div>
    </div>
  </header>
  )
}

export default Navbar