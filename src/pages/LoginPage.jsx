import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import {Eye, EyeOff, Loader2, ChevronLeft} from 'lucide-react'
import {Link, useNavigate} from 'react-router-dom'

const LoginPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleEmailLogin = () => {
    setShowEmailForm(true);
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth
    console.log('Google login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="signup-container">
      <button className="back-button" 
        onClick={(e) => {
          e.preventDefault();
          if (showEmailForm) {
            setShowEmailForm(false);
          } else {
            navigate('/');
          }
        }}>
        <ChevronLeft />
      </button>
      
      <div className="container">
        <h1 className="title">Log in to BonBon</h1>
        <p className="subtitle">Date Better</p>
        
        {!showEmailForm ? (
          // Show choice buttons
          <>
            <div>
              {/* Email Button */}
              <button type="button" className="button-white" onClick={handleEmailLogin}>
                <img src="/src/images/email.svg" alt="Email" />
                Continue with Email
              </button>

              {/* Google Button */}
              <button type="button" className="button-white" onClick={handleGoogleLogin}>
                <img src="/src/images/google.svg" alt="Google" />
                Continue with Google
              </button>
            </div>

            {/* Don't have account */}
            <div className="text-center mt-3">
              <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>

            {/* Privacy Policy */}
            <div className="privacy-policy-wrapper">
              <input type="checkbox" id="privacy" />
              <label htmlFor="privacy">
                By continuing you agree to the <a href="#">Term of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>
          </>
        ) : (
          // Show email/password form
          <form onSubmit={handleSubmit}>
          {/* Email Label */}
          <div className="input-wrapper">
            <label>E-mail</label>
            <input
              type="email"
              className="input"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <label>Password</label>
            <div className="input-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--link-color)', cursor: 'pointer'}}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--purple-color)'}}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password-link">
              Forget password?
            </Link>
          </div>

          {/* Login Button */}
          <button type="submit" className="button" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Privacy Policy */}
          <div className="privacy-policy-wrapper">
            <input type="checkbox" id="privacy" />
            <label htmlFor="privacy">
              By continuing you agree to the <a href="#">Term of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
        </form>
        )}
      </div>
    </div>
  )
};

export default LoginPage;
