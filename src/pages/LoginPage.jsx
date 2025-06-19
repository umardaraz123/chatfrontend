import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import {Eye, EyeClosed, EyeOff, Loader2, Lock, Mail, MessageSquare,User} from 'lucide-react'
import {Link} from 'react-router-dom'
import AuthImagePattern from '../components/AuthImagePattern.jsx'
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
   
    e.preventDefault();
    login(formData);
  };

  return (

    

     <div className="signup-container">
          <div className="container py-5">
          <div className="row align-items-center">
            {/* Left Side Form */}
            <div className="col-lg-6 d-flex ">
              <div className="w-100">
                <h1 className="title">Sign Up and Start Your Love Story</h1>
                <form onSubmit={handleSubmit}>
    
                  {/* First Name */}
                  <div className="row ">
                  
                    
                 
                  
    
                 
    
                  {/* Email */}
                  <div className="col-12 col-md-12 mb-3">
                  <div className="input-wrapper">
                    <label className="">Email</label>
                    <input
      type="email"
      className="input input-bordered w-full pl-10"
      placeholder="you@example.com"
      value={formData.email}
      onChange={(e) =>
        setFormData({ ...formData, email: e.target.value })
      }
    />
                  </div>
                  </div>
                  <div className="col-12 col-md-12 mb-4">
                  <div className="input-wrapper">
                    <label className="">Password</label>
                    <div className="input-password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button type="button" className="" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  </div>
                  
                 
                   
                 
                
                      </div>
                
    
    
                 
    
                  
    
                 
    
                 
    
                 
    
                  {/* Submit Button */}
                 <button type="submit" className="button w-100" disabled={isLoggingIn}>
  {isLoggingIn ? (
    <>
      <Loader2 className="size-5 animate-spin" />
      Loading...
    </>
  ) : (
    "Sign in"
  )}
</button>
    
                </form>
    
                {/* Already have account */}
                <div className="text-center mt-3">
                  <p>Dont have an account? <Link to="/signup">Sign up</Link></p>
                </div>
              </div>
            </div>
    
            {/* Right Side Image */}
            <div className="col-lg-6 mt-4 mt-lg-0 d-lg-block">
              <AuthImagePattern 
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
              />
            </div>
          </div>
        </div>
        </div>
  )
};

export default LoginPage;