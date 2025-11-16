import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const SignUpStep1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { sendSignupOTP } = useAuthStore();

  const handleContinue = async (e) => {
    e.preventDefault();
    if (email && agreed) {
      setIsLoading(true);
      try {
        // Send OTP to email
        await sendSignupOTP(email);
        // Store email and navigate to OTP verification
        localStorage.setItem('signupEmail', email);
        navigate('/signup/verify');
      } catch (error) {
        console.error('Error sending OTP:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/signup')}>
        <ChevronLeft />
      </button>

      <div className="container">
        <h1 className="title">Sign up to BonBon</h1>
        <p className="subtitle">Date Better</p>

        <form onSubmit={handleContinue}>
          <div className="input-wrapper">
            <label>Email</label>
            <input
              type="email"
              className="input"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Privacy Policy */}
          <div className="privacy-policy-wrapper">
            <input 
              type="checkbox" 
              id="privacy" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
            />
            <label htmlFor="privacy">
              By continuing you agree to the <a href="#">Term of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="button" disabled={!email || !agreed || isLoading}>
            {isLoading ? 'Sending...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpStep1;
