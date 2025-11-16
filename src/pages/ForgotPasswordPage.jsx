import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);
      await requestPasswordReset(email);
      
      // Navigate to OTP verification page
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/login')}>
        <ChevronLeft />
      </button>

      <div className="container">
        {/* Mail Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          border: '2px solid var(--primary-color)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Mail size={40} color="var(--primary-color)" />
        </div>

        <h1 className="title">Forgot Password?</h1>
        <p className="info-text">
          No worries! Enter your email and we'll send you a verification code.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label>Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
