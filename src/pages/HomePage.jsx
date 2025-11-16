import React from 'react'
import {Link} from 'react-router-dom'

const HomePage = () => {
  return (
   <div className='landing-page'>
     <div className="container">
       <div className="logo">
         {/* Add your logo here */}
         <span style={{fontSize: '48px'}}>💕</span>
       </div>
       <h1 className="title">Turn strangers into soulmates.</h1>
       <p className="subtitle">Find your perfect match and start your love story today.</p>
       
       <div className="button-group">
         <Link to="/signup" className="button">
           Sign up
         </Link>
         <Link to="/login" className="button-white">
           Log in
         </Link>
       </div>
     </div>
   </div>
  )
}

export default HomePage